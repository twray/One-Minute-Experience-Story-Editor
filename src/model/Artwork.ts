export interface ArtworkBase {
  id?: number;
  status: ArtworkStatus;
  title: string;
  artist_name: string;
  artist_nationality: string;
  year: string;
  is_example: boolean;
}

export interface Artwork extends ArtworkBase {
  image_url?: string;
  image_with_aspect_ratio_url?: string;
  image_thumbnail_url?: string;
  story_segments: StorySegment[];
  created_by_user_id?: number;
  created_just_now: boolean;
  first_time_writing_story: boolean;
}

export interface ArtworkDB extends ArtworkBase {
  story_segment_1: string;
  story_segment_2: string;
  story_segment_3: string;
  story_segment_4: string;
  story_segment_5: string;
  image?: ArtworkImageDB;
  created_by?: ArtworkCreatedByDB
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

export interface ArtworkCreatedByDB {
  id: number;
}

export enum ArtworkStatus {
  New = 'new',
  Published = 'published',
  Draft = 'draft',
  Deleted = 'deleted'
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
}
