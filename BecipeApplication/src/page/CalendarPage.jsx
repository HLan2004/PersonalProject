
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Calendar as FullCalendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { Search, X, Calendar } from 'lucide-react';
import {fetchAllPosts, searchPosts} from "../service/posts.js";
import {fetchDifficultyCategories, fetchMealCategories} from "../service/cate.js";
import {fetchCurrentUser} from "../service/users.js";
import {
    createCalendarEvent,
    deleteCalendarEvent,
    fetchUserCalendarEvents,
    updateCalendarEvent
} from "../service/calendarEvent.js";

const MainContent = styled.main`
    flex: 1;
    height: 100%;
    padding: 1rem 3rem;
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

const CalendarHeader = styled.div`
    background: white;
    padding: 32px;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    margin-bottom: 2rem;
    border: 1px solid rgba(0, 0, 0, 0.04);
    margin-top: 10px;
`;

const HeaderTop = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
`;

const Title = styled.h1`
    margin: 0;
    color: #1f2937;
    font-size: 2.2rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 12px;
`;

const SearchAndFilterContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: 95px;
    align-items: flex-end;
`;

const SearchSection = styled.div`
    position: relative;
    flex: 1;
    max-width: 400px;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 16px 20px 16px 56px;
    border: 2px solid #ffb366;
    border-radius: 16px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: #fff8f3;
    color: #374151;

    &:focus {
        outline: none;
        border-color: #ff8c42;
        background: white;
        box-shadow: 0 0 0 4px rgba(255, 140, 66, 0.1);
    }

    &::placeholder {
        color: #9ca3af;
        font-weight: 400;
    }
`;

const SearchIcon = styled.div`
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    display: flex;
    align-items: center;
`;

const FilterSection = styled.div`
    display: flex;
    gap: 20px;
    align-items: flex-start;
    flex-wrap: wrap;
    flex: 0 0 auto;
`;

const FilterGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 180px;
`;

const FilterLabel = styled.label`
    font-size: 0.8rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0 auto 0;
`;

// Custom Dropdown Components (similar to FilterBar)
const DropdownContainer = styled.div`
    position: relative;
    min-width: 180px;
`;

const DropdownButton = styled.button`
    appearance: none;
    background-color: #fff8f3;
    border: 2px solid #ffb366;
    border-radius: 12px;
    padding: 12px 44px 12px 16px;
    font-size: 0.9rem;
    color: #374151;
    cursor: pointer;
    width: 100%;
    text-align: left;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ff8c42' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 16px center;
    background-repeat: no-repeat;
    background-size: 16px;
    height: 54px;
    box-sizing: border-box;
    transition: all 0.3s ease;
    font-weight: 500;

    &:focus {
        outline: none;
        border-color: #ff8c42;
        background-color: white;
        box-shadow: 0 0 0 4px rgba(255, 140, 66, 0.1);
    }

    &:hover {
        border-color: #ff8c42;
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
    padding: 12px 16px;
    cursor: pointer;
    font-size: 0.9rem;
    color: #374151;
    transition: all 0.2s ease;
    font-weight: 500;

    &:hover {
        background-color: #ff8c42;
        color: white;
    }

    &:first-child {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    &:last-child {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }
`;

const CheckboxContainer = styled.div`
    appearance: none;
    padding: 12px 44px 12px 16px;
    border: 2px solid #ffb366;
    border-radius: 12px;
    font-size: 0.9rem;
    color: #374151;
    cursor: pointer;
    transition: all 0.3s ease;
    background: ${props => props.checked ? '#ff8c42' : '#fff8f3'};
    height: 54px;
    box-sizing: border-box;
    min-width: 180px;
    display: flex;
    align-items: center;
    user-select: none;
    font-weight: 500;

    &:focus {
        outline: none;
        border-color: #ff8c42;
        background-color: ${props => props.checked ? '#ff8c42' : 'white'};
        box-shadow: 0 0 0 4px rgba(255, 140, 66, 0.1);
    }

    &:hover {
        border-color: #ff8c42;
    }

    &::after {
        content: ${props => props.checked ? '"✓"' : '""'};
        margin-left: auto;
        font-weight: bold;
        color: ${props => props.checked ? 'white' : 'transparent'};
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

const ActiveFiltersSection = styled.div`
    display: flex;
    gap: 12px;
    align-items: center;
    margin-top: 20px;
    flex-wrap: wrap;
`;

const ActiveFilterTag = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #ff8c42, #e67e22);
    color: white;
    padding: 8px 16px;
    border-radius: 24px;
    font-size: 0.85rem;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(255, 140, 66, 0.3);
`;

const RemoveTagButton = styled.button`
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    opacity: 0.8;
    transition: opacity 0.2s;

    &:hover {
        opacity: 1;
    }
`;

const ClearAllButton = styled.button`
    background: none;
    border: 2px solid #e5e7eb;
    color: #6b7280;
    padding: 8px 16px;
    border-radius: 24px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;

    &:hover {
        background: #f3f4f6;
        border-color: #d1d5db;
        color: #374151;
    }
`;

const ContentWrapper = styled.div`
    display: flex;
    gap: 2rem;
    height: calc(100vh - 400px); /* Dynamic height based on viewport */
    min-height: 500px; /* Minimum height */
    max-height: 800px; /* Maximum height */
`;

const RecipeLibrary = styled.div`
    width: 350px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    padding: 24px;
    border: 1px solid rgba(0, 0, 0, 0.04);
    overflow-y: auto;
    display: flex;
    flex-direction: column;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }
`;

const LibraryHeader = styled.h3`
    margin: 0 0 20px 0;
    color: #1f2937;
    font-size: 1.2rem;
    font-weight: 600;
    text-align: center;
    padding-bottom: 16px;
    border-bottom: 2px solid #e5e7eb;
    flex-shrink: 0; /* Prevent header from shrinking */
    position: sticky; /* Make header sticky at the top */
    top: 0;
    background: white;
    z-index: 1;
`;

const RecipeListContainer = styled.div`
    flex: 1;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }
`;

const RecipeItem = styled.div`
    padding: 12px;
    margin-bottom: 10px;
    background: ${props => {
        switch(props.difficulty) {
            case 'easy': return 'linear-gradient(135deg, rgba(203, 231, 64, 0.3), rgba(164, 198, 57, 0.4))';
            case 'medium': return 'linear-gradient(135deg, rgba(255, 193, 7, 0.3), rgba(230, 172, 0, 0.4))';
            case 'hard': return 'linear-gradient(135deg, rgba(243, 156, 18, 0.3), rgba(214, 137, 16, 0.4))';
            case 'professional': return 'linear-gradient(135deg, rgba(230, 126, 34, 0.3), rgba(211, 84, 0, 0.4))';
            case 'ultimate': return 'linear-gradient(135deg, rgba(192, 57, 43, 0.3), rgba(169, 50, 38, 0.4))';
            default: return '#f8f9fa';
        }
    }};

    border-radius: 12px;
    cursor: grab;
    transition: all 0.2s ease;
    border: 2px solid transparent;
    display: flex;
    flex-direction: column;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-color: #ff8c42;
    }

    &:active {
        cursor: grabbing;
        transform: scale(0.98);
    }

    &.fc-draggable {
        user-select: none;
    }
`;

const RecipeImageArea = styled.div`
    width: 100%;
    height: 150px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    color: rgba(0, 0, 0, 0.5);
    background-image: url(${props => props.imageUrl});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    overflow: hidden;
    position: relative;

    ${props => !props.imageUrl && `
        &::after {
            content: '📷 Recipe Image';
            font-weight: 500;
            font-size: 0.75rem;
            color: rgba(0, 0, 0, 0.4);
        }
    `}

    &:hover {
        transform: scale(1.02);
        transition: transform 0.2s ease;
    }
`;

const RecipeContent = styled.div`
    flex: 1;
`;

const RecipeTitle = styled.div`
    font-weight: 600;
    color: #1f2937;
    font-size: 1rem;
`;

const RecipeDetails = styled.div`
    font-size: 0.8rem;
    color: #6b7280;
    display: flex;
    justify-content: flex-start;
    gap: 8px;
    margin-top: 8px;

    & > span {
        background-color: #f3f4f6;
        border: 1px solid #d1d5db;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 500;
        color: #374151;
        display: inline-block;
        white-space: nowrap;

        &:first-child {
            background-color: #fef3c7;
            border-color: #b45309;
            color: #92400e;
        }

        &:last-child {
            background-color: #e0f2fe;
            border-color: #0284c7;
            color: #0369a1;
        }
    }
`;

const CalendarContainer = styled.div`
    flex: 1;
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    padding: 32px;
    border: 1px solid rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    overflow: hidden; /* Prevent overflow */
`;

const CalendarWrapper = styled.div`
    flex: 1;
    min-height: 0; /* Allow flexbox to shrink */
    overflow: hidden; /* Contain the calendar */

    .fc {
        height: 100% !important; /* Make calendar fill available space */
    }

    .fc-view-harness {
        height: 100% !important;
        overflow: auto !important; /* Add scrolling if needed */
    }

    .fc-scrollgrid {
        border: 1px solid #e5e7eb !important;
        border-radius: 12px !important;
        height: 100% !important; /* Fill available space */
    }

    .fc-scrollgrid-liquid {
        height: 100% !important;
    }

    .fc-daygrid-body {
        overflow-y: auto !important; /* Allow scrolling within the grid */
    }

    .fc-toolbar {
        margin-bottom: 1.5rem !important;
        flex-wrap: wrap !important;
        gap: 0.75rem !important;
        padding: 0 !important;
        flex-shrink: 0; /* Don't shrink the toolbar */
    }

    .fc-toolbar-chunk {
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
    }

    .fc-toolbar-title {
        font-size: 1.5rem !important;
        font-weight: 600 !important;
        color: #333 !important;
        margin: 0 !important;
    }

    .fc-button-group {
        display: flex !important;
        gap: 0.25rem !important;
        border-radius: 8px !important;
        overflow: hidden !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
    }

    .fc-button-primary {
        background-color: #ff8c42 !important; /* Changed to orange */
        border-color: #ff8c42 !important;
        font-weight: 500 !important;
        padding: 0.5rem 0.75rem !important;
        border-radius: 0 !important;
        font-size: 0.875rem !important;
        line-height: 1.25rem !important;
        min-height: 38px !important;
        border-width: 1px !important;
        transition: all 0.2s ease !important;

        &:first-child {
            border-top-left-radius: 6px !important;
            border-bottom-left-radius: 6px !important;
        }

        &:last-child {
            border-top-right-radius: 6px !important;
            border-bottom-right-radius: 6px !important;
        }

        &:hover {
            background-color: #e67e22 !important; /* Darker orange on hover */
            border-color: #e67e22 !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 8px rgba(255, 140, 66, 0.3) !important;
        }

        &:not(:disabled):active,
        &:not(:disabled).fc-button-active {
            background-color: #d35400 !important; /* Even darker orange when active */
            border-color: #bf4f00 !important;
            transform: translateY(0) !important;
            box-shadow: 0 2px 4px rgba(211, 84, 0, 0.4) !important;
        }

        &:focus {
            outline: none !important;
            box-shadow: 0 0 0 3px rgba(255, 140, 66, 0.2) !important;
        }
    }

    .fc-today-button {
        border-radius: 6px !important;
        margin-right: 0.5rem !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
    }

    .fc-prev-button,
    .fc-next-button {
        min-width: 40px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    }

    .fc-dayGridMonth-button,
    .fc-timeGridWeek-button,
    .fc-timeGridDay-button,
    .fc-listWeek-button {
        white-space: nowrap !important;
        min-width: auto !important;
        padding: 0.5rem 0.875rem !important;
    }

    /* Rest of your existing styles remain the same... */
    @media (max-width: 768px) {
        .fc-toolbar {
            flex-direction: column !important;
            align-items: center !important;
            gap: 1rem !important;
        }

        .fc-toolbar-chunk {
            flex-wrap: wrap !important;
            justify-content: center !important;
        }

        .fc-button-primary {
            font-size: 0.8rem !important;
            padding: 0.4rem 0.6rem !important;
            min-height: 36px !important;
        }

        .fc-toolbar-title {
            font-size: 1.25rem !important;
            text-align: center !important;
            margin-bottom: 0.5rem !important;
        }
    }

    .fc-event {
        cursor: pointer;
        border: none;
        border-radius: 8px;
        padding: 0.25rem 0.5rem;
        font-weight: 500;
        transition: all 0.2s ease;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        font-size: 0.8rem;
        margin: 1px 0;

        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
    }

    .fc-event-difficulty-easy {
        background: linear-gradient(135deg, #10b981, #059669) !important;
        color: white !important;
    }

    .fc-event-difficulty-medium {
        background: linear-gradient(135deg, #f59e0b, #d97706) !important;
        color: white !important;
    }

    .fc-event-difficulty-hard {
        background: linear-gradient(135deg, #ef4444, #dc2626) !important;
        color: white !important;
    }

    .fc-day-today {
        background-color: rgba(99, 102, 241, 0.05) !important;
    }

    .fc-day:hover {
        background-color: rgba(99, 102, 241, 0.02);
    }

    .fc-col-header-cell {
        background-color: #f8fafc !important;
        border-color: #e5e7eb !important;
        font-weight: 600 !important;
        color: #475569 !important;
        padding: 1rem 0.5rem !important;
        flex-shrink: 0 !important; /* Don't shrink headers */
    }

    .fc-daygrid-day {
        border-color: #e5e7eb !important;
        min-height: 80px !important; /* Ensure minimum height */
        overflow: hidden !important; /* Prevent individual day overflow */
    }

    .fc-daygrid-day-number {
        color: #475569 !important;
        font-weight: 500 !important;
        padding: 0.5rem !important;
    }

    .fc-daygrid-day-frame {
        min-height: 80px !important;
        max-height: 120px !important; /* Limit maximum height */
        overflow: hidden !important;
    }

    .fc-daygrid-day-events {
        margin: 0 !important;
        padding: 0 2px !important;
        max-height: 60px !important; /* Limit event area height */
        overflow-y: auto !important; /* Add scrolling for events if needed */
    }

    .fc-daygrid-event {
        margin: 1px 0 !important;
        font-size: 0.75rem !important;
    }

    .fc-more-link {
        font-size: 0.7rem !important;
        padding: 2px 4px !important;
    }
`;

const CalendarPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('all');
    const [mealFilter, setMealFilter] = useState('all');
    const [calendarEvents, setCalendarEvents] = useState([]);
    const calendarRef = useRef(null);
    const calendarInstance = useRef(null);
    const draggableInstance = useRef(null);
    const [allRecipes, setAllRecipes] = useState([]);
    const [recipesLoading, setRecipesLoading] = useState(true);
    const [mealCategories, setMealCategories] = useState([]);
    const [difficultyCategories, setDifficultyCategories] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [displayedRecipes, setDisplayedRecipes] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [showFollowingOnly, setShowFollowingOnly] = useState(false);

    useEffect(() => {
        const loadUserAndEvents = async () => {
            try {
                setUserLoading(true);

                const userResponse = await fetchCurrentUser();

                if (userResponse?.data) {
                    setCurrentUser(userResponse.data);

                    const userId = userResponse.data.id;

                    if (userId) {
                        const eventsResponse = await fetchUserCalendarEvents(userId);

                        const events = eventsResponse.data.map(event => ({
                            id: event.id,
                            title: event.title,
                            start: event.startDateTime,
                            end: event.endDateTime,
                            backgroundColor: getDifficultyColor(event.difficultyLevel || 'easy'),
                            borderColor: getDifficultyBorderColor(event.difficultyLevel || 'easy'),
                            textColor: '#ffffff',
                            extendedProps: {
                                difficulty: event.difficultyLevel || 'easy',
                                meal: event.mealType || 'dinner',
                                eventId: event.id
                            },
                            classNames: [`fc-event-difficulty-${event.difficultyLevel || 'easy'}`]
                        }));
                        setCalendarEvents(events);
                    }
                }
            } catch (error) {
                console.error('Failed to load user or events:', error);
            } finally {
                setUserLoading(false);
            }
        };

        loadUserAndEvents();
    }, []);

    // Load recipes
    useEffect(() => {
        fetchAllPosts()
            .then((response) => {
                const recipes = response.data.map(post => ({
                    id: post.postId,
                    title: post.title,
                    difficulty: post.difficultyCate?.difficultyTitle?.toLowerCase() || 'easy',
                    meal: post.mealCate?.mealCateTitle?.toLowerCase() || 'dinner',
                    imageUrl: post.imageData
                        ? `data:${post.imageType};base64,${post.imageData}`
                        : null
                }));
                setAllRecipes(recipes);
            })
            .catch((error) => {
                console.error('Failed to fetch recipes:', error);
                setAllRecipes([]);
            })
            .finally(() => {
                setRecipesLoading(false);
            });
    }, []);

    // Load categories
    useEffect(() => {
        fetchMealCategories()
            .then(res => setMealCategories(res.data))
            .catch(err => console.error("Failed to load meal categories:", err));

        fetchDifficultyCategories()
            .then(res => setDifficultyCategories(res.data))
            .catch(err => console.error("Failed to load difficulty categories:", err));
    }, []);

    // Search functionality
    // Update your search functionality useEffect to include the showFollowingOnly filter
    useEffect(() => {
        const performSearch = async () => {
            if (!searchTerm && difficultyFilter === 'all' && mealFilter === 'all' && !showFollowingOnly) {
                setDisplayedRecipes(allRecipes);
                setIsSearching(false);
                return;
            }

            setIsSearching(true);
            try {
                let response;

                // Check if "Following Only" is enabled
                if (showFollowingOnly) {
                    console.log('Fetching posts from followed users only');
                    // You'll need to import this function from your posts service
                    const { fetchPostsFromFollowedUsers } = await import('../service/posts.js');
                    response = await fetchPostsFromFollowedUsers();

                    // If there are additional filters, apply them to the followed users' posts
                    let filteredRecipes = response.data.map(post => ({
                        id: post.postId,
                        title: post.title,
                        difficulty: post.difficultyCate?.difficultyTitle?.toLowerCase() || 'easy',
                        meal: post.mealCate?.mealCateTitle?.toLowerCase() || 'dinner',
                        imageUrl: post.imageData
                            ? `data:${post.imageType};base64,${post.imageData}`
                            : null
                    }));

                    // Apply additional filters if needed
                    if (searchTerm) {
                        filteredRecipes = filteredRecipes.filter(recipe =>
                            recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                    }
                    if (difficultyFilter !== 'all') {
                        filteredRecipes = filteredRecipes.filter(recipe =>
                            recipe.difficulty === difficultyFilter
                        );
                    }
                    if (mealFilter !== 'all') {
                        filteredRecipes = filteredRecipes.filter(recipe =>
                            recipe.meal === mealFilter
                        );
                    }

                    setDisplayedRecipes(filteredRecipes);
                } else {
                    // Use existing logic for other filters
                    const mealCategoryId = mealFilter === 'all' ? null :
                        mealCategories.find(cat => cat.mealCateTitle.toLowerCase() === mealFilter)?.id;
                    const difficultyCategoryId = difficultyFilter === 'all' ? null :
                        difficultyCategories.find(cat => cat.difficultyTitle.toLowerCase() === difficultyFilter)?.id;

                    response = await searchPosts(
                        searchTerm || null,
                        mealCategoryId,
                        difficultyCategoryId
                    );

                    const searchedRecipes = response.data.map(post => ({
                        id: post.postId,
                        title: post.title,
                        difficulty: post.difficultyCate?.difficultyTitle?.toLowerCase() || 'easy',
                        meal: post.mealCate?.mealCateTitle?.toLowerCase() || 'dinner',
                        imageUrl: post.imageData
                            ? `data:${post.imageType};base64,${post.imageData}`
                            : null
                    }));

                    setDisplayedRecipes(searchedRecipes);
                }
            } catch (error) {
                console.error('Error searching recipes:', error);
                setDisplayedRecipes([]);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(performSearch, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, difficultyFilter, mealFilter, showFollowingOnly, allRecipes, mealCategories, difficultyCategories]);

    const handleFollowingToggle = () => {
        setShowFollowingOnly(!showFollowingOnly);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFollowingToggle();
        }
    };

    // Initialize drag and drop
    useEffect(() => {
        if (draggableInstance.current) {
            draggableInstance.current.destroy();
        }

        const draggableEl = document.getElementById('recipe-library');
        if (draggableEl) {
            draggableInstance.current = new Draggable(draggableEl, {
                itemSelector: '.fc-event',
                eventData: function(eventEl) {
                    const recipeData = JSON.parse(eventEl.dataset.recipe);
                    return {
                        title: recipeData.title,
                        backgroundColor: getDifficultyColor(recipeData.difficulty),
                        borderColor: getDifficultyBorderColor(recipeData.difficulty),
                        textColor: '#ffffff',
                        extendedProps: {
                            difficulty: recipeData.difficulty,
                            meal: recipeData.meal,
                            postId: recipeData.id
                        },
                        classNames: [`fc-event-difficulty-${recipeData.difficulty}`]
                    };
                }
            });
        }

        return () => {
            if (draggableInstance.current) {
                draggableInstance.current.destroy();
            }
        };
    }, [displayedRecipes]);

    useEffect(() => {
        if (calendarRef.current && !calendarInstance.current && currentUser && !userLoading) {
            calendarInstance.current = new FullCalendar(calendarRef.current, {
                plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                },
                height: 'auto',
                editable: true,
                selectable: false,
                selectMirror: false,
                dayMaxEvents: false,
                weekends: true,
                events: calendarEvents,
                eventDisplay: 'block',
                droppable: true,

                eventReceive: async function(info) {
                    if (!currentUser || !currentUser.id) {
                        console.error('User not authenticated');
                        info.revert();
                        return;
                    }

                    try {
                        const eventData = {
                            title: info.event.title,
                            startDateTime: info.event.start.toISOString(),
                            endDateTime: info.event.end ? info.event.end.toISOString() :
                                new Date(info.event.start.getTime() + 60 * 60 * 1000).toISOString(),
                            difficultyLevel: info.event.extendedProps.difficulty || 'easy',
                            mealType: info.event.extendedProps.meal || 'dinner',
                            postId: info.event.extendedProps.postId,
                            userId: currentUser.id
                        };

                        const response = await createCalendarEvent(eventData);

                        if (response && response.data) {
                            info.event.setExtendedProp('eventId', response.data.id);
                            console.log('Event created successfully');
                        } else {
                            console.error('Failed to create event');
                            info.revert();
                        }
                    } catch (error) {
                        console.error('Error creating calendar event:', error);
                        info.revert();
                    }
                },

                eventDrop: async function(info) {
                    if (!currentUser || !currentUser.id) {
                        console.error('User not authenticated');
                        info.revert();
                        return;
                    }

                    try {
                        const eventId = info.event.extendedProps.eventId;
                        if (!eventId) {
                            console.error('Event ID not found');
                            info.revert();
                            return;
                        }

                        const updatedData = {
                            id: eventId,
                            title: info.event.title,
                            startDateTime: info.event.start.toISOString(),
                            endDateTime: info.event.end ? info.event.end.toISOString() :
                                new Date(info.event.start.getTime() + 60 * 60 * 1000).toISOString(),
                            difficultyLevel: info.event.extendedProps.difficulty || 'easy',
                            mealType: info.event.extendedProps.meal || 'dinner',
                            postId: info.event.extendedProps.postId,
                            userId: currentUser.id
                        };

                        await updateCalendarEvent(eventId, updatedData);
                        console.log('Event updated successfully');
                    } catch (error) {
                        console.error('Error updating calendar event:', error);
                        info.revert();
                    }
                },

                eventResize: async function(info) {
                    if (!currentUser || !currentUser.id) {
                        console.error('User not authenticated');
                        info.revert();
                        return;
                    }

                    try {
                        const eventId = info.event.extendedProps.eventId;
                        if (!eventId) {
                            console.error('Event ID not found');
                            info.revert();
                            return;
                        }

                        const updatedData = {
                            id: eventId,
                            title: info.event.title,
                            startDateTime: info.event.start.toISOString(),
                            endDateTime: info.event.end ? info.event.end.toISOString() :
                                new Date(info.event.start.getTime() + 60 * 60 * 1000).toISOString(),
                            difficultyLevel: info.event.extendedProps.difficulty || 'easy',
                            mealType: info.event.extendedProps.meal || 'dinner',
                            postId: info.event.extendedProps.postId,
                            userId: currentUser.id
                        };

                        await updateCalendarEvent(eventId, updatedData);
                        console.log('Event resized successfully');
                    } catch (error) {
                        console.error('Error updating calendar event:', error);
                        info.revert();
                    }
                },

                eventClick: async function(info) {
                    if (confirm('Are you sure you want to delete this event?')) {
                        try {
                            const eventId = info.event.extendedProps.eventId;
                            if (eventId) {
                                await deleteCalendarEvent(eventId);
                                info.event.remove();
                                console.log('Event deleted successfully');
                            }
                        } catch (error) {
                            console.error('Error deleting calendar event:', error);
                        }
                    }
                }
            });

            calendarInstance.current.render();
        }

        if (calendarInstance.current && calendarEvents.length > 0) {
            calendarInstance.current.removeAllEvents();
            calendarInstance.current.addEventSource(calendarEvents);
        }

        return () => {
            if (calendarInstance.current) {
                calendarInstance.current.destroy();
                calendarInstance.current = null;
            }
        };
    }, [currentUser, userLoading, calendarEvents]);

    const getDifficultyColor = (difficulty) => {
        switch(difficulty) {
            case 'easy': return '#10b981';
            case 'medium': return '#f59e0b';
            case 'hard': return '#ef4444';
            case 'professional': return '#8b5cf6';
            case 'ultimate': return '#dc2626';
            default: return '#6b7280';
        }
    };

    const getDifficultyBorderColor = (difficulty) => {
        switch(difficulty) {
            case 'easy': return '#059669';
            case 'medium': return '#d97706';
            case 'hard': return '#dc2626';
            case 'professional': return '#7c3aed';
            case 'ultimate': return '#b91c1c';
            default: return '#4b5563';
        }
    };

    const clearAllFilters = () => {
        setSearchTerm('');
        setDifficultyFilter('all');
        setMealFilter('all');
        setShowFollowingOnly(false);
    };

    const removeFilter = (filterType) => {
        switch (filterType) {
            case 'search':
                setSearchTerm('');
                break;
            case 'difficulty':
                setDifficultyFilter('all');
                break;
            case 'meal':
                setMealFilter('all');
                break;
            case 'following':
                setShowFollowingOnly(false);
                break;
        }
    };

    const getActiveFilters = () => {
        const filters = [];
        if (searchTerm) filters.push({ type: 'search', label: `Search: ${searchTerm}` });
        if (difficultyFilter !== 'all') {
            const difficultyLabel = difficultyCategories.find(d => d.difficultyTitle.toLowerCase() === difficultyFilter)?.difficultyTitle || difficultyFilter;
            filters.push({ type: 'difficulty', label: `Difficulty: ${difficultyLabel}` });
        }
        if (mealFilter !== 'all') {
            const mealLabel = mealCategories.find(m => m.mealCateTitle.toLowerCase() === mealFilter)?.mealCateTitle || mealFilter;
            filters.push({ type: 'meal', label: `Meal: ${mealLabel}` });
        }
        if (showFollowingOnly) filters.push({ type: 'following', label: 'Following Only' });
        return filters;
    };

    const activeFilters = getActiveFilters();

    return (
        <MainContent>
            <CalendarHeader>
                <HeaderTop>
                    <Title>
                        <Calendar size={28} color="#ff8c42"/>
                        Meal Planning Calendar
                    </Title>
                </HeaderTop>

                <SearchAndFilterContainer>
                    <SearchSection>
                        <SearchIcon>
                            <Search size={20}/>
                        </SearchIcon>
                        <SearchInput
                            type="text"
                            placeholder="Search recipes by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </SearchSection>

                    <FilterSection>
                        <FilterGroup>
                            <FilterLabel>Meal Category</FilterLabel>
                            <CustomDropdown
                                value={mealFilter}
                                onChange={(e) => setMealFilter(e.target.value)}
                                options={[
                                    { value: 'all', label: 'All Categories' },
                                    ...mealCategories.map(cat => ({
                                        value: cat.mealCateTitle.toLowerCase(),
                                        label: cat.mealCateTitle
                                    }))
                                ]}
                                placeholder="All Categories"
                            />
                        </FilterGroup>

                        <FilterGroup>
                            <FilterLabel>Difficulty Level</FilterLabel>
                            <CustomDropdown
                                value={difficultyFilter}
                                onChange={(e) => setDifficultyFilter(e.target.value)}
                                options={[
                                    { value: 'all', label: 'All Difficulties' },
                                    ...difficultyCategories.map(cat => ({
                                        value: cat.difficultyTitle.toLowerCase(),
                                        label: cat.difficultyTitle
                                    }))
                                ]}
                                placeholder="All Difficulties"
                            />
                        </FilterGroup>

                        <FilterGroup>
                            <FilterLabel>Source Filter</FilterLabel>
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
                        </FilterGroup>
                    </FilterSection>
                </SearchAndFilterContainer>

                {activeFilters.length > 0 && (
                    <ActiveFiltersSection>
                        {activeFilters.map((filter, index) => (
                            <ActiveFilterTag key={index}>
                                {filter.label}
                                <RemoveTagButton onClick={() => removeFilter(filter.type)}>
                                    <X size={14} />
                                </RemoveTagButton>
                            </ActiveFilterTag>
                        ))}
                        <ClearAllButton onClick={clearAllFilters}>
                            Clear All
                        </ClearAllButton>
                    </ActiveFiltersSection>
                )}
            </CalendarHeader>

            <ContentWrapper>
                <RecipeLibrary id="recipe-library">
                    <LibraryHeader>Recipe Library</LibraryHeader>
                    <RecipeListContainer>
                        {recipesLoading ? (
                            <div style={{textAlign: 'center', padding: '2rem', color: '#6b7280'}}>
                                Loading recipes...
                            </div>
                        ) : isSearching ? (
                            <div style={{textAlign: 'center', padding: '2rem', color: '#6b7280'}}>
                                Searching...
                            </div>
                        ) : displayedRecipes.length === 0 ? (
                            <div style={{textAlign: 'center', padding: '2rem', color: '#6b7280'}}>
                                No recipes found matching your criteria.
                            </div>
                        ) : (
                            displayedRecipes.map((recipe) => (
                                <RecipeItem
                                    key={recipe.id}
                                    className="fc-event"
                                    difficulty={recipe.difficulty}
                                    data-recipe={JSON.stringify(recipe)}
                                >
                                    <RecipeImageArea imageUrl={recipe.imageUrl} />
                                    <RecipeContent>
                                        <RecipeTitle>{recipe.title}</RecipeTitle>
                                        <RecipeDetails>
                                            <span>{recipe.difficulty}</span>
                                            <span>{recipe.meal}</span>
                                        </RecipeDetails>
                                    </RecipeContent>
                                </RecipeItem>
                            ))
                        )}
                    </RecipeListContainer>
                </RecipeLibrary>

                <CalendarContainer>
                    <CalendarWrapper>
                        <div ref={calendarRef}></div>
                    </CalendarWrapper>
                </CalendarContainer>
            </ContentWrapper>
        </MainContent>
    );
};

export default CalendarPage;