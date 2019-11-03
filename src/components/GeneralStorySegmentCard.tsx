import React, { ChangeEvent } from 'react';

import styled from 'styled-components';
import classNames from 'classnames';

import { Card } from './Card';
import { StoryPrompt, StorySegment } from '../model/Artwork';

const Prompt = styled.div`
  flex: 2;
  padding: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StorySegmentSection = styled.div`
  flex: 5;
  position: relative;
`;

const StorySegmentSectionInput = styled.textarea`
  width: 100%;
  height: 100%;
  font-family: 'sf_compact_textmedium';
  font-size: 16px;
  line-height: 24px;
  border-top: 1px solid #DDDDDD;
  padding: 10%;
  box-sizing: border-box;
  border-left: none;
  border-right: none;
  border-bottom: none;
  outline: none;
  background: none;
  resize: none;
  &::placeholder {
    color: #AAAAAA;
  }
  &.readonly:disabled {
    opacity: 1;
    color: inherit;
  }
`;

const CharacterCounter = styled.span`
  position: absolute;
  bottom: 10%;
  right: 10%;
  color: #9A7049;
  font-size: 14px;
  line-height: 20px;
  &.warning {
    color: #E23760;
  }
`;

interface GeneralStorySegmentCardProps {
  prompt: StoryPrompt;
  storySegment: StorySegment;
  readOnly?: boolean;
  onStorySegmentChange: (storySegment: StorySegment) => void;
};

interface GeneralStorySegmentCardState {
  storySegmentSectionInputIsFocused: boolean;
}

const maxStorySegmentLength: number = 160;

class GeneralStorySegmentCard extends React.Component<
  GeneralStorySegmentCardProps,
  GeneralStorySegmentCardState
  > {

  state = {
    storySegmentSectionInputIsFocused: false
  }

  handleStorySegmentSectionInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const changedStorySegment: StorySegment = {
      id: this.props.storySegment.id,
      story_segment: e.target.value
    }
    this.props.onStorySegmentChange(changedStorySegment);
  }

  render() {

    const { prompt, storySegment, readOnly } = this.props;
    const { storySegmentSectionInputIsFocused } = this.state;
    const storySegmentLengthRemaining = maxStorySegmentLength - storySegment.story_segment.length;

    const classes = classNames(
      {'readonly': readOnly}
    );

    return (
      <Card>
        <Prompt>
          {prompt.prompt}
        </Prompt>
        <StorySegmentSection>
          <StorySegmentSectionInput className={classes}
            placeholder={!readOnly ? 'Write your story here ...' : ''}
            value={storySegment ? storySegment.story_segment : ''}
            onChange={this.handleStorySegmentSectionInputChange}
            maxLength={maxStorySegmentLength}
            onFocus={() => this.setState({storySegmentSectionInputIsFocused: true})}
            onBlur={() => this.setState({storySegmentSectionInputIsFocused: false})}
            tabIndex={-1}
            disabled={readOnly}
          >
          </StorySegmentSectionInput>
          {storySegmentSectionInputIsFocused &&
           storySegmentLengthRemaining < 40 &&
            <CharacterCounter className={storySegmentLengthRemaining === 0 ? 'warning': ''}>
              {maxStorySegmentLength - storySegment.story_segment.length} characters remaining
            </CharacterCounter>
          }
        </StorySegmentSection>
      </Card>
    )
  }

}

export default GeneralStorySegmentCard;
