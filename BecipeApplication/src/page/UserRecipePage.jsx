import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import { fetchMyPostsByMealCategory } from "../service/users";
import { deleteMultiplePosts } from "../service/posts";
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

const PageHeader = styled.div`
    margin: 55px 0 45px;
    padding: 20px 30px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
`;

const HeaderContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
`;

const HeaderLeft = styled.div`
    flex: 1;
`;

const HeaderRight = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
`;

const PageTitle = styled.h1`
    font-size: 28px;
    font-weight: 700;
    color: #333;
    margin: 0;
`;

const CategorySubtitle = styled.p`
    color: #666;
    font-size: 16px;
    margin: 8px 0 0 0;
`;

const PostCount = styled.span`
    color: #999;
    font-size: 14px;
`;

const SelectionControls = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
`;

const ActionButton = styled.button`
    background: ${props => {
        if (props.variant === 'danger') return '#c8102e';
        if (props.variant === 'primary') return '#ff8c42';
        return '#6c757d';
    }};
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        background: ${props => {
            if (props.variant === 'danger') return '#a01e28';
            if (props.variant === 'primary') return '#e67e22';
            return '#5a6268';
        }};
        transform: translateY(-1px);
    }

    &:disabled {
        background: #bdc3c7;
        cursor: not-allowed;
        transform: none;
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }
`;

const SelectedCount = styled.span`
    color: #ff8c42;
    font-weight: 600;
    font-size: 14px;
    padding: 6px 12px;
    background: #fff8f3;
    border-radius: 20px;
    border: 1px solid #ffb366;
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    font-size: 18px;
    color: #666;
`;

const ErrorContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    font-size: 18px;
    color: #e74c3c;
    text-align: center;
`;

const NoPostsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 300px;
    text-align: center;
`;

const NoPostsTitle = styled.h2`
    font-size: 24px;
    color: #666;
    margin-bottom: 10px;
`;

const NoPostsMessage = styled.p`
    font-size: 16px;
    color: #999;
    margin: 0;
`;

const UserRecipePage = () => {
    const { categoryId } = useParams();
    const location = useLocation();
    const categoryTitle = location.state?.categoryTitle || "Category";

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedPosts, setSelectedPosts] = useState(new Set());
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetchMyPostsByMealCategory(categoryId);
                setPosts(response.data);
            } catch (err) {
                console.error("Error fetching user posts:", err);
                setError("Failed to load your recipes. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (categoryId) {
            fetchUserPosts();
        }
    }, [categoryId]);

    const handleSelectionToggle = () => {
        setSelectionMode(!selectionMode);
        setSelectedPosts(new Set()); // Clear selections when toggling mode
    };

    const handlePostSelect = (postId) => {
        const newSelected = new Set(selectedPosts);
        if (newSelected.has(postId)) {
            newSelected.delete(postId);
        } else {
            newSelected.add(postId);
        }
        setSelectedPosts(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedPosts.size === posts.length) {
            setSelectedPosts(new Set()); // Deselect all
        } else {
            setSelectedPosts(new Set(posts.map(post => post.postId)));
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedPosts.size === 0) return;

        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${selectedPosts.size} recipe${selectedPosts.size > 1 ? 's' : ''}? This action cannot be undone.`
        );

        if (!confirmDelete) return;

        try {
            setDeleting(true);
            const postIdsArray = Array.from(selectedPosts);

            await deleteMultiplePosts(postIdsArray);

            setPosts(prevPosts =>
                prevPosts.filter(post => !selectedPosts.has(post.postId))
            );

            setSelectedPosts(new Set());
            setSelectionMode(false);

            alert(`Successfully deleted ${postIdsArray.length} recipe${postIdsArray.length > 1 ? 's' : ''}!`);

        } catch (error) {
            console.error("Error deleting posts:", error);

            if (error.response?.status === 404) {
                alert("Some recipes were not found. They may have already been deleted.");
            } else if (error.response?.status === 400) {
                alert("Invalid request. Please try again.");
            } else {
                alert("Failed to delete recipes. Please try again.");
            }
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <MainContent>
                <LoadingContainer>
                    Loading your recipes...
                </LoadingContainer>
            </MainContent>
        );
    }

    if (error) {
        return (
            <MainContent>
                <ErrorContainer>
                    {error}
                </ErrorContainer>
            </MainContent>
        );
    }

    return (
        <MainContent>
            <PageHeader>
                <HeaderContent>
                    <HeaderLeft>
                        <PageTitle>My {categoryTitle} Recipes</PageTitle>
                        <CategorySubtitle>
                            Your personal collection of {categoryTitle.toLowerCase()} recipes
                        </CategorySubtitle>
                    </HeaderLeft>

                    {posts.length > 0 && (
                        <HeaderRight>
                            <SelectionControls>
                                {!selectionMode ? (
                                    <ActionButton
                                        variant="primary"
                                        onClick={handleSelectionToggle}
                                    >
                                        Select Recipes
                                    </ActionButton>
                                ) : (
                                    <>
                                        {selectedPosts.size > 0 && (
                                            <SelectedCount>
                                                {selectedPosts.size} selected
                                            </SelectedCount>
                                        )}

                                        <ActionButton
                                            onClick={handleSelectAll}
                                            disabled={posts.length === 0}
                                        >
                                            {selectedPosts.size === posts.length ? 'Deselect All' : 'Select All'}
                                        </ActionButton>

                                        <ActionButton
                                            variant="danger"
                                            onClick={handleDeleteSelected}
                                            disabled={selectedPosts.size === 0 || deleting}
                                        >
                                            {deleting ? 'Deleting...' : `Delete (${selectedPosts.size})`}
                                        </ActionButton>

                                        <ActionButton
                                            onClick={handleSelectionToggle}
                                        >
                                            Cancel
                                        </ActionButton>
                                    </>
                                )}
                            </SelectionControls>
                        </HeaderRight>
                    )}
                </HeaderContent>

                <PostCount>
                    {posts.length} {posts.length === 1 ? 'recipe' : 'recipes'} found
                </PostCount>
            </PageHeader>

            {posts.length === 0 ? (
                <NoPostsContainer>
                    <NoPostsTitle>No recipes found</NoPostsTitle>
                    <NoPostsMessage>
                        You haven't created any {categoryTitle.toLowerCase()} recipes yet.
                        <br />
                        Start sharing your favorite recipes with the community!
                    </NoPostsMessage>
                </NoPostsContainer>
            ) : (
                <RecipeCard
                    posts={posts}
                    selectionMode={selectionMode}
                    selectedPosts={selectedPosts}
                    onPostSelect={handlePostSelect}
                />
            )}
        </MainContent>
    );
};

export default UserRecipePage;