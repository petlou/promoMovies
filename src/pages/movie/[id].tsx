import { GetStaticProps, GetStaticPaths } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';

import { api } from '../../services/api';

import styles from './styles.module.scss';

interface IProps {
  movie: IMovie;
}
interface IMovie {
  adult: boolean;
  backdrop_path: string;
  genres: string[];
  homepage: string;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  status: string;
  tagline: string;
  title: string;
  vote_average: number;
  vote_count: number;
}

export default function Movie(props: IProps) {
  const router = useRouter();
  const [movie, setMovie] = useState(props.movie)

  function goBack() {
    router.push('/')
  }
  return (
    <>
      <div className={styles.bodyContainer} style={{backgroundImage: `url('${process.env.imageUrl}original/${movie.backdrop_path}')`}}>
        <h1>{movie.original_title}</h1>
        <span>{JSON.stringify(movie)}</span>
        <button onClick={goBack}>Back</button>
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { id } = ctx.params

  const { data: movieDatail } = await api.get(`movie/${id}`, {
    headers: { Authorization: `Bearer ${process.env.apiKeyV4}` },
  });

  return {
    props: {
      movie: movieDatail,
    },
    revalidate: 60 * 60 * 8,
  }
}