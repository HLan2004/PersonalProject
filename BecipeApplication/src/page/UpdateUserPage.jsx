import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { User, Camera, Save, X, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchCurrentUser, updateProfile } from '../service/users.js';

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
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 0;
    min-height: 100vh;
`;

const UpdateHeader = styled.div`
    background: white;
    border-radius: 24px;
    padding: 2rem;
    margin: 55px 0 2rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.04);
    text-align: center;
`;

const BackButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: rgba(255, 255, 255, 0.98);
    color: #374151;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-radius: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.95rem;
    letter-spacing: 0.3px;
    backdrop-filter: blur(15px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;

    &:hover {
        background: white;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        color: #1f2937;
    }
`;

const HeaderTitle = styled.h1`
    font-size: 2.2rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
`;

const HeaderSubtitle = styled.p`
    color: #6b7280;
    font-size: 1rem;
    margin: 0;
`;

const FormContainer = styled.div`
    background: white;
    border-radius: 20px;
    padding: 2.5rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.04);
`;

const AvatarSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 2px solid #f3f4f6;
`;

const AvatarContainer = styled.div`
    position: relative;
    margin-bottom: 1rem;
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
    cursor: pointer;
    transition: all 0.3s ease;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    position: relative;

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25), 0 8px 20px rgba(0, 0, 0, 0.15);
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

const AvatarUploadText = styled.p`
    color: #6b7280;
    font-size: 0.9rem;
    margin: 0;
    text-align: center;
`;

const HiddenFileInput = styled.input`
    display: none;
`;

const FormGroup = styled.div`
    margin-bottom: 1.5rem;
`;

const Label = styled.label`
    display: block;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
    font-size: 1rem;
`;

const Textarea = styled.textarea`
    width: 100%;
    padding: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 1rem;
    font-family: inherit;
    line-height: 1.5;
    resize: vertical;
    min-height: 120px;
    transition: all 0.3s ease;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: #ff8c42;
        box-shadow: 0 0 0 3px rgba(255, 140, 66, 0.1);
    }

    &::placeholder {
        color: #9ca3af;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 2px solid #f3f4f6;
`;

const SaveButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #ff8c42, #e67e22);
    color: white;
    border: none;
    border-radius: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
    letter-spacing: 0.3px;
    box-shadow: 0 4px 15px rgba(255, 140, 66, 0.3);

    &:hover {
        background: linear-gradient(135deg, #e67e22, #d35400);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(255, 140, 66, 0.4);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }
`;

const CancelButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    background: rgba(107, 114, 128, 0.1);
    color: #6b7280;
    border: 2px solid #e5e7eb;
    border-radius: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
    letter-spacing: 0.3px;

    &:hover {
        background: rgba(107, 114, 128, 0.2);
        border-color: #d1d5db;
        color: #374151;
        transform: translateY(-2px);
    }
`;

const LoadingSpinner = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    font-size: 1.1rem;
    color: #6b7280;
`;

const UpdateUserPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        about: '',
        imageFile: null
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            setLoading(true);
            const response = await fetchCurrentUser();
            const userData = response.data;

            setCurrentUser(userData);
            setFormData({
                about: userData.about || '',
                imageFile: null
            });

            // Set initial image preview if user has an image
            if (userData.imageData && userData.imageType) {
                setImagePreview(`data:${userData.imageType};base64,${userData.imageData}`);
            }
        } catch (error) {
            console.error('Failed to load user data:', error);
            toast.error('Failed to load user profile');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select a valid image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            setFormData(prev => ({
                ...prev,
                imageFile: file
            }));

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAboutChange = (e) => {
        setFormData(prev => ({
            ...prev,
            about: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            const submitData = new FormData();
            submitData.append('about', formData.about);

            if (formData.imageFile) {
                submitData.append('imageFile', formData.imageFile);
            }

            await updateProfile(submitData);

            toast.success('Profile updated successfully!');
            navigate('/app/profile');
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate('/app/profile');
    };

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

    return (
        <MainContent>
            <PageContainer>
                <BackButton onClick={handleCancel}>
                    <ArrowLeft size={16} />
                    Back to Profile
                </BackButton>

                <UpdateHeader>
                    <HeaderTitle>
                        <User size={28} />
                        Edit Profile
                    </HeaderTitle>
                    <HeaderSubtitle>
                        Update your profile information and avatar
                    </HeaderSubtitle>
                </UpdateHeader>

                <FormContainer>
                    <form onSubmit={handleSubmit}>
                        <AvatarSection>
                            <AvatarContainer>
                                <Avatar imageUrl={imagePreview || getUserImageUrl(currentUser)}>
                                    {!imagePreview && !getUserImageUrl(currentUser) &&
                                        (currentUser?.username?.charAt(0) || 'U')
                                    }
                                    <AvatarUploadOverlay onClick={() => document.getElementById('avatar-upload').click()}>
                                        <Camera size={24} />
                                    </AvatarUploadOverlay>
                                </Avatar>
                                <HiddenFileInput
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </AvatarContainer>
                            <AvatarUploadText>
                                Click on the avatar to change your profile picture
                                <br />
                                <small>Supported formats: JPG, PNG, GIF (Max 5MB)</small>
                            </AvatarUploadText>
                        </AvatarSection>

                        <FormGroup>
                            <Label htmlFor="about">About Me</Label>
                            <Textarea
                                id="about"
                                value={formData.about}
                                onChange={handleAboutChange}
                                placeholder="Tell others about yourself..."
                                maxLength={500}
                            />
                            <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                {formData.about.length}/500 characters
                            </small>
                        </FormGroup>

                        <ButtonGroup>
                            <CancelButton type="button" onClick={handleCancel}>
                                <X size={16} />
                                Cancel
                            </CancelButton>
                            <SaveButton type="submit" disabled={saving}>
                                <Save size={16} />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </SaveButton>
                        </ButtonGroup>
                    </form>
                </FormContainer>
            </PageContainer>
        </MainContent>
    );
};

export default UpdateUserPage;