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

  private artworkDBToArtwork(artworkDB: ArtworkDB): Artwork {

    const artworkThumbnail: ArtworkThumbnail|undefined = artworkDB.image && artworkDB.image.data && artworkDB.image.data.thumbnails.find((artworkThumbnail: ArtworkThumbnail) => {
      return artworkThumbnail.dimension === "1024x1024";
    });

    const artworkThumbnailImageURL = artworkThumbnail ? artworkThumbnail.url : '';
    const artworkThumbnailImageURLWithAspectRatio = artworkThumbnail ? (artworkThumbnail.url && artworkThumbnail.url.replace('/crop/', '/contain/')) : '';

    return {
      id: artworkDB.id,
      status: artworkDB.status,
      title: artworkDB.title,
      artist_name: artworkDB.artist_name,
      artist_nationality: artworkDB.artist_nationality,
      year: artworkDB.year,
      image_url: artworkThumbnailImageURL,
      image_url_with_aspect_ratio: artworkThumbnailImageURLWithAspectRatio,
      story_segments: [
        {id: 1, story_segment: artworkDB.story_segment_1 || ''},
        {id: 2, story_segment: artworkDB.story_segment_2 || ''},
        {id: 3, story_segment: artworkDB.story_segment_3 || ''},
        {id: 4, story_segment: artworkDB.story_segment_4 || ''},
        {id: 5, story_segment: artworkDB.story_segment_5 || ''}
      ]
    }

  }

  private uploadImage(imageFile: File, imageFilename: string): Promise<number> {

    return new Promise<number>(async (resolve, reject) => {

      try {

        if (!AuthenticationService.token) {
          throw new Error('Unable to update the artwork due to the user not being logged in');
        }

        console.log('uploading image');

        const formBody = new FormData();
        formBody.append('filename', imageFilename);
        formBody.append('data', imageFile);

        let response, result;

        response = await fetch(`${this.API_ROOT}/files`, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + AuthenticationService.token
          },
          body: formBody
        });
        result = await response.json();
        const imageID: number = result && result.data && result.data.id;

        if (imageID == null) {
          throw new Error('A problem occurred while uploading the image');
        } else {
          resolve(imageID);
        }

      } catch (e) {

        console.error('Unable to upload image.');
        reject(e);

      }

    });

  }

  async loadAllArtworks(): Promise<Artwork[]> {

    return new Promise(async (resolve, reject) => {

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
        console.log(result);
        const artworks: Artwork[] = data.map((artworkDB: ArtworkDB): Artwork => this.artworkDBToArtwork(artworkDB));
        resolve(artworks);

      } catch (e) {

        console.error('Unable to load artworks.');
        reject(e);

      }

    });

  };

  async createArtwork(artwork: Artwork, imageFile: File, imageFilename: string): Promise<Artwork> {

    return new Promise<Artwork>(async (resolve, reject) => {

      if (artwork.status !== ArtworkStatus.New) {
        throw new Error('Cannot create artwork: artwork is not new');
      }

      console.log('creating artwork');

      try {

        if (!AuthenticationService.token) {
          throw new Error('Unable to update the artwork due to the user not being logged in');
        }

        const imageID = await this.uploadImage(imageFile, imageFilename);

        if (imageID) {

          const artworkDB: ArtworkDB = {
            status: ArtworkStatus.Published,
            title: artwork.title,
            year: artwork.year,
            artist_name: artwork.artist_name,
            artist_nationality: artwork.artist_nationality,
            story_segment_1: '',
            story_segment_2: '',
            story_segment_3: '',
            story_segment_4: '',
            story_segment_5: ''
          };

          const response = await fetch(`${this.API_ROOT}/items/${this.DB_TABLE}?fields=*,image.*`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + AuthenticationService.token
            },
            body: JSON.stringify({...artworkDB, image: imageID})
          });
          const result = await response.json();
          const { data } = result;
          resolve(this.artworkDBToArtwork(data));

        } else {

          reject(new Error('A problem occurred while uploading the image'));

        }

      } catch (e) {

        console.error('Unable to create artwork.');
        reject(e);

      }

    });

  }

  async updateArtwork(artwork: Artwork): Promise<Artwork> {

    return new Promise<Artwork>(async (resolve, reject) => {

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
            story_segment_5: artwork.story_segments[4].story_segment
          };

          const response = await fetch(`${this.API_ROOT}/items/${this.DB_TABLE}/${artwork.id}?fields=*,image.*`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + AuthenticationService.token
            },
            body: JSON.stringify(artworkDB)
          });
          const result = await response.json();
          const { data } = result;
          resolve(this.artworkDBToArtwork(data));

        } catch (e) {

          console.error('Unable to update artwork.');
          reject(e);

        }

      }, this.UPDATE_SERVICE_DEBOUNCE_TIME);

    })

  }

  async updateArtworkImage(artwork: Artwork, imageFile: File, imageFilename: string): Promise<Artwork> {

    return new Promise<Artwork>(async (resolve, reject) => {

      if (artwork.status === ArtworkStatus.New) {
        throw new Error('Cannot update artwork image: artwork does not exist');
      }

      console.log('updating artwork image');

      try {

        if (!AuthenticationService.token) {
          throw new Error('Unable to update the artwork due to the user not being logged in');
        }

        const imageID: number = await this.uploadImage(imageFile, imageFilename);

        const response = await fetch(`${this.API_ROOT}/items/${this.DB_TABLE}/${artwork.id}?fields=*,image.*`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.token
          },
          body: JSON.stringify({image: imageID})
        });
        const result = await response.json();
        const { data } = result;
        resolve(this.artworkDBToArtwork(data));

      } catch (e) {

        console.error('Unable to update artwork image.');
        reject(e);

      }

    });

  }

};

export default ArtworkService;
