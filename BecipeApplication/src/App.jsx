import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Routes, Route, Outlet, useNavigate, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar";
import Home from "./page/Home";
import Auth from "./page/Auth";
import PostPage from "./page/PostPage";
import RecipePage from "./page/RecipePage";
import CalendarPage from "./page/CalendarPage";
import CreatePostPage from "./page/CreatePostPage";
import { isAuthenticated, logout } from "./service/auth";
import activityTracker from "./service/activityTracker";
import UserRecipePage from "./page/UserRecipePage";
import UserPage from "./page/UserPage.jsx";
import UpdateUserPage from "./page/UpdateUserPage";
import UpdatePostPage from "./page/UpdatePostPage";
import ContactPage from "./page/ContactPage";

const AppContainer = styled.div`
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
`;

const MainContent = styled.main`
    flex: 1;
    position: relative;
    overflow-y: auto;
    background-color: #EEEEEE;

    filter: ${({ isBlurred }) => (isBlurred ? 'blur(6px)' : 'none')};
    opacity: ${({ isBlurred }) => (isBlurred ? 0.7 : 1)};
    transition: filter 0.3s ease-in-out, opacity 0.3s ease-in-out;
`;

function Layout() {
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) {
            activityTracker.startTracking();
            console.log('Activity tracking started for authenticated user');
        }

        return () => {
            activityTracker.stopTracking();
            console.log('Activity tracking stopped');
        };
    }, []);

    const handleLogout = async () => {
        try {
            activityTracker.stopTracking();
            await logout();

            console.log('User logged out successfully');
            navigate('/auth');
        } catch (error) {
            console.error('Logout error:', error);
            navigate('/auth');
        }
    };

    const handleRightSidebarToggle = (isOpen) => {
        setIsRightSidebarOpen(isOpen);
    };

    const handleMainClick = () => {
        if (isRightSidebarOpen) {
            setIsRightSidebarOpen(false);
        }
    };

    return (
        <AppContainer>
            <Sidebar />
            <MainContent
                style={{ overflowY: "auto", flex: 1 }}
                isBlurred={isRightSidebarOpen}
                onClick={handleMainClick}
            >
                <Outlet />
            </MainContent>

            <RightSidebar
                onLogout={handleLogout}
                onToggle={handleRightSidebarToggle}
            />
        </AppContainer>
    );
}

function App() {
    return (
        <Routes>
            <Route path="/auth" element={<Auth />} />

            <Route
                path="/"
                element={<Navigate to="/app" replace />}
            />

            <Route path="/app" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="post/:id" element={<PostPage />} />
                <Route path="create-post" element={<CreatePostPage />} />
                <Route path="recipes" element={<RecipePage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="user-recipes/:categoryId" element={<UserRecipePage />} />
                <Route path="profile" element={<UserPage />} />
                <Route path="profile/edit" element={<UpdateUserPage />} />
                <Route path="/app/user/:userId" element={<UserPage />} />
                <Route path="update-post/:id" element={<UpdatePostPage />} />
                <Route path="contact" element={<ContactPage/>} />
            </Route>

            <Route
                path="*"
                element={<Navigate to="/app" replace />}
            />
        </Routes>

    );
}

export default App;