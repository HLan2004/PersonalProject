import React, {useState} from "react";
import styled from "styled-components";
import { Routes, Route, Outlet } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar";
import Home from "./page/Home";
import Auth from "./page/Auth";

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

    /* Apply blur + fade ngay trên chính thẻ <main> */
    filter: ${({ isBlurred }) => (isBlurred ? 'blur(6px)' : 'none')};
    opacity: ${({ isBlurred }) => (isBlurred ? 0.7 : 1)};
    transition: filter 0.3s ease-in-out, opacity 0.3s ease-in-out;
`




function Layout() {

    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

    const scrollToTop = () => {
        const mainContent = document.querySelector("main");
        if (mainContent) {
            mainContent.scrollTo({ top: 0, behavior: "smooth" });
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
                scrollToTop={scrollToTop}
                onToggle={handleRightSidebarToggle}
            />

        </AppContainer>
    );
}

function App() {
    return (
        <Routes>
            <Route path="/auth" element={<Auth />} />


            <Route path="/*" element={<Layout />}>
                <Route index element={<Home />} />
            </Route>
        </Routes>
    );
}

export default App;
