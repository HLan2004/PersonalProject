import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
    CloseIcon,
    FacebookIcon,
    InstagramIcon,
    MenuIcon,
    SearchIcon,
    TwitterIcon,
    UpArrowIcon,
} from "./Icon.jsx";
import { Blogger } from "../service/BloggerService.js";

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
    padding: 1rem 0;
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
    width: ${(props) => props.size || "50px"};
    height: ${(props) => props.size || "50px"};
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-bottom: 1rem;

    &:hover {
        background-color: ${(props) => props.hoverColor || "#ffca45"};
    }
`;

const SocialLinks = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
    padding: 2rem 0;

    a {
        margin-bottom: 1.5rem;
        color: #333;

        &:hover {
            color: #e74c3c;
        }
    }
`;

const ScrollToTopButton = styled(Button)`
    background-color: #e74c3c;
    color: white;
    margin-top: auto;
    margin-bottom: 2rem;

    &:hover {
        background-color: #c0392b;
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
    width: 170px;
    height: 170px;
    border: 1px solid #ffd97d;
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
    max-width: 90%;
`;

const CategorySection = styled.div`
    width: 100%;
    margin-top: auto;
    border-top: 1px solid #f0f0f0;
    padding-top: 1rem;
    position: relative;

    &:before {
        content: "";
        position: absolute;
        width: 50%;
        height: 4px;
        background-color: #ffd97d;
        top: -2px;
        left: 50%;
        transform: translateX(-50%);
    }
`;

const CategoryTitle = styled.h3`
    font-size: 0.85rem;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-align: center;
    position: relative;
    margin: 0 0 1rem;
    font-weight: 600;
`;

const RightSidebar = ({ scrollToTop, onToggle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [bloggers, setBloggers] = useState([]);

    useEffect(() => {
        onToggle(isOpen);
    }, [isOpen, onToggle]);

    useEffect(() => {
        Blogger()
            .then((response) => setBloggers(response.data))
            .catch((error) => console.error(error));
    }, []);

    const toggleSidebar = () => setIsOpen((prev) => !prev);

    return (
        <AppSidebarWrapper isOpen={isOpen}>
            <SlidingContainer isOpen={isOpen}>
                <ProfilePanel>
                    <ProfileHeader>
                        <ProfileImageBorder>
                            <ProfileImage>
                                <img
                                    src="/api/placeholder/160/160"
                                    alt="Melany Rose"
                                />
                            </ProfileImage>
                        </ProfileImageBorder>

                        <ProfileName>
                            {bloggers.length > 0
                                ? bloggers.map((b) => `${b.firstName} ${b.lastName}`)
                                : "Melany Rose"}
                        </ProfileName>

                        <ProfileEmail>
                            {bloggers.length > 0
                                ? bloggers.map((b) => b.email)
                                : "melanyfoodrecipes@gmail.com"}
                        </ProfileEmail>

                        <ProfileBio>
                            Come join me in my culinary adventures where we'll be using simple,
                            fresh ingredients and transforming them into sophisticated and
                            elegant meals for the everyday home cook.
                        </ProfileBio>
                    </ProfileHeader>

                    <CategorySection>
                        <CategoryTitle>CATEGORIES</CategoryTitle>
                    </CategorySection>
                </ProfilePanel>

                <SidebarContainer isOpen={isOpen}>
                    <Button bgColor="#ffd97d" hoverColor="#ffca45">
                        <SearchIcon />
                    </Button>

                    <Button
                        bgColor={isOpen ? "#e8e8e8" : "#f5f5f5"}
                        size="40px"
                        hoverColor={isOpen ? "#ddd" : "#eee"}
                        onClick={toggleSidebar}
                    >
                        {isOpen ? <CloseIcon /> : <MenuIcon />}
                    </Button>

                    <SocialLinks>
                        <a href="#"><FacebookIcon /></a>
                        <a href="#"><TwitterIcon /></a>
                        <a href="#"><InstagramIcon /></a>
                    </SocialLinks>

                    <ScrollToTopButton size="40px" onClick={scrollToTop}>
                        <UpArrowIcon />
                    </ScrollToTopButton>
                </SidebarContainer>
            </SlidingContainer>
        </AppSidebarWrapper>
    );
};

export default RightSidebar;
