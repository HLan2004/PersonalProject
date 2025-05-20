import React from "react";
import styled from "styled-components";

const FilterBarContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem 0;
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

const FilterBar = () => {
    return (
        <FilterBarContainer>
            <span>FILTER</span>
            <FilterSelect>
                <option>All Categories</option>
            </FilterSelect>
            <FilterSelect>
                <option>Difficulty</option>
            </FilterSelect>
        </FilterBarContainer>
    );
};

export default FilterBar;
