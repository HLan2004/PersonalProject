import React from "react";
import styled from "styled-components";
import FeaturedRecipeCard from "../components/FeaturedRecipeCard";
import FilterBar from "../components/FilterBar";
import RecipeCard from "../components/RecipeCard";

const MainContent = styled.main`
    flex: 1;
    height: 100%;
    background-color: #EEEEEE;
    padding: 2rem 3rem;
    box-sizing: border-box;
    overflow-y: scroll; /* Change from auto to scroll */
    overflow-x: hidden;
    margin-right: 80px;

    /* This moves the scrollbar outside visually */
    &::-webkit-scrollbar {
        width: 10px;
        position: absolute;
        right: -10px; /* Move scrollbar outside */
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 5px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #555;
    }

    /* For Firefox */
    scrollbar-width: thin;
    scrollbar-color: #888 transparent;
`;

const FeaturedHeader = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    margin-bottom: 2rem;
    gap: 20px;

    h2 {
        font-size: 1rem;
        font-weight: 600;
        text-transform: uppercase;
        margin: 0;
    }

    a {
        color: #999;
        text-decoration: none;
        font-size: 0.9rem;

        &:hover {
            color: #e74c3c;
        }
    }
`;

const Home = () => {
    return (
        <MainContent>
            <FeaturedHeader>
                <h2>FEATURED RECIPES</h2>
                <a href="#">See all featured recipes</a>
            </FeaturedHeader>
            <FeaturedRecipeCard />
            <FilterBar />
            <RecipeCard />
        </MainContent>
    );
};

export default Home;