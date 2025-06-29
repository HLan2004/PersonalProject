import React, {useEffect, useState, useRef} from "react";
import styled from "styled-components";
import {fetchDifficultyCategories, fetchMealCategories} from "../service/cate.js";

const FilterBarContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 55px 0 40px;
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

// Custom Dropdown Components
const DropdownContainer = styled.div`
    position: relative;
    margin-right: 1rem;
    width: 180px;
`;

const DropdownButton = styled.button`
    appearance: none;
    background-color: #f5f5f5;
    border: none;
    border-radius: 5px;
    padding: 0.7rem 2rem 0.7rem 1rem;
    font-size: 0.9rem;
    color: #666;
    cursor: pointer;
    width: 100%;
    text-align: left;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    transition: background-color 0.2s ease;

    &:focus {
        outline: none;
        background-color: #e8e8e8;
    }

    &:hover {
        background-color: #e8e8e8;
    }
`;

const DropdownList = styled.ul`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: none;
    border-radius: 5px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
    max-height: none;
    overflow: visible;
    z-index: 1000;
    margin: 2px 0 0 0;
    padding: 0;
    list-style: none;
    display: ${props => props.isOpen ? 'block' : 'none'};
`;

const DropdownItem = styled.li`
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 0.9rem;
    color: #666;
    transition: all 0.2s ease;

    &:hover {
        background-color: #ff8c42;
        color: white;
    }

    &:first-child {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
    }

    &:last-child {
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }
`;

const CheckboxContainer = styled.div`
    display: flex;
    align-items: center;
    margin-right: 1rem;
    width: 150px;
    background-color: ${props => props.checked ? '#ff8c42' : '#f5f5f5'};
    color: ${props => props.checked ? 'white' : '#666'};
    border-radius: 5px;
    padding: 0.7rem 2rem 0.7rem 1rem;
    transition: all 0.2s ease;
    cursor: pointer;
    font-size: 0.9rem;
    user-select: none;

    &:hover {
        background-color: ${props => props.checked ? '#e67a35' : '#e8e8e8'};
    }

    &:focus {
        outline: none;
    }
`;


// Custom Dropdown Component
const CustomDropdown = ({ value, onChange, options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(option => option.value === value);
    const displayText = selectedOption ? selectedOption.label : placeholder;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        onChange({ target: { value: optionValue } });
        setIsOpen(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    return (
        <DropdownContainer ref={dropdownRef}>
            <DropdownButton
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                {displayText}
            </DropdownButton>
            <DropdownList isOpen={isOpen} role="listbox">
                {options.map((option) => (
                    <DropdownItem
                        key={option.value}
                        onClick={() => handleSelect(option.value)}
                        role="option"
                    >
                        {option.label}
                    </DropdownItem>
                ))}
            </DropdownList>
        </DropdownContainer>
    );
};

// Create a global state for filters
window.recipeFilters = {
    mealCategory: '',
    difficultyCategory: '',
    showFollowingOnly: false,
    listeners: []
};

const FilterBar = () => {
    const [meals, setMeals] = useState([]);
    const [difficulties, setDifficulties] = useState([]);
    const [selectedMeal, setSelectedMeal] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [showFollowingOnly, setShowFollowingOnly] = useState(false);

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
        window.recipeFilters.showFollowingOnly = showFollowingOnly;

        // Notify all listeners
        window.recipeFilters.listeners.forEach(listener => {
            listener({
                mealCategory: selectedMeal,
                difficultyCategory: selectedDifficulty,
                showFollowingOnly: showFollowingOnly
            });
        });
    }, [selectedMeal, selectedDifficulty, showFollowingOnly]);

    const handleMealChange = (e) => {
        setSelectedMeal(e.target.value);
    };

    const handleDifficultyChange = (e) => {
        setSelectedDifficulty(e.target.value);
    };

    const handleFollowingToggle = () => {
        setShowFollowingOnly(!showFollowingOnly);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFollowingToggle();
        }
    };

    return (
        <FilterBarContainer>
            <span>FILTER</span>

            <CustomDropdown
                value={selectedMeal}
                onChange={handleMealChange}
                options={[
                    { value: '', label: 'All Categories' },
                    ...meals.map(m => ({ value: m.id, label: m.mealCateTitle }))
                ]}
                placeholder="All Categories"
            />

            <CustomDropdown
                value={selectedDifficulty}
                onChange={handleDifficultyChange}
                options={[
                    { value: '', label: 'All Difficulties' },
                    ...difficulties.map(d => ({ value: d.id, label: d.difficultyTitle }))
                ]}
                placeholder="All Difficulties"
            />

            <CheckboxContainer
                checked={showFollowingOnly}
                onClick={handleFollowingToggle}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="checkbox"
                aria-checked={showFollowingOnly}
            >
                Following Only
            </CheckboxContainer>
        </FilterBarContainer>
    );
};

export default FilterBar;