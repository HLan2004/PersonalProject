import React, { useState } from "react";
import styled from "styled-components";
import { Zap } from "lucide-react";
import FeaturedRecipeCard from "../components/FeaturedRecipeCard";
import FilterBar from "../components/FilterBar";
import RecipeCard from "../components/RecipeCard";
import {useNavigate} from "react-router-dom";

const MainContent = styled.main`
    flex: 1;
    height: 100%;
    padding: 2rem 3rem;
    box-sizing: border-box;
    overflow-y: scroll;
    overflow-x: hidden;
    margin-right: 80px;

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

const FeaturedHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

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

const LeftSection = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const IconContainer = styled.div`
    width: 32px;
    height: 35px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #EEEEEE;
    padding: 0.6rem 1.5rem;
    border-radius: 20px;
`;

const SlideCounter = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.85rem;
    color: #666;
    font-weight: 500;
`;

const CounterNumber = styled.span`
    color: ${props => props.active ? '#333' : '#999'};
    font-weight: ${props => props.active ? '600' : '400'};
    font-size: 0.9rem;
`;

const ProgressBar = styled.div`
    width: 100px;
    height: 2px;
    background: #ddd;
    border-radius: 1px;
    position: relative;
    overflow: hidden;

    &::after {
        content: '';
        position: absolute;
        left: ${props => (props.current / props.total) * 100}%;
        top: 0;
        height: 100%;
        width: ${props => (1 / props.total) * 100}%;
        background: #e74c3c;
        border-radius: 1px;
        transition: left 0.3s ease;
    }
`;

const HorizontalLine = styled.div`
    width: 60px;
    height: 1px;
    background: #999;
    border-radius: 1px;
    position: relative;
    overflow: hidden;
    
    &::after {
        content: '';
        position: absolute;
        left: ${props => (props.current / props.total) * 100}%;
        top: 0;
        height: 100%;
        width: ${props => (1 / props.total) * 100}%;
        background: #e74c3c;
        border-radius: 1px;
        transition: left 0.3s ease;
}
`;
const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    const totalRecipes = 4;

    const handleSeeAllRecipes = (e) => {
        e.preventDefault();
        navigate('/app/recipes');
    };



    return (
        <MainContent>
            <FeaturedHeader>
                <LeftSection>
                    <IconContainer>
                        <Zap size={16} color="#333" />
                    </IconContainer>
                    <h2>FEATURED RECIPES</h2>
                    <HorizontalLine/>
                    <a href="#" onClick={handleSeeAllRecipes}>See all featured recipes</a>
                </LeftSection>

                <PaginationContainer>
                    <SlideCounter>
                        <CounterNumber active={true}>
                            {String(currentSlide + 1).padStart(2, '0')}
                        </CounterNumber>
                        <ProgressBar current={currentSlide} total={totalRecipes} />
                        <CounterNumber>
                            {String(totalRecipes).padStart(2, '0')}
                        </CounterNumber>
                    </SlideCounter>
                </PaginationContainer>
            </FeaturedHeader>

            <FeaturedRecipeCard
                currentSlide={currentSlide}
                onSlideChange={setCurrentSlide}
            />
            <FilterBar />
            <RecipeCard />
        </MainContent>
    );
};

export default Home;