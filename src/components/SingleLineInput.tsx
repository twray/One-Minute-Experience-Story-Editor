import React, { ChangeEvent } from 'react';

import styled from 'styled-components';

const SingleLineInputContainer = styled.div`
  width: 100%;
  margin: 0 0 15px 0;
  position: relative;
  &.dark label {
    color: #FFFFFF;
  }
  &.dark input {
    color: #FFFFFF;
    border-bottom-color: #FFFFFF;
  }
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
  background: none;
  outline: none;
  &::placeholder {
    color: #AAAAAA;
  }
  &:focus {
    padding-bottom: 4px;
    border-bottom-color: #DBAD82;
    border-bottom-width: 2px;
    border-bottom-styled: solid;
  }
`;

interface SingleLineInputProps {
  label?: string;
  value?: string;
  placeholder?: string;
  style?:'normal'|'dark';
  isOptional?: boolean;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
};

interface SingleLineInputState {
  internalValue: string;
}

class SingleLineInput extends React.Component<
  SingleLineInputProps,
  SingleLineInputState
  > {

  state = {
    internalValue: ''
  }

  componentDidMount() {
    if (this.props.value) {
      this.setState({internalValue: this.props.value});
    }
  }

  handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    this.setState({internalValue: value});
    this.props.onChange && this.props.onChange(e);
  }

  render() {
    const { label, placeholder, isOptional, disabled, style } = this.props;
    const { internalValue } = this.state;
    return (
      <SingleLineInputContainer {...(style && {className: style})}>
        {label && <Label htmlFor={'label-' + label.toLowerCase()}>{label}</Label>}
        {isOptional && <OptionalLabel>Optional</OptionalLabel>}
        <Input
          {...(label && {id: 'label-' + label.toLowerCase()})}
          type="text"
          value={internalValue ? internalValue : ''}
          placeholder={placeholder ? placeholder : ''}
          disabled={disabled}
          onChange={this.handleOnChange}
        />
      </SingleLineInputContainer>
    )
  }
};

export default SingleLineInput;
