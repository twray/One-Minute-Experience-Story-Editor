export interface Artwork {
  id: number|'+';
  title: string;
  artist_name?: string;
  artist_nationality?: string;
  year?: string;
  image_url: string;
  story_segments: StorySegment[];
}

export interface ArtworkThumbnail {
  url: string;
  dimension: string;
}

export interface StorySegment {
  id: number;
  story_segment: string;
}

export interface StoryPrompt {
  id: number;
  prompt: string;
}
