import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {fetchDifficultyCategories, fetchMealCategories} from "../service/cate.js";

const FilterBarContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 55px 0 45px;
    border-radius: 10px;
    background-color: white;
    padding: 15px 30px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);

    span {
        color: #999;
        font-size: 0.9rem;
        margin-right: 1rem;
        gap: 15px;
    }
`;

const FilterSelect = styled.select`
    appearance: none;
    margin-right: 1rem;
    background-color: #f5f5f5;
    border: none;
    border-radius: 5px;
    padding: 0.7rem 2rem 0.7rem 1rem;
    font-size: 0.9rem;
    color: #666;
    cursor: pointer;
    width: 180px;

    &:focus {
        outline: none;
    }
`;

// Create a global state for filters
window.recipeFilters = {
    mealCategory: '',
    difficultyCategory: '',
    listeners: []
};

const FilterBar = () => {
    const [meals, setMeals] = useState([]);
    const [difficulties, setDifficulties] = useState([]);
    const [selectedMeal, setSelectedMeal] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');

    useEffect(() => {
        fetchMealCategories()
            .then(res => setMeals(res.data))
            .catch(err => console.error("failed to load meals:", err));

        fetchDifficultyCategories()
            .then(res => setDifficulties(res.data))
            .catch(err => console.error("failed to load difficulties:", err));
    }, []);

    useEffect(() => {
        // Update global state
        window.recipeFilters.mealCategory = selectedMeal;
        window.recipeFilters.difficultyCategory = selectedDifficulty;

        // Notify all listeners
        window.recipeFilters.listeners.forEach(listener => {
            listener({
                mealCategory: selectedMeal,
                difficultyCategory: selectedDifficulty
            });
        });
    }, [selectedMeal, selectedDifficulty]);

    const handleMealChange = (e) => {
        setSelectedMeal(e.target.value);
    };

    const handleDifficultyChange = (e) => {
        setSelectedDifficulty(e.target.value);
    };

    return (
        <FilterBarContainer>
            <span>FILTER</span>

            <FilterSelect value={selectedMeal} onChange={handleMealChange}>
                <option value="">All Categories</option>
                {meals.map(m => (
                    <option key={m.id} value={m.id}>
                        {m.mealCateTitle}
                    </option>
                ))}
            </FilterSelect>

            <FilterSelect value={selectedDifficulty} onChange={handleDifficultyChange}>
                <option value="">All Difficulties</option>
                {difficulties.map(d => (
                    <option key={d.id} value={d.id}>
                        {d.difficultyTitle}
                    </option>
                ))}
            </FilterSelect>
        </FilterBarContainer>
    );
};

export default FilterBar;