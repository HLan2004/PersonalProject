
import React, {useEffect, useState} from "react";
import styled from "styled-components";
import logoImage from "../assets/trans_bg_logo.png";
import {useNavigate, useLocation} from "react-router-dom";
import {fetchTrendingPost} from "../service/posts.js";

const SidebarWrapper = styled.div`
    position: relative;
    /* height: 100vh; */
    display: flex;
`;

const SidebarContainer = styled.aside`
    width: 330px;
    /* height: 100vh; */
    background-color: white;
    display: flex;
    flex-direction: column;
    border-right: 3px solid #e8e8e8;
    /* overflow-y: hidden; */
`;

const Logo = styled.div`
    display: flex;
    justify-content: center;
    padding: 32px 0 0;
    max-width: 160px;
    max-height: 140px;
    margin: 0 auto;
    overflow: hidden;

    img {
        width: 130%;
        height: 120%;
        transform: scale(1.25);
        transform-origin: bottom;
    }
`;

const DividerWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0.15rem 0;
`;

const Divider = styled.hr`
    border: 0;
    height: 1px;
    background-color: #dddddd;
    width: 100%;
`;

const CrownIcon = styled.div`
    background-color: #f0f0f0;
    padding: 0.15rem;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 1.5rem;

    svg {
        width: 24px;
        height: 24px;
        color: #c00;
    }
`;

const NavMenu = styled.nav`
    padding: 0.85rem 0;
    text-align: center;

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    li {
        position: relative;
        padding: 0.55rem 1.5rem;
        font-size: 1.25rem;
        font-weight: 400;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s ease, background-color 0.2s ease;

        &.active {
            color: #c00;
            font-weight: 600;
        }

        &:hover {
            background-color: transparent;
            color: #c00;
        }

        &::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 0;
            height: 2px;
            background: #c00;
            transition: width 0.35s cubic-bezier(0.25, 0.8, 0.25, 1),
            left 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        &:hover::after {
            left: calc(50% - 15%);
            width: 30%;
        }
    }

    span {
        margin-left: 0.25rem;
    }
`;

const WeeklyRecipesSection = styled.div`
    padding: 0.5rem 1rem;

    h3 {
        margin: 0 auto 10px;
        text-align: center;
        font-size: 0.75rem;
        font-weight: 500;
        color: #888;
        letter-spacing: 0.2px;
        text-transform: none;
    }
`;

const RecipeItemContainer = styled.div`
    margin: 1.25rem 0.75rem;
`;

const WeeklyRecipeItem = styled.fieldset`
    position: relative;
    border: 1px solid #ffc107;
    border-radius: 6px;
    padding: 0;
    margin: 0;
    overflow: hidden;
    height: 180px;

    legend {
        position: absolute;
        bottom: 12px;
        left: 12px;
        background-color: #ffc107;
        color: #333;
        font-size: 0.9rem;
        font-weight: 600;
        padding: 0.4rem 0.75rem;
        border-radius: 6px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
        z-index: 2;
    }

    img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: fill;
    }
`;

const RecipeTitle = styled.h4`
    font-size: 1.2rem;
    margin: 0.75rem 100px 0 0;
    font-weight: 480;
    text-align: left;

`;

const Sidebar = () => {
    const [activeNav, setActiveNav] = useState("Home");
    const [trendingPost, setTrendingPost] = useState({
        imageData: '',
        imageType: '',
        cuisine: 'Loading...',
        title: 'Loading...'
    });

    const navigate = useNavigate();
    const location = useLocation();

    const getActiveNavFromPath = (pathname) => {
        if (pathname === '/app' || pathname === '/app/') {
            return 'Home';
        } else if (pathname === '/app/recipes') {
            return 'Recipes';
        } else if (pathname === '/app/calendar') {
            return 'Calendar';
        }
        return 'Home'; // default
    };

    useEffect(() => {
        const currentActiveNav = getActiveNavFromPath(location.pathname);
        setActiveNav(currentActiveNav);
    }, [location.pathname]);

    const handleNavigateApp = () => {
        setActiveNav("Home");
        navigate("/app");
    };

    const handleNavClick = (label, path) => {
        setActiveNav(label);
        navigate(path);
    };

    useEffect(() => {
        fetchTrendingPost()
            .then(response => {
                if (response.data) {
                    setTrendingPost(response.data);
                } else {
                    setTrendingPost({
                        imageData: '',
                        imageType: '',
                        cuisine: 'No cuisine found',
                        title: 'No trending post'
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching trending post:', error);
                setTrendingPost({
                    imageData: '',
                    imageType: '',
                    cuisine: 'Error loading cuisine',
                    title: 'Error loading post'
                });
            });
    }, []);

    const imageUrl = trendingPost.imageData
        ? `data:${trendingPost.imageType || 'image/jpeg'};base64,${trendingPost.imageData}`
        : "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";

    return (
        <SidebarWrapper>
            <SidebarContainer>
                <Logo onClick={handleNavigateApp}>
                    <img src={logoImage} alt="Recipe" />
                </Logo>

                <Divider />

                <NavMenu>
                    <ul>
                        <li
                            className={activeNav === "Home" ? "active" : ""}
                            onClick={() => handleNavClick("Home", "/app")}
                        >
                            Home
                        </li>
                        <li
                            className={activeNav === "Recipes" ? "active" : ""}
                            onClick={() => handleNavClick("Recipes", "/app/recipes")}
                        >
                            Recipes
                        </li>

                        <li
                            className={activeNav === "Calendar" ? "active" : ""}
                            onClick={() => handleNavClick("Calendar", "/app/calendar")}
                        >
                            Calendar
                        </li>
                        <li
                            className={activeNav === "About" ? "active" : ""}
                            onClick={() => setActiveNav("About")}
                        >
                            About
                        </li>
                        <li
                            className={activeNav === "Contact" ? "active" : ""}
                            onClick={() => setActiveNav("Contact")}
                        >
                            Contact
                        </li>
                    </ul>
                </NavMenu>

                <DividerWrapper>
                    <Divider />
                    <CrownIcon>
                        <div>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M5,16L3,5L8.5,12L12,5L15.5,12L21,5L19,16H5M19,19A1,1 0 0,1 18,20H6A1,1 0 0,1 5,19V18H19V19Z" />
                            </svg>
                        </div>
                    </CrownIcon>
                    <Divider />
                </DividerWrapper>

                <WeeklyRecipesSection>
                    <h3>THIS WEEK'S RECIPES</h3>
                    <RecipeItemContainer>
                        <WeeklyRecipeItem>
                            <legend>{trendingPost.cuisine ? String(trendingPost.cuisine).toUpperCase() : 'NO CUISINE'}</legend>
                            <img
                                src={imageUrl}
                                alt={trendingPost.title || 'Recipe image'}
                            />
                        </WeeklyRecipeItem>
                        <RecipeTitle>{trendingPost.title || 'No title available'}</RecipeTitle>
                    </RecipeItemContainer>
                </WeeklyRecipesSection>

            </SidebarContainer>
        </SidebarWrapper>
    );
};

export default Sidebar;