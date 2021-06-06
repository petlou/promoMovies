import { GetStaticProps, GetStaticPaths } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { api } from '../../services/api';

import styles from './styles.module.scss';

interface IProps {
  movie: IMovie;
}
interface IMovie {
  adult: boolean;
  backdrop_path: string;
  genres: IGenre[];
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

interface IGenre {
  id: number;
  name: string;
}

export default function Movie(props: IProps) {
  const router = useRouter();
  const [movie, setMovie] = useState(props.movie)

  return (
    <>
      <div className={styles.bodyContainer}>
        <div className={styles.imageBackground} style={{backgroundImage: `url('${process.env.imageUrl}original/${movie.backdrop_path}')`}}/>
        <div className={styles.content}>
          <div className={styles.posterContent} style={{backgroundImage: `url('${process.env.imageUrl}w500/${movie.poster_path}')`}}/>
          <div className={styles.firstLine}>
            <h1>{movie.title}</h1>
            <p>{movie.adult ? '(adult)' : ''}</p>
            <Link href={'/'}>
              <button>Back</button>
            </Link>
          </div>
          <div className={styles.secondLine}>
            <h3>{movie.original_title}</h3>
            <p>{movie.release_date}</p>
          </div>
          
          <div className={styles.genresContent}>
            {movie.genres.map(genre => {
              return (
                <span key={genre.id}>{genre.name}</span>
              )
            })}
          </div>
          <p>{movie.overview}</p>
        </div>
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