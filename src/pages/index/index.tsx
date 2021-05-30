import { GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';

import { Header } from '../../components/Header';
import { Card } from '../../components/Card';

import styles from './styles.module.scss';

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
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(props.movies[0]);

  // useEffect(() => {
  //   console.log('MOVIE => ', selectedMovie)
  // }, [selectedMovie]);

  function handlePages() {
    setPage(page + 1)

    const movie = props.movies[page]
    setSelectedMovie(movie)
  }

  return (
    <>
      <Header movie={selectedMovie} />
      <div className={styles.bodyContainer}>
        {props.movies.map(movie => {
          return (
            <Card movie={movie}/>
          )
        })}
      </div>
    </>  
  )
}

export const getStaticProps: GetStaticProps = async (page) => {
  const { data } = await api.get('movie/popular', {
    params: {
      api_key: process.env.apiKeyV3,
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
