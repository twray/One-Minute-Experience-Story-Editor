import {
  Artwork,
  ArtworkDB,
  ArtworkThumbnail
} from '../model/Artwork';

class ArtworkService {

  async loadAllArtworks(): Promise<Artwork[]> {

    let artworks: Artwork[] = [];

    try {

      const response = await fetch(`https://modgift.itu.dk/1mev2/_/items/artwork?fields=*,image.*`);
      const result = await response.json();
      const { data } = result;

      artworks = data.map((artworkDB: ArtworkDB): Artwork => {

        const artworkThumbnail: ArtworkThumbnail|undefined = artworkDB.image.data.thumbnails.find((artworkThumbnail: ArtworkThumbnail) => {
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

};

export default ArtworkService;
