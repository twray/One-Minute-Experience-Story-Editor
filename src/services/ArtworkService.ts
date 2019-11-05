import {
  Artwork,
  ArtworkDB,
  ArtworkThumbnail,
  ArtworkStatus
} from '../model/Artwork';

import AuthenticationService, { AuthenticationError } from './AuthenticationService';

export class APIError extends Error {

  name: string = 'APIError';
  httpStatus?: number;

  constructor(httpStatus?: number) {
    super();
    this.httpStatus = httpStatus;
  }

}

class ArtworkService {

  API_ROOT: string = process.env.REACT_APP_SERVER_API_ROOT || '';
  DB_TABLE: string = process.env.REACT_APP_DB_TABLE || '';

  UPDATE_SERVICE_DEBOUNCE_TIME: number = 1000;

  throttler: number|undefined;

  private validateResponse(response: Response) {

    if (
      response.status === 401 || 
      response.status === 403
    ) {
      throw new AuthenticationError(response.status);
    } else if (
      response.status !== 201 &&
      response.status !== 204 &&
      response.status !== 200
    ) {
      throw new APIError(response.status);
    }

    return response;
  }

  private artworkDBToArtwork(artworkDB: ArtworkDB): Artwork {

    const artworkImage: ArtworkThumbnail|undefined = artworkDB.image
      && artworkDB.image.data
      && artworkDB.image.data.thumbnails.find((artworkImage: ArtworkThumbnail) => {
      return artworkImage.dimension === "1024x1024";
    });

    const artworkImageURL = artworkImage ? artworkImage.url : '';
    const artworkImageURLWithAspectRatio = artworkImage ? (artworkImage.url && artworkImage.url.replace('/crop/', '/contain/')) : '';

    const artworkThumbnail: ArtworkThumbnail|undefined = artworkDB.image
      && artworkDB.image.data
      && artworkDB.image.data.thumbnails.find((artworkImage: ArtworkThumbnail) => {
      return artworkImage.dimension === "200x200";
    });

    const artworkThumbnailURL = artworkThumbnail ? artworkThumbnail.url : '';

    return {
      id: artworkDB.id,
      status: artworkDB.status,
      title: artworkDB.title,
      artist_name: artworkDB.artist_name,
      artist_nationality: artworkDB.artist_nationality,
      year: artworkDB.year,
      image_url: artworkImageURL,
      image_with_aspect_ratio_url: artworkImageURLWithAspectRatio,
      image_thumbnail_url: artworkThumbnailURL,
      story_segments: [
        {id: 1, story_segment: artworkDB.story_segment_1 || ''},
        {id: 2, story_segment: artworkDB.story_segment_2 || ''},
        {id: 3, story_segment: artworkDB.story_segment_3 || ''},
        {id: 4, story_segment: artworkDB.story_segment_4 || ''},
        {id: 5, story_segment: artworkDB.story_segment_5 || ''}
      ],
      is_example: artworkDB.is_example,
      created_by_user_id: artworkDB.created_by && artworkDB.created_by.id,
      created_just_now: false
    }

  }

  private uploadImage(imageFile: File, imageFilename: string): Promise<number> {

    return new Promise<number>(async (resolve, reject) => {

      try {

        console.log('uploading image');

        const formBody = new FormData();
        formBody.append('filename', imageFilename);
        formBody.append('data', imageFile);
;
        const response = this.validateResponse(await fetch(`${this.API_ROOT}/files`, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + AuthenticationService.token
          },
          body: formBody
        }));

        const result = await response.json();
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

        let exampleArtworks: Artwork[] = [];
        let artworks: Artwork[] = [];

        const exampleArtworksResponse = this.validateResponse(await fetch(`${this.API_ROOT}/items/${this.DB_TABLE}?fields=*,image.*&sort=-created_on&filter[is_example]=1`, {
          headers: {
            'Authorization': 'Bearer ' + AuthenticationService.token
          }
        }));

        const exampleArtworksResult = await exampleArtworksResponse.json();
        exampleArtworks = exampleArtworksResult.data.map((artworkDB: ArtworkDB): Artwork => this.artworkDBToArtwork(artworkDB));

        if (AuthenticationService.loggedInUser) {

          const artworksResponse = this.validateResponse(await fetch(`${this.API_ROOT}/items/${this.DB_TABLE}?fields=*,image.*&sort=-created_on&filter[created_by]=${AuthenticationService.loggedInUser.id}&filter[is_example]=0`, {
            headers: {
              'Authorization': 'Bearer ' + AuthenticationService.token
            }
          }));
          const artworksResult = await artworksResponse.json();
          artworks = artworksResult.data.map((artworkDB: ArtworkDB): Artwork => this.artworkDBToArtwork(artworkDB));

        }

        resolve([...exampleArtworks, ...artworks]);

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
            story_segment_5: '',
            is_example: artwork.is_example
          };

          const response = this.validateResponse(await fetch(`${this.API_ROOT}/items/${this.DB_TABLE}?fields=*,image.*`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + AuthenticationService.token
            },
            body: JSON.stringify({...artworkDB, image: imageID})
          }));
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
            is_example: artwork.is_example
          };

          const response = this.validateResponse(await fetch(`${this.API_ROOT}/items/${this.DB_TABLE}/${artwork.id}?fields=*,image.*`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + AuthenticationService.token
            },
            body: JSON.stringify(artworkDB)
          }));

          if (response.status === 204) {
            resolve();
          } else {
            const result = await response.json();
            const { data } = result;
            resolve(this.artworkDBToArtwork(data));
          }

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

        const imageID: number = await this.uploadImage(imageFile, imageFilename);

        const response = this.validateResponse(await fetch(`${this.API_ROOT}/items/${this.DB_TABLE}/${artwork.id}?fields=*,image.*`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.token
          },
          body: JSON.stringify({image: imageID})
        }));
        const result = await response.json();
        const { data } = result;
        resolve(this.artworkDBToArtwork(data));

      } catch (e) {

        console.error('Unable to update artwork image.');
        reject(e);

      }

    });

  }

  async deleteArtwork(artwork: Artwork): Promise<Artwork> {

    return new Promise<Artwork>(async (resolve, reject) => {

      try {

        if (artwork.status === ArtworkStatus.New) {
          throw new Error('Cannot delete artwork: artwork does not exist');
        }

        artwork.status = ArtworkStatus.Deleted;
        await this.updateArtwork(artwork);
        resolve();

      } catch (e) {

        console.error('Unable to delete artwork.');
        reject(e);

      }

    });

  }

};

export default ArtworkService;
