import React, { ChangeEvent } from 'react';

import styled from 'styled-components';

const SingleLineInputContainer = styled.div`
  width: 100%;
  margin: 0 0 15px 0;
  position: relative;
`;

const Label = styled.label`
  font-size: 14px;
  line-height: 28px;
  color: #666666;
`;

const OptionalLabel = styled(Label)`
  position: absolute;
  top: 1px;
  right: 0;
  color: #999999;
  font-size: 12px;
  line-height: 28px;
`;

const Input = styled.input`
  display: block;
  width: 100%;
  border-top: none;
  border-right: none;
  border-bottom: 1px solid #CCCCCC;
  border-left: none;
  padding: 0 0 5px 0;
  font-family: 'sf_compact_textmedium';
  font-size: 16px;
  line-height: 24px;
  outline: none;
  &::placeholder {
    color: #AAAAAA;
  }
  &:focus {
    padding-bottom: 4px;
    border-bottom: 2px solid #DBAD82;
  }
`;

interface SingleLineInputProps {
  label?: string;
  value?: string;
  placeholder?: string;
  isOptional?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
};

const SingleLineInput: React.FC<SingleLineInputProps> = props => {
  const { label, value, placeholder, isOptional, onChange } = props;
  return (
    <SingleLineInputContainer>
      {label && <Label htmlFor={'label-' + label.toLowerCase()}>{label}</Label>}
      {isOptional && <OptionalLabel>Optional</OptionalLabel>}
      <Input
        {...(label && {id: 'label-' + label.toLowerCase()})}
        type="text"
        value={value ? value : ''}
        placeholder={placeholder ? placeholder : ''}
        {...(onChange && {onChange: props.onChange})}
      />
    </SingleLineInputContainer>
  )
};

export default SingleLineInput;
