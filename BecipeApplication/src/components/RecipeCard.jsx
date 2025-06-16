import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {FaHeart, FaClock, FaRegHeart, FaUtensils} from "react-icons/fa";
import {likePost, fetchFilteredPosts} from "../service/posts.js";
import {useNavigate} from "react-router-dom";

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    margin-top: 1.5rem;
`;

// Card container
const Card = styled.div`
    background: #ffffff;
    border-radius: 5px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    cursor: ${props => props.selectionMode ? 'default' : 'pointer'};
    position: relative;

    ${props => props.isSelected && `
        box-shadow: 0 0 0 3px #ff8c42, 0 2px 15px rgba(0, 0, 0, 0.05);
        background-color: #fdf2f2;
    `}

    transition: transform 0.3s;

    &:hover {
        transform: translateY(-5px);
    }
`;

// Add these new styled components at the top with your existing ones
const CheckboxWrapper = styled.div`
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 10;
`;

const SelectionCheckbox = styled.input`
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: #ff8c42;
`;

// Image section with background image
const ImageContainer = styled.div`
    position: relative;
    width: 98.5%;
    height: 220px;
    background-image: url('${props => props.image}');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    border: 2px solid #ffd97d;
`;



const CategoryBadge = styled.span`
    background: #f5b800;
    color: #ffffff;
    font-size: 0.75rem;
    font-weight: bold;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    position: absolute;
    bottom: -10px;
    left: 2rem;
    transform: none;
    white-space: nowrap;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    z-index: 10;
`;

// Title text
const Title = styled.h3`
    font-size: 1rem;
    font-weight: 600;
    padding: 1rem;
    color: #333333;
    flex-grow: 1;
`;

const difficultyColors = {
    easy: "#cbe740",
    medium: "#ffc107",
    hard: "#f39c12",
    professional: "#e67e22",
    ultimate: "#c0392b",
};

const InfoBar = styled.div`
    background: ${({ difficulty }) => difficultyColors[difficulty] || "#ccc"};
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
`;

const InfoItem = styled.div`
    display: flex;
    align-items: center;
    margin-right: 1.5rem;
    font-size: 0.875rem;
    color: #ffffff;

    & > svg {
        margin-right: 0.5rem;
    }
`;

const LikeButton = styled.div`
    display: flex;
    align-items: center;
    margin-right: 1.5rem;
    font-size: 0.875rem;
    color: #ffffff;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
        transform: scale(1.1);
    }

    & > svg {
        margin-right: 0.5rem;
        color: ${props => props.isLiked ? '#ff4757' : '#ffffff'};
    }
`;

const RecipeCardBlog = ({ recipe, onLikeUpdate, selectionMode, isSelected, onSelect }) => {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const {
        postId,
        imageData,
        imageType,
        cuisine = "Uncategorized",
        title = "Untitled Recipe",
        duration = "N/A",
        countLike,
        isLikedByCurrentUser = false,
        difficultyCate = {},
    } = recipe || {};

    const difficulty = difficultyCate.difficultyTitle
        ? difficultyCate.difficultyTitle.toLowerCase()
        : "ease";

    const imageUrl = imageData
        ? `data:${imageType || 'image/jpeg'};base64,${imageData}`
        : "https://via.placeholder.com/300x180?text=No+Image";

    useEffect(() => {
        setLikeCount(countLike || 0);
        setIsLiked(isLikedByCurrentUser);
    }, [countLike, isLikedByCurrentUser]);

    const handleLike = async (e) => {
        e.stopPropagation();

        try {
            await likePost(postId);

            const newIsLiked = !isLiked;
            setIsLiked(newIsLiked);
            setLikeCount(prevCount => newIsLiked ? prevCount + 1 : prevCount - 1);

            if (onLikeUpdate) {
                onLikeUpdate(postId, newIsLiked);
            }
        } catch (error) {
            console.error('Failed to like post:', error);
        }
    };

    const handleCardClick = (e) => {
        if (selectionMode) {
            e.preventDefault();
            e.stopPropagation();
            onSelect(recipe.postId);
        } else {
            navigate(`/app/post/${recipe.postId}`);
        }
    };

    const handleCheckboxChange = (e) => {
        e.stopPropagation();
        onSelect(recipe.postId);
    };


    return (
        <Card
            onClick={handleCardClick}
            selectionMode={selectionMode}
            isSelected={isSelected}
        >
            {selectionMode && (
                <CheckboxWrapper>
                    <SelectionCheckbox
                        type="checkbox"
                        checked={isSelected}
                        onChange={handleCheckboxChange}
                    />
                </CheckboxWrapper>
            )}

            <ImageContainer image={imageUrl}>
                <CategoryBadge>
                    {String(cuisine).toUpperCase()}
                </CategoryBadge>
            </ImageContainer>
            <Title>{title}</Title>
            <InfoBar difficulty={difficulty}>
                <InfoItem>
                    <FaClock /> {duration} MINS
                </InfoItem>
                <LikeButton isLiked={isLiked} onClick={handleLike}>
                    {isLiked ? <FaHeart /> : <FaRegHeart />}
                    {likeCount} LIKES
                </LikeButton>
            </InfoBar>
        </Card>
    );
}


const RecipeCard = ({ posts = null, selectionMode = false, selectedPosts = new Set(), onPostSelect }) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleLikeUpdate = (recipeId, isLiked) => {
        setRecipes(prevRecipes =>
            prevRecipes.map(recipe =>
                recipe.postId === recipeId
                    ? {
                        ...recipe,
                        countLike: recipe.countLike + (isLiked ? 1 : -1),
                        isLikedByCurrentUser: isLiked
                    }
                    : recipe
            )
        );
    };

    const handleFilterChange = async (filters) => {
        // Only fetch if no posts prop is provided (for general use)
        if (posts) return;

        setLoading(true);
        setError(null);
        try {
            const response = await fetchFilteredPosts(
                filters.mealCategory || null,
                filters.difficultyCategory || null
            );
            setRecipes(response.data);
        } catch (error) {
            console.error('Failed to fetch filtered posts:', error);
            setError('Failed to load posts. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (posts) {
            setRecipes(posts);
            setLoading(false);
            return;
        }

        // Otherwise, use the filter system
        if (!window.recipeFilters) {
            window.recipeFilters = {
                mealCategory: '',
                difficultyCategory: '',
                listeners: []
            };
        }

        window.recipeFilters.listeners.push(handleFilterChange);

        handleFilterChange({
            mealCategory: window.recipeFilters.mealCategory,
            difficultyCategory: window.recipeFilters.difficultyCategory
        });

        // Cleanup on unmount
        return () => {
            window.recipeFilters.listeners = window.recipeFilters.listeners.filter(
                listener => listener !== handleFilterChange
            );
        };
    }, [posts]);

    if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>Loading recipes…</div>;
    if (error) return <div style={{ color: "red", textAlign: 'center', padding: '20px' }}>Error: {error}</div>;

    return (
        <GridContainer>
            {recipes.length > 0 ? (
                recipes.map((r, i) => (
                    <RecipeCardBlog
                        key={r.postId || i}
                        recipe={r}
                        onLikeUpdate={handleLikeUpdate}
                        selectionMode={selectionMode}
                        isSelected={selectedPosts.has(r.postId)}
                        onSelect={onPostSelect}
                    />
                ))
            ) : (
                <div style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#666'
                }}>
                    No recipes found matching your filters.
                </div>
            )}
        </GridContainer>
    );
};

export default RecipeCard;