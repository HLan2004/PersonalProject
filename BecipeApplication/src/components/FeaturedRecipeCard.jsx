
import React from "react";
import styled from "styled-components";
import {ArrowIcon, ClockIcon, HeartIcon} from "./Icon.jsx";


const CardContainer = styled.div`
  display: flex;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const RecipeContent = styled.div`
  flex: 1;
  padding: 2.5rem;
`;

const Category = styled.div`
  background-color: #f8c35a;
  color: #000;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 1rem;
  text-transform: uppercase;
`;

const RecipeDetails = styled.div`
  display: flex;
  margin: 1rem 0;
  cursor: pointer;  

  div {
    display: flex;
    align-items: center;
    margin-right: 1.5rem;
    color: #999;
    font-size: 0.9rem;

    svg {
      margin-right: 0.5rem;
    }
  }
`;

const RecipeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0.5rem 0 1rem;
  line-height: 1.2;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #eee;
    margin-right: 1rem;
  }

  div {
    strong {
      display: block;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 0.2rem;
    }

    span {
      font-size: 0.8rem;
      color: #999;
    }
  }
`;

const ReadMoreLink = styled.a`
  color: #e74c3c;
  display: flex;
  align-items: center;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 1rem;

  svg {
    margin-left: 0.5rem;
  }
`;

const RecipeImage = styled.div`
  flex: 1;
  background-image: url(${props => props.src || "https://images.unsplash.com/photo-1562967914-01efa7e87832?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"});
  background-size: cover;
  background-position: center;
  min-height: 400px;
`;

const FeaturedRecipeCard = () => {
    return (
        <CardContainer>
            <RecipeContent>
                <Category>LUNCH</Category>
                <RecipeDetails>
                    <div>
                        <HeartIcon /> 63 LIKES
                    </div>
                    <div>
                        <ClockIcon /> 45 MIN
                    </div>
                </RecipeDetails>
                <RecipeTitle>Air Fryer Chicken Breasts</RecipeTitle>
                <AuthorInfo>
                    <img src="https://via.placeholder.com/50" alt="Author" />
                    <div>
                        <strong>FRENIFY</strong>
                        <span>October 14, 2020</span>
                    </div>
                </AuthorInfo>
                <ReadMoreLink href="#">
                    Read More <ArrowIcon />
                </ReadMoreLink>
            </RecipeContent>
            <RecipeImage src="https://images.unsplash.com/photo-1562967914-01efa7e87832?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" />
        </CardContainer>
    );
};

export default FeaturedRecipeCard;
