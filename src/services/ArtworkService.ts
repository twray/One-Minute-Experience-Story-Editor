import {
  Artwork,
  ArtworkDB,
  ArtworkThumbnail,
  ArtworkStatus
} from '../model/Artwork';

import AuthenticationService from './AuthenticationService';

class ArtworkService {

  API_ROOT: string = process.env.REACT_APP_SERVER_API_ROOT || '';
  DB_TABLE: string = process.env.REACT_APP_DB_TABLE || '';

  UPDATE_SERVICE_DEBOUNCE_TIME: number = 1000;

  throttler: number|undefined;

  async loadAllArtworks(): Promise<Artwork[]> {

    let artworks: Artwork[] = [];

    try {

      if (!AuthenticationService.token) {
        throw new Error('Unable to load artworks due to the user not being logged in');
      }

      const response = await fetch(`${this.API_ROOT}/items/${this.DB_TABLE}?fields=*,image.*`, {
        headers: {
          'Authorization': 'Bearer ' + AuthenticationService.token
        }
      });
      const result = await response.json();
      const { data } = result;

      artworks = data.map((artworkDB: ArtworkDB): Artwork => {

        const artworkThumbnail: ArtworkThumbnail|undefined = artworkDB.image && artworkDB.image.data.thumbnails.find((artworkThumbnail: ArtworkThumbnail) => {
          return artworkThumbnail.dimension === "1024x1024";
        });
        const artworkThumbnailImageURL = artworkThumbnail ? artworkThumbnail.url : '';

        return {
          id: artworkDB.id,
          status: artworkDB.status,
          title: artworkDB.title,
          artist_name: artworkDB.artist_name,
          artist_nationality: artworkDB.artist_nationality,
          year: artworkDB.year,
          image_url: artworkThumbnailImageURL,
          story_segments: [
            {id: 1, story_segment: artworkDB.story_segment_1},
            {id: 2, story_segment: artworkDB.story_segment_2},
            {id: 3, story_segment: artworkDB.story_segment_3},
            {id: 4, story_segment: artworkDB.story_segment_4},
            {id: 5, story_segment: artworkDB.story_segment_5}
          ]
        }

      });

    } catch (e) {

      console.error('Unable to load artworks.');
      throw(e);

    }

    return artworks;

  };

  async updateArtwork(artwork: Artwork) {

    if (artwork.status === ArtworkStatus.New) {
      throw new Error('Cannot update artwork: artwork does not exist');
    }

    clearTimeout(this.throttler);
    this.throttler = setTimeout(async () => {

      console.log('updating artwork');

      try {

        if (!AuthenticationService.token) {
          throw new Error('Unable to update the artwork due to the user not being logged in');
        }

        const artworkDB: ArtworkDB = {
          status: artwork.status,
          title: artwork.title,
          year: artwork.year,
          artist_name: artwork.artist_name,
          artist_nationality: artwork.artist_nationality,
          story_segment_1: artwork.story_segments[0].story_segment,
          story_segment_2: artwork.story_segments[1].story_segment,
          story_segment_3: artwork.story_segments[2].story_segment,
          story_segment_4: artwork.story_segments[3].story_segment,
          story_segment_5: artwork.story_segments[4].story_segment,
        };

        await fetch(`${this.API_ROOT}/items/${this.DB_TABLE}/${artwork.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.token
          },
          body: JSON.stringify(artworkDB)
        });

        // TODO: Possibly propogate synchronised DB result back to view model?

      } catch (e) {

        console.error('Unable to update artwork.');
        throw(e);

      }

    }, this.UPDATE_SERVICE_DEBOUNCE_TIME);

  }

};

export default ArtworkService;
