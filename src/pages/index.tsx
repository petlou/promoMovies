import { GetStaticProps } from 'next';
import { api } from '../services/api';

interface IProps {
  page: number;
  movies: IMovies[];
}
interface IMovies {
  id: number;
  genre_ids: number[];
  title: string;
  vote_average: number;
  poster_path: string;
  overview: string;
  adult: boolean;
}

export default function Home(props: IProps) {
  return (
    <>
      <h1>Hello Peter!</h1>
      {/* <img width="1200" src={`${process.env.IMAGE_URL}original/${props.movies.results[0].backdrop_path}`} alt="" /> */}
      <p>{JSON.stringify(props.movies)}</p>
    </>  
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('movie/popular', {
    params: {
      api_key: process.env.API_KEY_V3,
      language: 'en-US',
      page: 1
    }
  });

  return {
    props: {
      page: data.page,
      movies: data.results,
    },
    revalidate: 60 * 60 * 8,
  }
}
