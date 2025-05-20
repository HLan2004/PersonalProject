import React from "react";
import styled from "styled-components";
import { FaHeart, FaClock } from "react-icons/fa";


const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

// Card container
const Card = styled.div`
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

// Image section with background image
const ImageContainer = styled.div`
  position: relative;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  height: 180px;
`;

// Category badge
const CategoryBadge = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: #f5b800;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
`;

// Title text
const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  padding: 1rem;
  color: #333333;
  flex-grow: 1;
`;

// Info bar at bottom
const InfoBar = styled.div`
  background: #cbe740;
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

// Single card component
const RecipeCardBlog = ({ recipe }) => (
    <Card>
        <ImageContainer image={recipe.image}>
            <CategoryBadge>{recipe.category.toUpperCase()}</CategoryBadge>
        </ImageContainer>
        <Title>{recipe.title}</Title>
        <InfoBar>
            <InfoItem>
                <FaHeart /> {recipe.likes} Likes
            </InfoItem>
            <InfoItem>
                <FaClock /> {recipe.time}
            </InfoItem>
        </InfoBar>
    </Card>
);

// Main export rendering grid of cards
const RecipeCard = () => {
    const recipes = [
        {
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            category: "Lunch",
            title: "How to make Thai Basil Chicken",
            likes: 138,
            time: "50 MIN"
        },
        {
            image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            category: "Dinner",
            title: "Classic Margherita Pizza",
            likes: 256,
            time: "30 MIN"
        },
        {
            image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            category: "Breakfast",
            title: "Avocado Toast with Eggs",
            likes: 189,
            time: "15 MIN"
        },
        {
            image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            category: "Breakfast",
            title: "Berry Smoothie Bowl",
            likes: 143,
            time: "10 MIN"
        },
        {
            image: "https://images.unsplash.com/photo-1589927986089-35812388d1d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            category: "Dinner",
            title: "Spaghetti Carbonara",
            likes: 312,
            time: "25 MIN"
        },
        {
            image: "https://images.unsplash.com/photo-1565895405138-dee3b2915b04?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            category: "Lunch",
            title: "Grilled Salmon Salad",
            likes: 97,
            time: "20 MIN"
        },
        {
            image: "https://images.unsplash.com/photo-1542827630-1eecf944a1d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            category: "Dessert",
            title: "Chocolate Lava Cake",
            likes: 402,
            time: "40 MIN"
        }
    ];

    return (
        <GridContainer>
            {recipes.map((r, i) => (
                <RecipeCardBlog key={i} recipe={r} />
            ))}
        </GridContainer>
    );
};

export default RecipeCard;

