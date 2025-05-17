export interface Movie {
  adult: boolean;
  backdrop_path: string;
  id: number;
  recommendations: TrailerInfo;
  original_language: string;
  original_title: string;
  popularity: number;
  title: string;
  vote_average: number;
  vote_count: number;
  genres: Genre[];
  origin_country: string[];
  overview: string;
  poster_path: string;
  production_companies: ProductionCompany[];
  release_date: string;
  runtime: number;
  spoken_languages: string[];
  videos: string;
  cast: Actor[];
}

export interface Actor {
  adult?: false;
  gender?: number;
  known_for_department?: string;
  name: string;
  original_name: string;
  popularity?: number;
  profile_path: string;
  character: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
}
export interface Genre {
  id: number;
  name: string;
}

export interface TrailerInfo {
  name: string;
  key: string;
}
