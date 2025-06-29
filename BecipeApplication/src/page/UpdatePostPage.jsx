import React, {useEffect, useState} from "react";
import styled from "styled-components";
import { FaUpload, FaPlus, FaTrash, FaCamera, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { updatePost, fetchPostById } from "../service/posts.js";
import {fetchCurrentUser} from "../service/users.js";
import { toast } from "react-toastify";

// Reuse styled components from CreatePostPage
const CreatePostContainer = styled.div`
    max-width: 100vw;
    max-height: 100vh;
    margin: 20px 90px 0 27px;
    padding: 20px 20px 40px;
    box-sizing: border-box;
    overflow-y: scroll;
    overflow-x: hidden;

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

const FormContainer = styled.div`
    background-color: #fff;
    border-radius: 8px;
    padding: 40px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
`;

const FormHeader = styled.div`
    margin-bottom: 30px;
    text-align: center;
`;

const FormTitle = styled.h1`
    font-size: 36px;
    font-weight: 700;
    color: #333;
    margin-bottom: 10px;
`;

const FormSubtitle = styled.p`
    color: #666;
    font-size: 16px;
`;

const BackButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 20px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #5a6268;
    }
`;

const FormSection = styled.div`
    margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
    font-size: 20px;
    font-weight: 600;
    color: #444;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 2px solid #ffd97d;
`;

const FormRow = styled.div`
    display: flex;
    gap: 20px;
    margin-bottom: 20px;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const FormGroup = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
`;

const Label = styled.label`
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
    font-size: 14px;
`;

const Input = styled.input`
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 16px;
    transition: border-color 0.3s ease;

    &:focus {
        outline: none;
        border-color: #ffd97d;
    }

    &::placeholder {
        color: #999;
    }
`;

const Textarea = styled.textarea`
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 16px;
    min-height: 120px;
    resize: vertical;
    transition: border-color 0.3s ease;

    &:focus {
        outline: none;
        border-color: #ffd97d;
    }

    &::placeholder {
        color: #999;
    }
`;

const ImageUploadArea = styled.div`
    border: 2px dashed #e0e0e0;
    border-radius: 8px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        border-color: #ffd97d;
        background-color: #fffbf0;
    }

    ${props => props.hasImage && `
        border-color: #ffd97d;
        background-color: #fffbf0;
    `}
`;

const ImagePreview = styled.div`
    margin-top: 15px;
    display: flex;
    justify-content: center;
`;

const PreviewImage = styled.img`
    max-width: 300px;
    max-height: 200px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const UploadText = styled.p`
    color: #666;
    margin: 10px 0 0 0;
    font-size: 14px;
`;

const IngredientsContainer = styled.div`
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    background-color: #fafafa;
`;

const IngredientRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
`;

const IngredientInput = styled(Input)`
    flex: 1;
`;

const RemoveButton = styled.button`
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #c0392b;
    }
`;

const AddButton = styled.button`
    background-color: #ffd97d;
    color: #333;
    border: none;
    border-radius: 6px;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #ffca45;
    }
`;

const InstructionCard = styled.div`
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 15px;
    background-color: #fafafa;
`;

const InstructionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
`;

const InstructionTextarea = styled(Textarea)`
    width: 100%;
    box-sizing: border-box;
`;

const StepNumber = styled.span`
    font-weight: bold;
    color: #c8102e;
    font-size: 18px;
`;

const InstructionImageUpload = styled.div`
    border: 1px dashed #ccc;
    border-radius: 6px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    margin-top: 10px;
    transition: all 0.3s ease;

    &:hover {
        border-color: #ffd97d;
        background-color: #fffbf0;
    }
`;

const SubmitSection = styled.div`
    text-align: center;
    margin-top: 40px;
    padding-top: 30px;
    border-top: 1px solid #e0e0e0;
`;

const SubmitButton = styled.button`
    background-color: #c8102e;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 16px 48px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #a01e28;
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

const CancelButton = styled.button`
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 16px 48px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    margin-right: 15px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #5a6268;
    }
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    font-size: 18px;
    color: #666;
`;

const UpdatePostPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [originalPost, setOriginalPost] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        duration: "",
        cuisine: "",
        mealCateId: "",
        difficultyCateId: "",
        ingredients: [""],
        instructions: [{ description: "", stepImage: null }],
        mainImage: null
    });

    const [mealCategories] = useState([
        { id: 1, title: "Breakfast" },
        { id: 2, title: "Lunch" },
        { id: 3, title: "Dinner" },
        { id: 4, title: "Dessert" },
        { id: 5, title: "Snack" }
    ]);

    const [difficultyCategories] = useState([
        { id: 1, title: "Ease" },
        { id: 2, title: "Medium" },
        { id: 3, title: "Hard" },
        { id: 4, title: "Professional" },
        { id: 5, title: "Ultimate" }
    ]);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // Load current user
                const userResponse = await fetchCurrentUser();
                if (userResponse && userResponse.data) {
                    setCurrentUser(userResponse.data);
                }

                // Load post data
                const postResponse = await fetchPostById(id);
                if (postResponse && postResponse.data) {
                    const post = postResponse.data;
                    setOriginalPost(post);

                    // Populate form with existing data
                    setFormData({
                        title: post.title || "",
                        description: post.description || "",
                        duration: post.duration || "",
                        cuisine: post.cuisine || "",
                        mealCateId: post.mealCate?.id || "",
                        difficultyCateId: post.difficultyCate?.id || "",
                        ingredients: post.ingredients && post.ingredients.length > 0
                            ? post.ingredients.map(ing => ing.ingredientContent || ing)
                            : [""],
                        instructions: post.instructions && post.instructions.length > 0
                            ? post.instructions.map((inst) => {  // Remove the index parameter
                                return {
                                    description: inst.description || "",
                                    stepImage: null,
                                    existingImageData: inst.stepImageData,
                                    existingImageType: inst.stepImageType
                                };
                            })
                            : [{ description: "", stepImage: null }],
                        mainImage: null
                    });
                }
            } catch (error) {
                console.error('Failed to load post data:', error);
                toast.error('Failed to load post data');
                navigate('/app');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadData();
        }
    }, [id, navigate]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageUpload = (file, field) => {
        if (file) {
            setFormData(prev => ({
                ...prev,
                [field]: file
            }));
        }
    };

    const handleIngredientChange = (index, value) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index] = value;
        setFormData(prev => ({
            ...prev,
            ingredients: newIngredients
        }));
    };

    const addIngredient = () => {
        setFormData(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, ""]
        }));
    };

    const removeIngredient = (index) => {
        const newIngredients = formData.ingredients.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            ingredients: newIngredients
        }));
    };

    const handleInstructionChange = (index, field, value) => {
        const newInstructions = [...formData.instructions];
        newInstructions[index] = {
            ...newInstructions[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            instructions: newInstructions
        }));
    };

    const addInstruction = () => {
        setFormData(prev => ({
            ...prev,
            instructions: [...prev.instructions, { description: "", stepImage: null }]
        }));
    };

    const removeInstruction = (index) => {
        const newInstructions = formData.instructions.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            instructions: newInstructions
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser || !currentUser.id) {
            toast.error('User information not loaded. Please try again.');
            return;
        }

        setSubmitting(true);

        try {
            const submitData = new FormData();

            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('duration', formData.duration);
            submitData.append('cuisine', formData.cuisine);
            submitData.append('mealCateId', formData.mealCateId);
            submitData.append('difficultyCateId', formData.difficultyCateId);

            if (formData.mainImage) {
                submitData.append('imageFile', formData.mainImage);
            }

            const validIngredients = formData.ingredients.filter(ing => ing.trim());
            validIngredients.forEach((ingredient, index) => {
                submitData.append(`ingredients[${index}]`, ingredient);
            });

            formData.instructions.forEach((inst, index) => {
                submitData.append(`instructions[${index}].stepOrder`, index + 1);
                submitData.append(`instructions[${index}].description`, inst.description);

                if (inst.stepImage) {
                    submitData.append(`instructions[${index}].imageFile`, inst.stepImage);
                }
            });

            const response = await updatePost(id, submitData);

            if (response && response.data) {
                console.log('Post updated successfully:', response.data);
                toast.success('Post updated successfully!');
                navigate(`/app/post/${id}`);
            }
        } catch (error) {
            console.error('Error updating post:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            }
            toast.error('Failed to update post. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate(`/app/post/${id}`);
    };

    if (loading) {
        return (
            <CreatePostContainer>
                <FormContainer>
                    <LoadingContainer>Loading post data...</LoadingContainer>
                </FormContainer>
            </CreatePostContainer>
        );
    }

    if (!originalPost) {
        return (
            <CreatePostContainer>
                <FormContainer>
                    <LoadingContainer>Post not found</LoadingContainer>
                </FormContainer>
            </CreatePostContainer>
        );
    }

    return (
        <CreatePostContainer>
            <FormContainer>
                <BackButton onClick={handleCancel}>
                    <FaArrowLeft />
                    Back to Post
                </BackButton>

                <FormHeader>
                    <FormTitle>Update Recipe</FormTitle>
                    <FormSubtitle>Edit your recipe details</FormSubtitle>
                </FormHeader>

                <form onSubmit={handleSubmit}>
                    {/* Basic Information */}
                    <FormSection>
                        <SectionTitle>Basic Information</SectionTitle>
                        <FormGroup>
                            <Label>Recipe Title *</Label>
                            <Input
                                type="text"
                                placeholder="Enter recipe title..."
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                required
                            />
                        </FormGroup>

                        <FormRow>
                            <FormGroup>
                                <Label>Cuisine Type *</Label>
                                <Input
                                    type="text"
                                    placeholder="e.g., Italian, Chinese, Mexican..."
                                    value={formData.cuisine}
                                    onChange={(e) => handleInputChange('cuisine', e.target.value)}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Cooking Time (minutes) *</Label>
                                <Input
                                    type="number"
                                    placeholder="30"
                                    value={formData.duration}
                                    onChange={(e) => handleInputChange('duration', e.target.value)}
                                    required
                                />
                            </FormGroup>
                        </FormRow>

                        <FormRow>
                            <FormGroup>
                                <Label>Meal Category</Label>
                                <Input
                                    type="text"
                                    value={mealCategories.find(cat => cat.id === formData.mealCateId)?.title || 'Not selected'}
                                    readOnly
                                    style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Difficulty Level</Label>
                                <Input
                                    type="text"
                                    value={difficultyCategories.find(diff => diff.id === formData.difficultyCateId)?.title || 'Not selected'}
                                    readOnly
                                    style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                                />
                            </FormGroup>
                        </FormRow>

                        <FormGroup>
                            <Label>Description *</Label>
                            <Textarea
                                placeholder="Describe your recipe..."
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                required
                            />
                        </FormGroup>
                    </FormSection>

                    {/* Main Image */}
                    <FormSection>
                        <SectionTitle>Recipe Image</SectionTitle>
                        <ImageUploadArea
                            hasImage={formData.mainImage || originalPost.imageData}
                            onClick={() => document.getElementById('mainImageInput').click()}
                        >
                            <FaCamera size={48} color="#ffd97d" />
                            <UploadText>Click to upload new recipe image</UploadText>
                            <UploadText style={{fontSize: '12px', color: '#888', marginTop: '5px'}}>
                                Recommended: 800x600px, JPEG format, under 150KB
                            </UploadText>
                            {formData.mainImage ? (
                                <ImagePreview>
                                    <PreviewImage
                                        src={URL.createObjectURL(formData.mainImage)}
                                        alt="Preview"
                                    />
                                </ImagePreview>
                            ) : originalPost.imageData && (
                                <ImagePreview>
                                    <PreviewImage
                                        src={`data:${originalPost.imageType};base64,${originalPost.imageData}`}
                                        alt="Current Image"
                                    />
                                </ImagePreview>
                            )}
                        </ImageUploadArea>
                        <input
                            id="mainImageInput"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => handleImageUpload(e.target.files[0], 'mainImage')}
                        />
                    </FormSection>

                    {/* Ingredients */}
                    <FormSection>
                        <SectionTitle>Ingredients</SectionTitle>
                        <IngredientsContainer>
                            {formData.ingredients.map((ingredient, index) => (
                                <IngredientRow key={index}>
                                    <IngredientInput
                                        type="text"
                                        placeholder={`Ingredient ${index + 1}`}
                                        value={ingredient}
                                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                                    />
                                    {formData.ingredients.length > 1 && (
                                        <RemoveButton
                                            type="button"
                                            onClick={() => removeIngredient(index)}
                                        >
                                            <FaTrash />
                                        </RemoveButton>
                                    )}
                                </IngredientRow>
                            ))}
                            <AddButton type="button" onClick={addIngredient}>
                                <FaPlus />
                                Add Ingredient
                            </AddButton>
                        </IngredientsContainer>
                    </FormSection>

                    {/* Instructions */}
                    <FormSection>
                        <SectionTitle>Instructions</SectionTitle>
                        {formData.instructions.map((instruction, index) => (
                            <InstructionCard key={index}>
                                <InstructionHeader>
                                    <StepNumber>Step {index + 1}</StepNumber>
                                    {formData.instructions.length > 1 && (
                                        <RemoveButton
                                            type="button"
                                            onClick={() => removeInstruction(index)}
                                        >
                                            <FaTrash />
                                        </RemoveButton>
                                    )}
                                </InstructionHeader>
                                <InstructionTextarea
                                    placeholder={`Describe step ${index + 1}...`}
                                    value={instruction.description}
                                    onChange={(e) => handleInstructionChange(index, 'description', e.target.value)}
                                />
                                <InstructionImageUpload
                                    onClick={() => document.getElementById(`stepImage${index}`).click()}
                                >
                                    <FaUpload size={24} color="#ffd97d" />
                                    <UploadText>Upload step image (optional)</UploadText>
                                    {instruction.stepImage ? (
                                        <ImagePreview>
                                            <PreviewImage
                                                src={URL.createObjectURL(instruction.stepImage)}
                                                alt={`Step ${index + 1}`}
                                            />
                                        </ImagePreview>
                                    ) : instruction.existingImageData && (
                                        <ImagePreview>
                                            <PreviewImage
                                                src={`data:${instruction.existingImageType};base64,${instruction.existingImageData}`}
                                                alt={`Step ${index + 1}`}
                                            />
                                        </ImagePreview>
                                    )}
                                </InstructionImageUpload>
                                <input
                                    id={`stepImage${index}`}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleInstructionChange(index, 'stepImage', e.target.files[0])}
                                />
                            </InstructionCard>
                        ))}
                        <AddButton type="button" onClick={addInstruction}>
                            <FaPlus />
                            Add Step
                        </AddButton>
                    </FormSection>

                    {/* Submit Section */}
                    <SubmitSection>
                        <CancelButton type="button" onClick={handleCancel}>
                            Cancel
                        </CancelButton>
                        <SubmitButton type="submit" disabled={submitting}>
                            {submitting ? 'Updating...' : 'Update Recipe'}
                        </SubmitButton>
                    </SubmitSection>
                </form>
            </FormContainer>
        </CreatePostContainer>
    );
};

export default UpdatePostPage;