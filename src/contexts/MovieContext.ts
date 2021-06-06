import { createContext } from 'react';

interface IMovieContextData {
  allMovies: IMovies[];
  filterGenre?: IFilter[];
  page: number;
  handleAllMovies: (movies: IMovies[], page: number) => void;
  handleFilterGenre: (filters: IFilter[]) => void;
}

interface IMovies {
  id: number;
  genre_ids: number[];
  title: string;
  vote_average: number;
  poster_path: string;
  overview: string;
  adult: boolean;
  popularity: number;
}

interface IFilter {
  id: number;
  name: string;
  active: boolean;
}

export const MovieContext = createContext({} as IMovieContextData)