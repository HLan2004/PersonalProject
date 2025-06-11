import React, {useEffect, useState} from "react";
import styled from "styled-components";
import { FaHeart, FaClock, FaPrint, FaShare, FaFacebook, FaTwitter, FaInstagram, FaArrowUp } from "react-icons/fa";
import {useParams} from "react-router-dom";
import {fetchPostById} from "../service/posts.js";

const PostContainer = styled.div`
    max-width: 100vw;
    margin: 50px 90px 0 27px;
    padding: 20px 20px 40px;
`;

const PostHeader = styled.div`
    display: flex;
    flex-direction: row;
    gap: 30px;
    margin-bottom: 30px;
`;

const ImageWrapper = styled.div`
    flex: 0 0 33%;
    position: relative;
`;

const PaperBackground = styled.div`
    position: absolute;
    width: 85%;
    height: 97%;
    background-color: #cacfd2;
    border-radius: 8px;
    transform: rotate(-3deg);
    z-index: 0;
`;

const ImageContainer = styled.div`
    position: relative;
    width: 80%;
    margin: 5% auto;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    z-index: 1;
`;

const PostImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const PostInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const MetaWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    flex-wrap: wrap;
    gap: 15px;
`;

const CategoryTag = styled.span`
    background-color: #ffc107;
    color: #333;
    font-weight: 600;
    font-size: 12px;
    padding: 6px 12px;
    border-radius: 4px;
    display: inline-block;
    width: fit-content;
`;

const PostTitle = styled.h1`
    font-size: 36px;
    font-weight: 700;
    margin: 0 0 20px 0;
    color: #333;
`;

const PostMeta = styled.div`
    display: flex;
    gap: 20px;
`;

const MetaItem = styled.div`
    display: flex;
    align-items: center;
    color: #666;
    font-size: 14px;
    gap: 5px;
`;

const AuthorSection = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
`;

const AuthorAvatar = styled.img`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 15px;
`;

const AuthorInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const AuthorName = styled.div`
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 5px;
`;

const PostDate = styled.div`
    font-size: 14px;
    color: #666;
`;

const Wrapper = styled.div`
    position: relative;
    margin-top: 90px;
`;

const AttributesContainer = styled.div`
    position: absolute;
    top: -50px;
    right: 0;
    z-index: 3;
    display: flex;
    gap: 16px;
`;

const AttributeTag = styled.div`
    display: flex;
    align-items: center;
    padding: 8px 16px;
    border-radius: 4px;
    background-color: #fff;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const difficultyColors = {
    easy: "#cbe740",
    medium: "#ffc107",
    hard: "#f39c12",
    professional: "#e67e22",
    ultimate: "#c0392b",
};

const UltimateTag = styled(AttributeTag)`
    & span {
        color: ${({ difficulty }) =>
                difficultyColors[difficulty.toLowerCase()] || "#c00"};
        margin-right: 8px;
        font-size: 16px;
    }
    font-weight: 600;
`;

const CuisineTag = styled(AttributeTag)`
    & span {
        color: #666;
        margin-right: 4px;
        font-weight: 400;
    }

    & strong {
        color: #000;
        font-weight: 600;
    }
`;

const ContentContainer = styled.div`
    position: relative;
    background-color: #fff;
    border-radius: 2px;
    padding: 40px;
    box-shadow:
            0 3px 12px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(0, 0, 0, 0.05);

    /* Paper texture */
    background-image:
            linear-gradient(rgba(255, 255, 255, 0.8) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.8) 2px, transparent 2px),
            linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
    background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
    background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;

    /* Paper edges */
    &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #e4e4e4, white, #e4e4e4);
    }

    /* Page curl effect */
    &:after {
        content: "";
        position: absolute;
        bottom: 5px;
        right: 5px;
        width: 100px;
        height: 100px;
        background: linear-gradient(135deg, transparent 70%, rgba(0, 0, 0, 0.05) 100%);
        border-radius: 0 0 10px 0;
        z-index: 2;
    }
`;

const DocHeader = styled.div`
    position: relative;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e0e0e0;

    &:after {
        content: "";
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.05), transparent);
    }
`;

const SectionTitle = styled.h2`
    font-size: 24px;
    font-weight: 600;
    color: #444;
    margin-bottom: 20px;
    font-family: "Times New Roman", Times, serif;
    position: relative;

    &:before {
        content: "§";
        margin-right: 8px;
        color: #999;
        font-size: 20px;
    }
`;

const PageNumber = styled.div`
    position: absolute;
    bottom: 20px;
    right: 30px;
    font-size: 12px;
    color: #999;
    font-style: italic;

    &:before {
        content: "Page ";
    }
`;

const DocFooter = styled.div`
    margin-top: 30px;
    padding-top: 15px;
    border-top: 1px solid #e0e0e0;
    color: #999;
    font-size: 12px;
    font-style: italic;
    text-align: center;
`;

const SocialShare = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 20px;
`;

const SocialButton = styled.button`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    border: none;
    color: #333;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
        background-color: ${props => props.color || "#333"};
        color: white;
    }
`;

const PostContent = styled.div`
    min-height: 300px;
    line-height: 1.7;
    color: #444;
    font-family: "Georgia", serif;
    font-size: 16px;
    text-align: justify;
    column-count: 2;
    column-gap: 40px;
    margin-bottom: 30px;

    @media (max-width: 768px) {
        column-count: 1;
    }

    /* First letter styling */
    &::first-letter {
        font-size: 42px;
        line-height: 42px;
        font-weight: bold;
        margin-right: 5px;
        float: left;
        color: #333;
    }
`;

const InstructionsContent = styled.div`
    line-height: 1.7;
    color: #444;
    font-family: "Georgia", serif;
    font-size: 16px;
    margin-bottom: 30px;
`;

const StepBox = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #fafafa;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    flex-direction: ${props => props.isEven ? 'row-reverse' : 'row'};
`;

const StepContentContainer = styled.div`
    flex: 0 0 55%; 

    @media (max-width: 768px) {
        flex: 0 0 60%; 
    }
`;

const StepNumber = styled.div`
    font-size: 18px;
    font-weight: bold;
    color: #c8102e;
    margin-bottom: 10px;
`;

const StepDescription = styled.div`
    line-height: 1.6;
    text-align: left;
`;

const StepImageContainer = styled.div`
    flex: 0 0 45%; /* Chiếm 45% chiều rộng */

    @media (max-width: 768px) {
        flex: 0 0 40%; /* Giảm nhẹ cho mobile */
    }
`;

const StepImage = styled.img`
    width: 100%;
    height: 330px; /* Giảm chiều cao cố định */
    object-fit: cover; /* Giữ tỷ lệ ảnh */
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Watermark = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 100px;
    opacity: 0.03;
    font-weight: bold;
    color: #000;
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
`;

const ReplyContainer = styled(ContentContainer)`
    margin-top: 20px;
    overflow: hidden;
`;


const Heading = styled.h3`
  margin-bottom: 20px;
  color: #666;
`;

const Textarea = styled.textarea`
  width: 1092px;
  height: 50px;
  padding: 15px;
  background: #eee;
  border: none;
    &:focus {
        outline: none;
    }

    border-radius: 8px;
  resize: vertical;
  margin-bottom: 20px;
`;

const InputRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  flex-wrap: wrap;  
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  background: #eee;
  border: none;
    &:focus {
        outline: none;
    }

    border-radius: 6px;
  min-width: 120px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 14px;
  color: #555;
`;

const SubmitButton = styled.button`
  background-color: #c8102e;
  color: #fff;
  padding: 12px 30px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
`;


const PostPage = () => {

    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetchPostById(id)
            .then(res => setPost(res.data))
            .catch(err => {
                console.error("Error fetching post", err);
                setError("Unable to load post.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <PostContainer>Loading...</PostContainer>;
    }

    if (error) {
        return <PostContainer>{error}</PostContainer>;
    }

    if (!post) {
        return <PostContainer>No post found.</PostContainer>;
    }



    return (
        <PostContainer>
            <PostHeader>
                <ImageWrapper>
                    <PaperBackground />
                    <ImageContainer>
                        <PostImage
                            src={`data:${post.imageType};base64,${post.imageData}`}
                            alt={post.title}
                        />
                    </ImageContainer>
                </ImageWrapper>
                <PostInfo>
                    <MetaWrapper>
                        <CategoryTag>{post.mealCate.mealCateTitle}</CategoryTag>
                        <PostMeta>
                            <MetaItem><FaHeart /> {post.countLike} Likes</MetaItem>
                            <MetaItem><FaClock /> {post.duration} mins</MetaItem>
                            <MetaItem><FaPrint /> PRINT RECIPE</MetaItem>
                            <MetaItem><FaShare /> SHARE</MetaItem>
                        </PostMeta>
                    </MetaWrapper>
                    <PostTitle>{post.title}</PostTitle>
                    <AuthorSection>
                        <AuthorAvatar
                            src={`data:${post.authorAvatarType};base64,${post.authorAvatar}`}
                            alt={post.authorName}
                        />
                        <AuthorInfo>
                            <AuthorName>{post.authorName}</AuthorName>
                            <PostDate>{new Date(post.date).toLocaleDateString()}</PostDate>
                        </AuthorInfo>
                    </AuthorSection>
                </PostInfo>
            </PostHeader>

            <Wrapper>
                <AttributesContainer>
                    <UltimateTag difficulty={post.difficultyCate.difficultyTitle}>
                        <span>●</span>
                        {post.difficultyCate.difficultyTitle}
                    </UltimateTag>

                    <CuisineTag>
                        <span>Cuisine:</span><strong>{post.cuisine}</strong>
                    </CuisineTag>
                </AttributesContainer>

                <ContentContainer>
                    <Watermark>RECIPE</Watermark>

                    <DocHeader>
                        <SectionTitle>Main Description</SectionTitle>
                    </DocHeader>
                    <PostContent dangerouslySetInnerHTML={{ __html: post.description }} />

                    <DocHeader>
                        <SectionTitle>Ingredients</SectionTitle>
                    </DocHeader>
                    <PostContent>
                        {post.ingredients.map((ing, i) => (
                            <div key={i}>• {ing}</div>
                        ))}
                    </PostContent>

                    <DocHeader>
                        <SectionTitle>Instructions</SectionTitle>
                    </DocHeader>
                    <InstructionsContent>
                        {post.instructions
                            .slice()
                            .sort((a, b) => a.stepOrder - b.stepOrder)
                            .map((step, i) => (
                                <StepBox key={i} isEven={step.stepOrder % 2 === 0}>
                                    <StepContentContainer>
                                        <StepNumber>Step {step.stepOrder}</StepNumber>
                                        <StepDescription>{step.description}</StepDescription>
                                    </StepContentContainer>

                                    {step.stepImageData && (
                                        <StepImageContainer>
                                            <StepImage
                                                src={`data:${step.stepImageType};base64,${step.stepImageData}`}
                                                alt={`Step ${step.stepOrder}`}
                                            />
                                        </StepImageContainer>
                                    )}
                                </StepBox>
                            ))}
                    </InstructionsContent>


                    <DocFooter>
                        Recipe ID: {post.postId} • © Your Blog {new Date().getFullYear()}
                    </DocFooter>

                    <PageNumber>1</PageNumber>

                    <SocialShare>
                        <SocialButton color="#1877f2"><FaFacebook /></SocialButton>
                        <SocialButton color="#1da1f2"><FaTwitter /></SocialButton>
                        <SocialButton color="#e4405f"><FaInstagram /></SocialButton>
                        <SocialButton><FaArrowUp /></SocialButton>
                    </SocialShare>
                </ContentContainer>

                <ReplyContainer>
                    <Heading>LEAVE A REPLY</Heading>
                    <Textarea placeholder="Comment" />
                    <InputRow>
                        <Input placeholder="Name" />
                        <Input placeholder="Email" />
                    </InputRow>
                    <CheckboxLabel>
                        <input type="checkbox" style={{ marginRight: "10px" }} />
                        Save my name, email, and website in this browser for the next time I comment.
                    </CheckboxLabel>
                    <SubmitButton>Post Comment</SubmitButton>
                </ReplyContainer>
            </Wrapper>
        </PostContainer>
    );
};


export default PostPage;
