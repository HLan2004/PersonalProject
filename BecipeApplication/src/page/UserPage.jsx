import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { User, MapPin, Calendar, Edit3, Users, UserPlus, UserMinus, Camera } from 'lucide-react';
import { toast } from 'react-toastify';
import {
    fetchCurrentUser,
    getFollowStats,
    getFollowers,
    getFollowing,
    followUser,
    unfollowUser,
    isFollowing, fetchUserById
} from '../service/users.js';

const MainContent = styled.main`
    flex: 1;
    height: 100%;
    padding: 1rem 4rem;
    box-sizing: border-box;
    overflow-y: scroll;
    overflow-x: hidden;
    margin-right: 80px;
    margin-top: 0;

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

const PageContainer = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 0;
    min-height: 100vh;
`;

const ProfileHeader = styled.div`
    background: white;
    border-radius: 24px;
    padding: 3rem;
    margin: 55px 0 2rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.04);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 180px;
        background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff8c42 100%);
        z-index: 0;
    }
`;

const ProfileContent = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    align-items: flex-start;
    gap: 2rem;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
`;

const AvatarContainer = styled.div`
    position: relative;
    flex-shrink: 0;
`;

const Avatar = styled.div`
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: ${props => props.imageUrl
            ? `url(${props.imageUrl})`
            : 'linear-gradient(135deg, #ff6b35, #f7931e)'
    };
    background-size: cover;
    background-position: center;
    border: 6px solid white;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 3rem;
    font-weight: bold;
    cursor: ${props => props.isOwnProfile ? 'pointer' : 'default'};
    transition: all 0.3s ease;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

    &:hover {
        transform: ${props => props.isOwnProfile ? 'scale(1.05)' : 'none'};
        box-shadow: ${props => props.isOwnProfile ? '0 20px 40px rgba(0, 0, 0, 0.25), 0 8px 20px rgba(0, 0, 0, 0.15)' : '0 15px 35px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(0, 0, 0, 0.1)'};
    }
`;

const AvatarUploadOverlay = styled.div`
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    cursor: pointer;

    ${Avatar}:hover & {
        opacity: 1;
    }
`;

const ProfileIdentity = styled.div`
    margin-bottom: 1.5rem;
`;

const ProfileDetailsRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.5rem;
    gap: 2rem;
    
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
`;

const ProfileInfo = styled.div`
    flex: 1;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    position: relative;
    z-index: 2;
`;

const ProfileName = styled.h1`
    font-size: 2.5rem;
    font-weight: 700;
    color: white;
    margin: 0;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.3);
    line-height: 1.2;
    letter-spacing: -0.5px;
`;

const ProfileUsername = styled.p`
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.95);
    margin: 0;
    font-weight: 600;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const ProfileBio = styled.div`
    font-size: 1rem;
    color: #2d3748;
    line-height: 1.6;
    background: linear-gradient(135deg, rgba(248, 250, 252, 0.95), rgba(241, 245, 249, 0.95));
    padding: 1.5rem;
    border-radius: 16px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(203, 213, 225, 0.6);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    margin-top: 1.75rem;
    font-weight: 500;
`;

const ProfileMeta = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
    flex-wrap: wrap;
`;

const MetaItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.95);
    font-size: 0.95rem;
    font-weight: 500;
    background: rgba(0, 0, 0, 0.25);
    padding: 0.65rem 1.25rem;
    border-radius: 25px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(15px);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;

    &:hover {
        background: rgba(0, 0, 0, 0.35);
        transform: translateY(-1px);
    }

    svg {
        width: 16px;
        height: 16px;
        opacity: 0.95;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
    }
`;

const ProfileActions = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    flex-wrap: wrap;
`;

const ActionButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.85rem 1.75rem;
    border: none;
    border-radius: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.95rem;
    letter-spacing: 0.3px;

    ${props => props.variant === 'primary' ? `
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        color: white;
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        &:hover {
            background: linear-gradient(135deg, #2563eb, #1e40af);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }
    ` : props.variant === 'danger' ? `
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        &:hover {
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
        }
    ` : `
        background: rgba(255, 255, 255, 0.98);
        color: #374151;
        border: 2px solid rgba(255, 255, 255, 0.4);
        backdrop-filter: blur(15px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        &:hover {
            background: white;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            color: #1f2937;
        }
    `}
`;

const StatsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
`;

const StatCard = styled.div`
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.04);
    text-align: center;
    cursor: ${props => props.clickable ? 'pointer' : 'default'};
    transition: all 0.3s ease;

    &:hover {
        transform: ${props => props.clickable ? 'translateY(-4px)' : 'none'};
        box-shadow: ${props => props.clickable ? '0 4px 20px rgba(0, 0, 0, 0.1)' : '0 2px 15px rgba(0, 0, 0, 0.05)'};
    }
`;

const StatNumber = styled.div`
    font-size: 2.5rem;
    font-weight: 700;
    color: #ff8c42;
    margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
    font-size: 1rem;
    color: #64748b;
    font-weight: 500;
`;

const LoadingSpinner = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    font-size: 1.1rem;
    color: #6b7280;
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 3rem;
    color: #6b7280;
`;

const Modal = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
`;

const ModalContent = styled.div`
    background: white;
    border-radius: 20px;
    padding: 2rem;
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
`;

const ModalTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1.5rem;
`;

const UserCard = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 12px;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        background: #f8fafc;
    }
`;

const UserAvatar = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: ${props => props.imageUrl
            ? `url(${props.imageUrl})`
            : 'linear-gradient(135deg, #ff8c42, #e67e22)'
    };
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
`;

const UserInfo = styled.div`
    flex: 1;
`;

const UserName = styled.div`
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.25rem;
`;

const UserUsername = styled.div`
    color: #6b7280;
    font-size: 0.9rem;
`;

const UserPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [profileUser, setProfileUser] = useState(null);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [followStats, setFollowStats] = useState({ followersCount: 0, followingCount: 0 });
    const [isFollowingUser, setIsFollowingUser] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    useEffect(() => {
        loadUserData();
    }, [userId]);

    useEffect(() => {
        if (profileUser && currentUser) {
            setIsOwnProfile(profileUser.id === currentUser.id);
            if (profileUser.id !== currentUser.id) {
                checkFollowingStatus();
            }
            loadFollowStats();
        }
    }, [profileUser, currentUser]);

    const loadUserData = async () => {
        try {
            setLoading(true);

            const currentUserResponse = await fetchCurrentUser();
            setCurrentUser(currentUserResponse.data);

            // If userId exists in URL, fetch that specific user, otherwise show current user
            if (userId) {
                // Fetch the specific user by ID
                const profileUserResponse = await fetchUserById(userId);
                setProfileUser(profileUserResponse.data);
            } else {
                // No userId in URL means show current user's profile
                setProfileUser(currentUserResponse.data);
            }
        } catch (error) {
            console.error('Failed to load user data:', error);
            toast.error('Failed to load user profile');
        } finally {
            setLoading(false);
        }
    };

    const loadFollowStats = async () => {
        try {
            const response = await getFollowStats(profileUser.id);
            setFollowStats(response.data);
        } catch (error) {
            console.error('Failed to load follow stats:', error);
        }
    };

    const checkFollowingStatus = async () => {
        try {
            const response = await isFollowing(profileUser.id);
            setIsFollowingUser(response.data.isFollowing);
        } catch (error) {
            console.error('Failed to check following status:', error);
        }
    };

    const handleFollow = async () => {
        try {
            if (isFollowingUser) {
                await unfollowUser(profileUser.id);
                setIsFollowingUser(false);
                toast.success('User unfollowed successfully');
            } else {
                await followUser(profileUser.id);
                setIsFollowingUser(true);
                toast.success('User followed successfully');
            }
            loadFollowStats();
        } catch (error) {
            console.error('Failed to follow/unfollow user:', error);
            toast.error('Failed to update follow status');
        }
    };

    const loadFollowers = async () => {
        try {
            const response = await getFollowers(profileUser.id, 0, 50);
            setFollowers(response.data.content || []);
            setShowFollowersModal(true);
        } catch (error) {
            console.error('Failed to load followers:', error);
            toast.error('Failed to load followers');
        }
    };

    const loadFollowing = async () => {
        try {
            const response = await getFollowing(profileUser.id, 0, 50);
            setFollowing(response.data.content || []);
            setShowFollowingModal(true);
        } catch (error) {
            console.error('Failed to load following:', error);
            toast.error('Failed to load following');
        }
    };

    const handleUserClick = (clickedUserId) => {
        setShowFollowersModal(false);
        setShowFollowingModal(false);
        if (clickedUserId === currentUser.id) {
            navigate('/app/profile');
        } else {
            navigate(`/app/user/${clickedUserId}`);
        }
    };

    // Function to get proper image URL based on your UserDto structure
    const getUserImageUrl = (user) => {
        if (user?.imageData && user?.imageType) {
            return `data:${user.imageType};base64,${user.imageData}`;
        }
        return null;
    };

    if (loading) {
        return (
            <MainContent>
                <PageContainer>
                    <LoadingSpinner>Loading profile...</LoadingSpinner>
                </PageContainer>
            </MainContent>
        );
    }

    if (!profileUser) {
        return (
            <MainContent>
                <PageContainer>
                    <EmptyState>
                        <h2>User not found</h2>
                        <p>The requested user profile could not be found.</p>
                    </EmptyState>
                </PageContainer>
            </MainContent>
        );
    }

    return (
        <MainContent>
            <PageContainer>
                <ProfileHeader>
                    <ProfileContent>
                        <AvatarContainer>
                            <Avatar
                                imageUrl={getUserImageUrl(profileUser)}
                                isOwnProfile={isOwnProfile}
                            >
                                {!getUserImageUrl(profileUser) && (profileUser.username?.charAt(0) || 'U')}
                                {isOwnProfile && (
                                    <AvatarUploadOverlay>
                                        <Camera size={24} />
                                    </AvatarUploadOverlay>
                                )}
                            </Avatar>
                        </AvatarContainer>

                        <ProfileInfo>
                            <ProfileIdentity>
                                <ProfileName>
                                    {profileUser.username || 'Anonymous User'}
                                </ProfileName>
                                <ProfileUsername>
                                    @{profileUser.username || 'username'}
                                </ProfileUsername>
                            </ProfileIdentity>

                            {profileUser.about && (
                                <ProfileBio>{profileUser.about}</ProfileBio>
                            )}

                            <ProfileDetailsRow>
                                <ProfileMeta>
                                    <MetaItem>
                                        <Calendar size={16} />
                                        <span>
                                            Joined {new Date(profileUser.createdAt || Date.now()).toLocaleDateString('en-US', {
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                        </span>
                                    </MetaItem>
                                </ProfileMeta>

                                <ProfileActions>
                                    {isOwnProfile ? (
                                        <ActionButton variant="secondary" onClick={() => navigate('/app/profile/edit')}>
                                            <Edit3 size={16} />
                                            Edit Profile
                                        </ActionButton>
                                    ) : (
                                        <ActionButton
                                            variant={isFollowingUser ? "danger" : "primary"}
                                            onClick={handleFollow}
                                        >
                                            {isFollowingUser ? <UserMinus size={16} /> : <UserPlus size={16} />}
                                            {isFollowingUser ? 'Unfollow' : 'Follow'}
                                        </ActionButton>
                                    )}
                                </ProfileActions>
                            </ProfileDetailsRow>
                        </ProfileInfo>
                    </ProfileContent>
                </ProfileHeader>

                <StatsContainer>
                    <StatCard clickable onClick={loadFollowers}>
                        <StatNumber>{followStats.followersCount}</StatNumber>
                        <StatLabel>Followers</StatLabel>
                    </StatCard>
                    <StatCard clickable onClick={loadFollowing}>
                        <StatNumber>{followStats.followingCount}</StatNumber>
                        <StatLabel>Following</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatNumber>0</StatNumber>
                        <StatLabel>Total Likes</StatLabel>
                    </StatCard>
                </StatsContainer>

                {/* Followers Modal */}
                {showFollowersModal && (
                    <Modal onClick={() => setShowFollowersModal(false)}>
                        <ModalContent onClick={e => e.stopPropagation()}>
                            <ModalTitle>Followers ({followStats.followersCount})</ModalTitle>
                            {followers.length > 0 ? (
                                followers.map(follower => (
                                    <UserCard
                                        key={follower.id}
                                        onClick={() => handleUserClick(follower.id)}
                                    >
                                        <UserAvatar imageUrl={getUserImageUrl(follower)}>
                                            {!getUserImageUrl(follower) && (follower.username?.charAt(0) || 'U')}
                                        </UserAvatar>
                                        <UserInfo>
                                            <UserName>
                                                {follower.username || 'Anonymous User'}
                                            </UserName>
                                            <UserUsername>@{follower.username || 'username'}</UserUsername>
                                        </UserInfo>
                                    </UserCard>
                                ))
                            ) : (
                                <EmptyState>No followers yet</EmptyState>
                            )}
                        </ModalContent>
                    </Modal>
                )}

                {/* Following Modal */}
                {showFollowingModal && (
                    <Modal onClick={() => setShowFollowingModal(false)}>
                        <ModalContent onClick={e => e.stopPropagation()}>
                            <ModalTitle>Following ({followStats.followingCount})</ModalTitle>
                            {following.length > 0 ? (
                                following.map(followedUser => (
                                    <UserCard
                                        key={followedUser.id}
                                        onClick={() => handleUserClick(followedUser.id)}
                                    >
                                        <UserAvatar imageUrl={getUserImageUrl(followedUser)}>
                                            {!getUserImageUrl(followedUser) && (followedUser.username?.charAt(0) || 'U')}
                                        </UserAvatar>
                                        <UserInfo>
                                            <UserName>
                                                {followedUser.username || 'Anonymous User'}
                                            </UserName>
                                            <UserUsername>@{followedUser.username || 'username'}</UserUsername>
                                        </UserInfo>
                                    </UserCard>
                                ))
                            ) : (
                                <EmptyState>Not following anyone yet</EmptyState>
                            )}
                        </ModalContent>
                    </Modal>
                )}
            </PageContainer>
        </MainContent>
    );
};

export default UserPage;