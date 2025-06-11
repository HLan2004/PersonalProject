import React from "react";
import styled from "styled-components";
import FilterBar from "../components/FilterBar";
import RecipeCard from "../components/RecipeCard";

const MainContent = styled.main`
    flex: 1;
    height: 100%;
    padding: 1rem 3rem;
    box-sizing: border-box;
    overflow-y: scroll;
    overflow-x: hidden;
    margin-right: 80px;
    margin-top: -35px;

    &::-webkit-scrollbar {
        width: 10px;
        position: absolute;
        right: -10px;
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

    scrollbar-width: thin;
    scrollbar-color: #888 transparent;
`;

const RecipePage = () => {
    return (
        <MainContent>
            <FilterBar />
            <RecipeCard />
        </MainContent>
    );
};

export default RecipePage;