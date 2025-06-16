import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {CloseIcon, MenuIcon, SearchIcon, CreatePostIcon, LogInIcon, LogOutIcon,} from "./Icon.jsx";
import {fetchCurrentUser, fetchMyPostsByMealCategory, searchUsers} from "../service/users";
import {useNavigate} from "react-router-dom";
import {logout} from "../service/auth.js";
import {fetchMealCategories} from "../service/cate.js";

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
    
    width: ${(props) => (props.isOpen ? "475px" : "80px")};
    overflow: hidden;
    transition: width 0.3s ease-in-out;
`;

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
    width: 80px; 
    height: 80px; 
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin: 0; 
    border-radius: 0; 

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
    background-color: white;
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
    min-width: 395px;
    max-width: 395px;
    height: 100vh;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
`;

const ProfileHeader = styled.div`
    width: 100%;
    max-width: 395px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 1.5rem 1rem;
    gap: 0.5rem;
    margin: 40px 0 0;
    box-sizing: border-box;
`;

const ProfileImageBorder = styled.div`
    width: 80%;
    max-width: 280px;
    height: 325px;
    border: 2.5px solid #ffd97d;
    border-radius: 4px;
    padding: 5px;
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(255, 217, 125, 0.3);
        border-color: #ffca45;
    }

    &:before,
    &:after {
        content: "";
        position: absolute;
        width: 85%;
        height: 6px;
        background-color: #ffd97d;
        left: 50%;
        transform: translateX(-50%);
        transition: background-color 0.3s ease;
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

    &:hover:before,
    &:hover:after {
        background-color: #ffca45;
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
        transition: transform 0.3s ease;
    }

    ${ProfileImageBorder}:hover & img {
        transform: scale(1.05);
    }
`;

const ProfileName = styled.h2`
    font-size: 1.875rem;
    font-weight: 700;
    margin: 16px 0 10px;
    color: #1a1a1a;
    text-align: center;
    letter-spacing: -0.025em;
    line-height: 1.2;
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 8px 16px;
    border-radius: 12px;

    &:hover {
        background: linear-gradient(135deg, #ff8c42, #e67e22);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        transform: translateY(-2px);
    }

    &::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%);
        width: 40px;
        height: 2px;
        background: linear-gradient(90deg, #ffd97d, #ffca45);
        border-radius: 1px;
        transition: all 0.3s ease;
    }

    &:hover::after {
        width: 60px;
        background: linear-gradient(90deg, #ff8c42, #e67e22);
    }
`;

const ProfileEmail = styled.p`
    color: #6b7280;
    margin: 2px 0 6px;
    font-size: 0.85rem;
    font-weight: 500;
    text-align: center;
    background: rgba(107, 114, 128, 0.08);
    padding: 6px 12px;
    border-radius: 16px;
    display: inline-block;
    border: 1px solid rgba(107, 114, 128, 0.1);
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
        background: rgba(107, 114, 128, 0.12);
        transform: translateY(-1px);
    }
`;

const ProfileBio = styled.p`
    color: #4b5563;
    line-height: 1.65;
    text-align: center;
    margin: 4px 0 0;
    font-size: 0.85rem;
    max-width: 85%;
    font-weight: 400;
    background: rgba(255, 255, 255, 0.7);
    padding: 16px 20px;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow:
            0 1px 3px rgba(0, 0, 0, 0.05),
            0 1px 2px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    position: relative;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        transform: translateY(-2px);
        box-shadow:
                0 4px 6px rgba(0, 0, 0, 0.07),
                0 1px 3px rgba(0, 0, 0, 0.1);
        background: rgba(255, 255, 255, 0.85);
    }

    &::before {
        content: '"';
        position: absolute;
        top: -8px;
        left: 12px;
        font-size: 2rem;
        color: #ffd97d;
        font-family: serif;
        line-height: 1;
    }

    &::after {
        content: '"';
        position: absolute;
        bottom: -16px;
        right: 12px;
        font-size: 2rem;
        color: #ffd97d;
        font-family: serif;
        line-height: 1;
    }
`;

const CategorySection = styled.div`
    width: 100%;
    max-width: 395px;
    padding: 0 1.5rem;
    margin: 5rem auto 2rem;
    box-sizing: border-box;
`;

const CategoryHeader = styled.div`
    text-align: center;
    margin-bottom: 1.5rem;
`;

const CategoryHeaderTitle = styled.h2`
    color: #4b5563;
    font-size: 12px;
    font-weight: normal;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin: 0 0 12px 0;
`;

const CategoryHeaderLine = styled.div`
    width: 32px;
    height: 1px;
    background-color: #fbbf24;
    margin: 0 auto;
`;

const CategoriesContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: 100%;
`;

const CategoryItem = styled.div`
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    min-width: 0;
`;

const CategoryName = styled.span`
    color: #374151;
    font-weight: normal;
    font-size: 16px;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const CountBadge = styled.span`
    background-color: #d1d5db;
    color: #4b5563;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: normal;
    flex-shrink: 0;
`;

const CategoryButtonContainer = styled.div`
    text-align: center;
    margin-top: 24px;
    width: 100%;
    padding: 0 16px;
`;

const CategoryButton = styled.button`
    color: #6b7280;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: capitalize;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1.5px solid #e2e8f0;
    border-radius: 20px;
    padding: 10px 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover {
        color: #374151;
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        border-color: #cbd5e1;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        transition: left 0.5s;
    }

    &:hover::before {
        left: 100%;
    }
`;

const SearchOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease-out;

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

const SearchModal = styled.div`
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border-radius: 20px;
    padding: 0;
    width: 90%;
    max-width: 600px;
    max-height: 85vh;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    animation: slideUp 0.3s ease-out;
    border: 1px solid rgba(0, 0, 0, 0.04);

    @keyframes slideUp {
        from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }
        to { 
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
`;

const SearchHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32px 32px 24px;
    background: linear-gradient(135deg, #ff8c42 0%, #e67e22 100%);
    color: white;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    }
`;

const SearchTitleContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const SearchTitle = styled.h2`
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0;
    color: white;
`;

const SearchCloseButton = styled.button`
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;
    padding: 12px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
    
    &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.05);
    }
`;

const SearchInputContainer = styled.div`
    padding: 32px 32px 24px;
    background: white;
`;

const SearchInputWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

const SearchInputIcon = styled.div`
    position: absolute;
    left: 20px;
    color: #9ca3af;
    z-index: 2;
    display: flex;
    align-items: center;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 16px 20px 16px 56px;
    border: 2px solid #ffb366;
    border-radius: 16px;
    font-size: 16px;
    outline: none;
    transition: all 0.3s ease;
    background: #fff8f3;
    color: #374151;
    
    &:focus {
        border-color: #ff8c42;
        background: white;
        box-shadow: 0 0 0 4px rgba(255, 140, 66, 0.1);
        transform: translateY(-1px);
    }
    
    &::placeholder {
        color: #9ca3af;
        font-weight: 400;
    }
`;

const ClearButton = styled.button`
    position: absolute;
    right: 16px;
    background: #f3f4f6;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    transition: all 0.2s ease;
    
    &:hover {
        background: #e5e7eb;
        color: #374151;
    }
`;

const SearchResults = styled.div`
    max-height: 50vh;
    overflow-y: auto;
    background: white;
    
    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: #f1f5f9;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
    }
`;

const ResultsHeader = styled.div`
    padding: 16px 32px 8px;
    border-bottom: 1px solid #f1f5f9;
`;

const ResultsCount = styled.div`
    font-size: 14px;
    color: #6b7280;
    font-weight: 500;
`;

const ResultsList = styled.div`
    padding: 8px 0 24px;
`;

const SearchResultItem = styled.div`
    display: flex;
    align-items: center;
    padding: 16px 32px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    
    &:hover {
        background: linear-gradient(135deg, #fff8f3 0%, #fef3e2 100%);
        transform: translateX(4px);
        
        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(135deg, #ff8c42 0%, #e67e22 100%);
            border-radius: 0 2px 2px 0;
        }
    }
`;

const SearchUserAvatarContainer = styled.div`
    position: relative;
    margin-right: 16px;
`;

const SearchUserAvatar = styled.img`
    width: 52px;
    height: 52px;
    border-radius: 16px;
    object-fit: cover;
    border: 3px solid #e5e7eb;
    transition: all 0.2s ease;
    
    ${SearchResultItem}:hover & {
        border-color: #ff8c42;
        transform: scale(1.05);
    }
`;

const OnlineIndicator = styled.div`
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 14px;
    height: 14px;
    background: #10b981;
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SearchUserInfo = styled.div`
    flex: 1;
    min-width: 0;
`;

const SearchUserName = styled.div`
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 4px;
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const SearchUserEmail = styled.div`
    font-size: 14px;
    color: #6b7280;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const ViewProfileButton = styled.div`
    background: linear-gradient(135deg, #ff8c42 0%, #e67e22 100%);
    color: white;
    padding: 8px 16px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    opacity: 0;
    transform: translateX(10px);
    transition: all 0.2s ease;
    
    ${SearchResultItem}:hover & {
        opacity: 1;
        transform: translateX(0);
    }
`;

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    gap: 16px;
`;

const LoadingSpinner = styled.div`
    width: 40px;
    height: 40px;
    border: 3px solid #fff8f3;
    border-top: 3px solid #ff8c42;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

const LoadingText = styled.div`
    color: #6b7280;
    font-size: 16px;
    font-weight: 500;
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 40px;
    text-align: center;
`;

const EmptyStateIcon = styled.div`
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.8;
`;

const EmptyStateTitle = styled.h3`
    font-size: 20px;
    font-weight: 600;
    color: #374151;
    margin: 0 0 8px 0;
`;

const EmptyStateText = styled.p`
    color: #6b7280;
    font-size: 16px;
    line-height: 1.5;
    max-width: 320px;
    margin: 0;
`;

const RightSidebar = ({ onToggle, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [mealCategories, setMealCategories] = useState([]);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const navigate = useNavigate()
    const [categoryCounts, setCategoryCounts] = useState({})
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await searchUsers(query);
            setSearchResults(response.data || []);
        } catch (error) {
            console.error('Search failed:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Debounce search - wait 300ms after user stops typing
        const timeoutId = setTimeout(() => {
            handleSearch(query);
        }, 300);

        return () => clearTimeout(timeoutId);
    };

    const handleUserClick = (userId) => {
        setShowSearchModal(false);
        setSearchQuery('');
        setSearchResults([]);
        navigate(`/app/user/${userId}`);
    };

    const handleSearchClick = () => {
        setShowSearchModal(true);
    };

    const handleCloseSearch = () => {
        setShowSearchModal(false);
        setSearchQuery('');
        setSearchResults([]);
    };


    useEffect(() => {
        fetchMealCategories()
            .then(res => {
                setMealCategories(res.data);
            })
            .catch(err => console.error("Failed to load meal categories:", err));
    }, []);

    useEffect(() => {
        const fetchCategoryCounts = async () => {
            const counts = {}
            for (const category of mealCategories) {
                try {
                    const response = await fetchMyPostsByMealCategory(category.id)
                    counts[category.id] = response.data.length
                } catch (error) {
                    console.error(`Error fetching posts for category ${category.id}:`, error)
                    counts[category.id] = 0
                }
            }
            setCategoryCounts(counts)
        }

        if (mealCategories.length > 0) {
            fetchCategoryCounts()
        }
    }, [mealCategories])

    const handleCategoryClick = (categoryId, categoryTitle) => {
        navigate(`/app/user-recipes/${categoryId}`, {
            state: { categoryTitle }
        })
    }

    const handleProfileClick = () => {
        navigate('/app/profile');
    }

    const toggleShowCategories = () => {
        setShowAllCategories(!showAllCategories);
    };

    useEffect(() => {
        onToggle(isOpen);
    }, [isOpen, onToggle]);

    const toggleSidebar = () => setIsOpen((prev) => !prev);

    const handleLogout = () => {
        if (user) {
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
                    current.blogEmail = current.email;
                    setUser(current);
                }
            })
            .catch(err => {
                console.error("Failed to load user:", err);
                setUser(null);
            });
    }, []);

    return (
        <>
            <AppSidebarWrapper isOpen={isOpen}>
                <SlidingContainer isOpen={isOpen}>
                    <ProfilePanel>
                        <ProfileHeader>
                            <ProfileImageBorder onClick={handleProfileClick}>
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

                            <ProfileName onClick={handleProfileClick}>
                                {user ? `${user.blogUsername}` : "Guest User"}
                            </ProfileName>

                            <ProfileEmail onClick={handleProfileClick}>
                                {user ? user.blogEmail : "guest@example.com"}
                            </ProfileEmail>

                            <ProfileBio onClick={handleProfileClick}>
                                {user
                                    ? user.about || "Welcome to your dashboard!"
                                    : "Loading your profile..."}
                            </ProfileBio>
                        </ProfileHeader>

                        <CategorySection>
                            <CategoryHeader>
                                <CategoryHeaderTitle>
                                    Categories
                                </CategoryHeaderTitle>
                                <CategoryHeaderLine />
                            </CategoryHeader>

                            <CategoriesContainer>
                                {(showAllCategories ? mealCategories : mealCategories.slice(0, 3)).map(category => (
                                    <CategoryItem
                                        key={category.id}
                                        onClick={() => handleCategoryClick(category.id, category.mealCateTitle)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <CategoryName>{category.mealCateTitle}</CategoryName>
                                        <CountBadge>{categoryCounts[category.id] || 0}</CountBadge>
                                    </CategoryItem>
                                ))}
                            </CategoriesContainer>

                            <CategoryButtonContainer>
                                <CategoryButton onClick={toggleShowCategories}>
                                    {showAllCategories ? 'Show Less' : 'Show More'}
                                </CategoryButton>
                            </CategoryButtonContainer>
                        </CategorySection>
                    </ProfilePanel>

                    <SidebarContainer isOpen={isOpen}>
                        <Button bgColor="#ffd97d" hoverColor="#ffca45" onClick={handleSearchClick}>
                            <SearchIcon />
                        </Button>

                        <MenuButton
                            bgColor={isOpen ? "#e8e8e8" : "white"}
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

            {/* Search Modal */}
            {showSearchModal && (
                <SearchOverlay onClick={handleCloseSearch}>
                    <SearchModal onClick={(e) => e.stopPropagation()}>
                        <SearchHeader>
                            <SearchTitleContainer>
                                <SearchIcon />
                                <SearchTitle>Discover Users</SearchTitle>
                            </SearchTitleContainer>
                            <SearchCloseButton onClick={handleCloseSearch}>
                                <CloseIcon />
                            </SearchCloseButton>
                        </SearchHeader>

                        <SearchInputContainer>
                            <SearchInputWrapper>
                                <SearchInputIcon>
                                    <SearchIcon />
                                </SearchInputIcon>
                                <SearchInput
                                    type="text"
                                    placeholder="Search for amazing users..."
                                    value={searchQuery}
                                    onChange={handleSearchInputChange}
                                    autoFocus
                                />
                                {searchQuery && (
                                    <ClearButton onClick={() => setSearchQuery('')}>
                                        <CloseIcon />
                                    </ClearButton>
                                )}
                            </SearchInputWrapper>
                        </SearchInputContainer>

                        <SearchResults>
                            {isSearching ? (
                                <LoadingContainer>
                                    <LoadingSpinner />
                                    <LoadingText>Searching for users...</LoadingText>
                                </LoadingContainer>
                            ) : searchResults.length > 0 ? (
                                <>
                                    <ResultsHeader>
                                        <ResultsCount>{searchResults.length} users found</ResultsCount>
                                    </ResultsHeader>
                                    <ResultsList>
                                        {searchResults.map(user => (
                                            <SearchResultItem
                                                key={user.id}
                                                onClick={() => handleUserClick(user.id)}
                                            >
                                                <SearchUserAvatarContainer>
                                                    <SearchUserAvatar
                                                        src={
                                                            user.imageData
                                                                ? `data:${user.imageType};base64,${user.imageData}`
                                                                : "/api/placeholder/48/48"
                                                        }
                                                        alt={user.username}
                                                    />
                                                    <OnlineIndicator />
                                                </SearchUserAvatarContainer>
                                                <SearchUserInfo>
                                                    <SearchUserName>{user.username}</SearchUserName>
                                                    <SearchUserEmail>{user.email}</SearchUserEmail>
                                                </SearchUserInfo>
                                                <ViewProfileButton>
                                                    View Profile
                                                </ViewProfileButton>
                                            </SearchResultItem>
                                        ))}
                                    </ResultsList>
                                </>
                            ) : searchQuery.trim() ? (
                                <EmptyState>
                                    <EmptyStateIcon>🔍</EmptyStateIcon>
                                    <EmptyStateTitle>No users found</EmptyStateTitle>
                                    <EmptyStateText>
                                        We couldn't find any users matching "{searchQuery}".
                                        Try searching with a different keyword.
                                    </EmptyStateText>
                                </EmptyState>
                            ) : (
                                <EmptyState>
                                    <EmptyStateIcon>👋</EmptyStateIcon>
                                    <EmptyStateTitle>Start your search</EmptyStateTitle>
                                    <EmptyStateText>
                                        Type a username to find and connect with other users
                                    </EmptyStateText>
                                </EmptyState>
                            )}
                        </SearchResults>
                    </SearchModal>
                </SearchOverlay>
            )}
        </>
    );
};
export default RightSidebar;