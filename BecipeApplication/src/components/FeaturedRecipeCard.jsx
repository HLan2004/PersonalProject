// Import necessary libraries
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Heart, Clock, ArrowRight } from "lucide-react";
import {fetchAllPosts} from "../service/posts.js";
import {format} from "date-fns";
import {useNavigate} from "react-router-dom";

// Your existing styled-components
const CardContainer = styled.div`
    display: flex;
    background-color: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
    height: 415px;
`;

const RecipeContent = styled.div`
    flex: 1;
    padding: 2.5rem;
    transform: translate(20px, 33px);
`;

const Category = styled.div`
    background-color: #f8c35a;
    color: #000;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.3rem 1rem;
    border-radius: 20px;
    display: inline-block;
    text-transform: uppercase;
`;

const CategoryDetailsRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: start;
    margin-bottom: 1rem;
`;

const RecipeDetails = styled.div`
    display: flex;
    cursor: pointer;
    div {
        display: flex;
        align-items: center;
        margin-left: 1.5rem;
        color: #999;
        font-size: 0.9rem;
        svg {
            margin-right: 0.5rem;
        }
    }
`;

const RecipeTitle = styled.h1`
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0.5rem 0 1rem;
    line-height: 1.2;
`;

const AuthorInfo = styled.div`
    display: flex;
    align-items: center;
    margin: 1.5rem 0;
    img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #eee;
        margin-right: 1rem;
    }
    div {
        strong {
            display: block;
            font-size: 0.9rem;
            font-weight: 600;
            margin-bottom: 0.2rem;
        }
        span {
            font-size: 0.8rem;
            color: #999;
        }
    }
`;

const ReadMoreLink = styled.a`
    color: #e74c3c;
    display: flex;
    align-items: center;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    margin-top: 1rem;
    svg {
        margin-left: 0.5rem;
    }
`;

const RecipeImage = styled.div`
    flex: 1.5;
    background-image: url(${props => props.src || "https://images.unsplash.com/photo-1562967914-01efa7e87832?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"});
    background-size: cover;
    background-position: center;
    height: 500px; /* Consistent with grid card proportions */
    max-height: 600px;
    border-left: 4px solid #ffd97d;

    @media (max-width: 768px) {
        height: 350px;
    }

    @media (max-width: 480px) {
        height: 280px;
    }
`;


// New styled components for slider functionality
const SliderContainer = styled.div`
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    max-height: 400px;
`;

const SliderWrapper = styled.div`
    overflow: hidden;
    border-radius: 10px;
    cursor: grab;

    &:active {
        cursor: grabbing;
    }
`;

const SliderTrack = styled.div`
    display: flex;
    transition: transform ${(props) => (props.isDragging ? "0s" : "1.25s ease-in-out")};
    transform: translateX(${(props) => props.translateX}px);
    user-select: none;
    gap: 30px;


`;

const SlideItem = styled.div`
    width: 100%; // Reduce width to create space
    flex-shrink: 0;


`;

const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};


const FeaturedRecipeCard = ({ currentSlide = 0, onSlideChange }) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();



    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const sliderRef = useRef(null);

    // Sample recipe data - replace with your actual data
    useEffect(() => {
        fetchAllPosts()
            .then((res) => {
                const data = res.data || [];
                // Shuffle and take only 4 random recipes
                const randomFour = shuffleArray(data).slice(0, 4);
                setRecipes(randomFour);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message || "Failed to load featured recipes");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);



    const getSlideWidth = () => {
        return sliderRef.current ? sliderRef.current.offsetWidth : 0;
    };

    const handleStart = (clientX) => {
        setIsDragging(true);
        setStartX(clientX);
        setCurrentX(clientX);
    };

    const handleMove = (clientX) => {
        if (!isDragging) return;

        setCurrentX(clientX);
        const deltaX = clientX - startX;
        const slideWidth = getSlideWidth();
        const newTranslateX = -currentSlide * slideWidth + deltaX;
        setTranslateX(newTranslateX);
    };

    const handleEnd = () => {
        if (!isDragging) return;

        setIsDragging(false);
        const deltaX = currentX - startX;
        const slideWidth = getSlideWidth() + 30;
        const threshold = slideWidth * 0.2; // 20% of slide width

        let newSlide = currentSlide;

        if (deltaX > threshold && currentSlide > 0) {
            newSlide = currentSlide - 1;
        } else if (deltaX < -threshold && currentSlide < recipes.length - 1) {
            newSlide = currentSlide + 1;
        }

        if (onSlideChange && newSlide !== currentSlide) {
            onSlideChange(newSlide);
        }

        setTranslateX(-newSlide * (getSlideWidth() + 30));
    };


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleMouseMove = (e) => {
        handleMove(e.clientX);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleMouseUp = () => {
        handleEnd();
    };

    // Initialize translateX when component mounts or slide width changes
    useEffect(() => {
        const slideWidth = getSlideWidth();
        setTranslateX(-currentSlide * (slideWidth + 30));

        const handleResize = () => {
            const newSlideWidth = getSlideWidth();
            setTranslateX(-currentSlide * (newSlideWidth + 30));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [currentSlide]);

    // Add global mouse events when dragging
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('mouseleave', handleMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.removeEventListener('mouseleave', handleMouseUp);
            };
        }
    }, [isDragging, startX, currentX, handleMouseMove, handleMouseUp]);

    useEffect(() => {
        if (!recipes.length) return;

        const id = setInterval(() => {
            if (!isDragging) {
                const next = (currentSlide + 1) % recipes.length;
                onSlideChange(next);
            }
        }, 30000);

        return () => clearInterval(id);
    }, [recipes.length, currentSlide, isDragging, onSlideChange]);


    if (loading) return <div>Loading featured recipes…</div>;
    if (error)   return <div style={{ color: "red" }}>Error: {error}</div>;
    if (recipes.length === 0) return <div>No featured recipes found</div>;


    return (
        <SliderContainer>
            <SliderWrapper
                ref={sliderRef}
                onMouseDown={(e) => { e.preventDefault(); handleStart(e.clientX); }}
                onTouchStart={(e) => handleStart(e.touches[0].clientX)}
                onTouchMove={(e) => { e.preventDefault(); handleMove(e.touches[0].clientX); }}
                onTouchEnd={handleEnd}
            >
                <SliderTrack translateX={translateX} isDragging={isDragging}>
                    {recipes.map((recipe, idx) => {
                        const {postId, imageData, imageType, imageUrl: rawUrl } = recipe;
                        const featuredImageUrl = imageData
                            ? `data:${imageType || "image/jpeg"};base64,${imageData}`
                            : rawUrl || "https://via.placeholder.com/800x600?text=No+Image";

                        return (
                            <SlideItem key={recipe.id || idx}>
                            <CardContainer>
                                <RecipeContent>
                                    <CategoryDetailsRow>
                                        <Category>
                                            {(recipe.cuisine || recipe.category || "").toUpperCase()}
                                        </Category>
                                        <RecipeDetails>
                                            <div>
                                                <Heart size={16} /> {recipe.likes || recipe.favorites || 0} LIKES
                                            </div>
                                            <div>
                                                <Clock size={16} /> {recipe.duration || recipe.time || 0} MIN
                                            </div>
                                        </RecipeDetails>
                                    </CategoryDetailsRow>
                                    <RecipeTitle>{recipe.title}</RecipeTitle>
                                    <AuthorInfo>
                                        <img
                                            src={recipe.authorAvatar
                                                ? `data:${recipe.authorAvatarType};base64,${recipe.authorAvatar}`
                                                : "https://via.placeholder.com/50"}
                                            alt="Author"
                                        />
                                        <div>
                                            <strong>{recipe.authorName || "Unknown"}</strong>
                                            <span>{recipe.date ? format(new Date(recipe.date), 'PP') : ""}</span>
                                        </div>
                                    </AuthorInfo>

                                    <ReadMoreLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate(`/app/post/${postId}`);
                                        }}
                                    >
                                        Read More <ArrowRight size={16} />
                                    </ReadMoreLink>
                                </RecipeContent>
                                <RecipeImage src={featuredImageUrl} />
                            </CardContainer>
                        </SlideItem>
                        );
                    })}
                </SliderTrack>
            </SliderWrapper>
        </SliderContainer>
    );
};


export default FeaturedRecipeCard;