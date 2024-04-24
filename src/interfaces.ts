export interface Artist {
  external_urls: {
    spotify: string;
  };

  followers: {
    total: number;
  };

  genres: string[];
  href: string;
  id: string;

  images: {
    url: string;
    height: number;
    width: number;
  }[];

  name: string;
  popularity: number;
}

export interface Album {
  album_type: string;
  total_tracks: number;

  external_urls: {
    spotify: string;
  };

  href: string;
  id: string;

  images: {
    url: string;
    height: number;
    width: number;
  }[];

  name: string;
  release_date: string;
}

export interface Track {
  external_urls: {
    spotify: string;
  };

  href: string;
  id: string;

  images: {
    url: string;
    height: number;
    width: number;
  }[];

  name: string;
  popularity: number;
  release_date: string;
}
