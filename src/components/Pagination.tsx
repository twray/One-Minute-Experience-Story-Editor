import React from 'react';

import styled from 'styled-components';
import classNames from 'classnames';

const PaginationNav = styled.nav`
  display: block;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  button {
    display: block;
    margin: 0;
    padding: 0;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #FFFFFF;
    opacity: 0.5;
    outline: none;
    & + button {
      margin-left: 8px;
    }
    &.active {
      opacity: 1.0;
    }
    &.selectable {
      cursor: pointer;
    }
  }
`;

interface PaginationProps {
  numItems: number,
  selectedIndex: number,
  onSelect?: (index: number) => void
};

const Pagination: React.FC<PaginationProps> = props => {

  const { numItems, selectedIndex, onSelect } = props;

  let indices = [];
  for (var i = 0; i < numItems; i++) {
    indices.push(i);
  }

  return (
    <PaginationNav>
      {indices.map((index) => { 
        return (
          <button
            key={`pagination-${index}`}
            className={classNames({
              active: index === selectedIndex,
              selectable: onSelect !== undefined
            })}
            onClick={() => onSelect && onSelect(index)}
          >
          </button>
        )
      })}
    </PaginationNav>
  )

}

export default Pagination;
