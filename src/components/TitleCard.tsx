import React from 'react';
import { Card } from './Card';

interface TitleCardProps {};

interface TitleCardState {};

class TitleCard extends React.Component<
  TitleCardProps,
  TitleCardState
> {
  render() {
    return (
      <Card />
    )
  }
}

export default TitleCard;
