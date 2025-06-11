import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
    CloseIcon,
    MenuIcon,
    SearchIcon,
    CreatePostIcon, LogInIcon, LogOutIcon, // Changed from UpArrowIcon to LogoutIcon
} from "./Icon.jsx";
import { fetchCurrentUser } from "../service/users";
import {useNavigate} from "react-router-dom";
import {logout} from "../service/auth.js";

// Position it absolute so it doesn't affect the layout flow
const AppSidebarWrapper = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    display: flex;
    flex-direction: row-reverse;
    z-index: 10;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
    border-left: 3px solid #e8e8e8;

    /* when closed, only cover the 80px sidebar; when open, expand to show both panels */
    width: ${(props) => (props.isOpen ? "475px" : "80px")};
    overflow: hidden;
    transition: width 0.3s ease-in-out;
`;

// Keep the original sliding container with translateX
const SlidingContainer = styled.div`
    position: relative;
    top: 0;
    right: 0;
    height: 100%;
    width: 475px; /* total width */
    transform: translateX(${(props) => (props.isOpen ? "0" : "395px")});
    transition: transform 0.3s ease-in-out;
    display: flex;
    flex-direction: row-reverse;
`;

const SidebarContainer = styled.aside`
    width: 80px;
    min-width: 80px;
    background-color: ${(props) => (props.isOpen ? "#f0f0f0" : "white")};
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    box-shadow: ${(props) =>
            props.isOpen
                    ? "-2px 0 10px rgba(0, 0, 0, 0.1)"
                    : "-2px 0 10px rgba(0, 0, 0, 0.05)"};
    height: 100vh;
    z-index: 11;
    border-right: 1.5px solid #e8e8e8;
    transition: all 0.3s ease-in-out;
`;



const Button = styled.button`
    background-color: ${(props) => props.bgColor || "#ffd97d"};
    border: none;
    width: 80px; /* Full width to touch edges */
    height: 80px; /* Square shape */
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin: 0; /* Remove all margins to make buttons touch */
    border-radius: 0; /* Remove border radius to make it square */

    &:hover {
        background-color: ${(props) => props.hoverColor || "#ffca45"};
    }
`;

const MenuButton = styled(Button)`
    background-color: ${(props) => props.bgColor || "#f5f5f5"};

    &:hover {
        background-color: ${(props) => props.hoverColor || "#eee"};
    }
`;

const CreatePostButton = styled(Button)`
    background-color: #f5f5f5;
    color: #777;
    margin-top: auto;


    &:hover {
        background-color: #eee;
    }
`;

const AuthButton = styled(Button)`
    background-color: ${props => props.user ? '#e74c3c' : '#3498db'};
    color: white;
    margin-bottom: 0;
    border-radius: 0;
    width: 80px;
    height: 80px;

    &:hover {
        background-color: ${props => props.user ? '#c0392b' : '#2980b9'};
    }
`;



const ProfilePanel = styled.div`
    background-color: white;
    width: 395px;
    height: 100vh;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

/* NEW: single header for image + content */
const ProfileHeader = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 2rem 1rem;
    gap: 0.5rem;
    margin: 40px 0 0;
`;

const ProfileImageBorder = styled.div`
    width: 80%;
    height: 325px;
    border: 2.5px solid #ffd97d;
    border-radius: 4px;
    padding: 5px;
    position: relative;

    &:before,
    &:after {
        content: "";
        position: absolute;
        width: 85%;
        height: 6px;
        background-color: #ffd97d;
        left: 50%;
        transform: translateX(-50%);
    }

    &:before {
        top: -6px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
    }

    &:after {
        bottom: -6px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }
`;

const ProfileImage = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const ProfileName = styled.h2`
    font-size: 1.75rem;
    font-weight: 600;
    margin: 22px 0 0;
    color: #222;
    text-align: center;
`;

const ProfileEmail = styled.p`
    color: #777;
    margin: 0;
    font-size: 1rem;
`;

const ProfileBio = styled.p`
    color: #555;
    line-height: 1.7;
    align-self: center;
    text-align: left;
    margin: 10px 0 0;
    font-size: 1rem;
    max-width: 80%;
`;

const RightSidebar = ({ onToggle, onLogout }) => { // Changed from scrollToTop to onLogout prop
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        onToggle(isOpen);
    }, [isOpen, onToggle]);

    const toggleSidebar = () => setIsOpen((prev) => !prev);

    const navigate = useNavigate();

    const handleLogout = () => {
        if (user) {
            // User is logged in, perform logout
            if (onLogout) {
                onLogout();
            } else {
                logout();
            }
            navigate("/app");
        } else {
            navigate("/auth");
        }
    };



    const handleCreatePost = () => {
        navigate("/app/create-post");
    };


    useEffect(() => {
        fetchCurrentUser()
            .then(response => {
                if (response && response.data) {
                    const current = response.data;
                    current.blogUsername = current.username;
                    current.blogEmail    = current.email;
                    setUser(current);

                }
            })
            .catch(err => {
                console.error("Failed to load user:", err);
                setUser(null);
            });
    }, []);

    return (
        <AppSidebarWrapper isOpen={isOpen}>
            <SlidingContainer isOpen={isOpen}>
                <ProfilePanel>
                    <ProfileHeader>
                        <ProfileImageBorder>
                            <ProfileImage>
                                <img
                                    src={
                                        user?.imageData
                                            ? `data:${user.imageType};base64,${user.imageData}`
                                            : "/api/placeholder/160/160"
                                    }
                                    alt="Profile"
                                />
                            </ProfileImage>

                        </ProfileImageBorder>

                        <ProfileName>
                            {user ? `${user.blogUsername}` : "Guest User"}
                        </ProfileName>

                        <ProfileEmail>
                            {user ? user.blogEmail : "guest@example.com"}
                        </ProfileEmail>

                        <ProfileBio>
                            {user
                                ? user.about || "Welcome to your dashboard!"
                                : "Loading your profile..."}
                        </ProfileBio>
                    </ProfileHeader>
                </ProfilePanel>

                <SidebarContainer isOpen={isOpen}>
                    <Button bgColor="#ffd97d" hoverColor="#ffca45">
                        <SearchIcon />
                    </Button>

                    <MenuButton
                        bgColor={isOpen ? "#e8e8e8" : "#f5f5f5"}
                        hoverColor={isOpen ? "#ddd" : "#eee"}
                        onClick={toggleSidebar}
                    >
                        {isOpen ? <CloseIcon /> : <MenuIcon />}
                    </MenuButton>

                    <CreatePostButton onClick={handleCreatePost}>
                        <CreatePostIcon />
                    </CreatePostButton>

                    <AuthButton user={user} size="40px" onClick={handleLogout}>
                        {user ? <LogOutIcon /> : <LogInIcon />}
                    </AuthButton>

                </SidebarContainer>

            </SlidingContainer>
        </AppSidebarWrapper>
    );
};

export default RightSidebar;