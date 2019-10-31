export interface ArtworkBase {
  id?: number;
  status: ArtworkStatus;
  title: string;
  artist_name: string;
  artist_nationality: string;
  year: string;
}

export interface Artwork extends ArtworkBase {
  image_url?: string;
  story_segments: StorySegment[];
}

export interface ArtworkDB extends ArtworkBase {
  story_segment_1: string;
  story_segment_2: string;
  story_segment_3: string;
  story_segment_4: string;
  story_segment_5: string;
  image?: ArtworkImageDB;
}

export interface ArtworkImageDB {
  id: number;
  filename: string;
  data: ArtworkImageDataDB;
}

export interface ArtworkImageDataDB {
  full_url: string;
  thumbnails: ArtworkThumbnail[];
}

export enum ArtworkStatus {
  New = 'new',
  Published = 'published',
  Draft = 'draft'
}

export interface ArtworkThumbnail {
  url: string;
  dimension: string;
}

export type UserUpdatableArtworkMetadata = 'title'|'year'|'artist_name'|'artist_nationality'|'image_url';

export interface StorySegment {
  id: number;
  story_segment: string;
}

export interface StoryPrompt {
  id: number;
  prompt: string;
  example: string;
}
