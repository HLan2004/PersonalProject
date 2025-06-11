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

// Import your auth services
import { isAuthenticated, logout } from "./service/auth";
import activityTracker from "./service/activityTracker";

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

// Protected Route Component
function ProtectedRoute({ children }) {
    if (!isAuthenticated()) {
        return <Navigate to="/auth" replace />;
    }
    return children;
}

function Layout() {
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
    const navigate = useNavigate();

    // Initialize activity tracking when layout mounts (user is authenticated)
    useEffect(() => {
        if (isAuthenticated()) {
            activityTracker.startTracking();
            console.log('Activity tracking started for authenticated user');
        }

        // Cleanup when layout unmounts
        return () => {
            activityTracker.stopTracking();
            console.log('Activity tracking stopped');
        };
    }, []);

    const handleLogout = async () => {
        try {
            // Stop activity tracking
            activityTracker.stopTracking();

            // Call backend logout and clear tokens
            await logout();

            console.log('User logged out successfully');
            navigate('/auth');
        } catch (error) {
            console.error('Logout error:', error);
            // Even if backend call fails, navigate to auth
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
            {/* Public route for authentication */}
            <Route path="/auth" element={<Auth />} />

            {/* Redirect root to app by default */}
            <Route
                path="/"
                element={<Navigate to="/app" replace />}
            />

            {/* Public routes - no authentication required */}
            <Route path="/app" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="post/:id" element={<PostPage />} />
                <Route path="create-post" element={<CreatePostPage />} />
                <Route path="recipes" element={<RecipePage />} />
                <Route path="calendar" element={<CalendarPage />} />
            </Route>

            {/* Catch all - redirect to app */}
            <Route
                path="*"
                element={<Navigate to="/app" replace />}
            />
        </Routes>

    );
}

export default App;