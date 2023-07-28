export type APIResponse = {
  href: string;
  items: Item[];
  limit: number;
  next: string;
  offset: number;
  previous: unknown;
  total: number;
};

export type Tracks = {
  tracks: APIResponse;
};

export type Item = {
  album: Album;
  artists: Artist2[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls4;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url?: string;
  track_number: number;
  type: string;
  uri: string;
};

export type Album = {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  external_urls: ExternalUrls2;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
};

export type Artist = {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};

export type ExternalUrls = {
  spotify: string;
};

export type ExternalUrls2 = {
  spotify: string;
};

export type Image = {
  height: number;
  url: string;
  width: number;
};

export type Artist2 = {
  external_urls: ExternalUrls3;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};

export type ExternalUrls3 = {
  spotify: string;
};

export type ExternalIds = {
  isrc: string;
};

export type ExternalUrls4 = {
  spotify: string;
};

type Followers = {
  href: null;
  total: number;
};

type Owner = {
  display_name: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
};

export type Playlist = {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[]; // Update 'Image' type with correct properties.
  name: string;
  owner: Owner;
  primary_color: null;
  public: boolean;
  snapshot_id: string;
  tracks: Tracks;
  type: string;
  uri: string;
};
