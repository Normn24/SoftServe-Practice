export type Genre = {
  id: number;
  name: string;
};

export type TmdbDetails = {
  title: string;
  poster_path: string;
  overview: string;
  genres: Genre[];
  vote_average: number;
};

export type Seat = {
  seatNumber: number;
  isBooked: boolean;
  _id?: string;
};

export type Session = {
  sessionId?: number;
  _id?: string;
  dateTime: string;
  price: number;
  seats: Seat[];
};

export type Movie = {
  movieId: number;
  _id?: string;
  tmdbDetails: TmdbDetails;
  sessions: Session[];
};