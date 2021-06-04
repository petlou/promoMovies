import { useEffect, useState } from "react";
import Link from 'next/link'

import styles from './styles.module.scss';

interface IProps {
  movie: IMovie;
}
interface IMovie {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string;
  adult: boolean;
}

export function Card(props: IProps) {
  const [movie, setMovie] = useState(props.movie)

  useEffect(() => {
    if (movie.title.length >= 20) {
      let title = movie.title.substr(0, 20).concat('...');

      setMovie({
        ...movie,
        title
      })
    }
  }, [])

  return (
    <div className={styles.cardContainer}>
      <Link href={`/movie/${movie.id}`}>
        <a href="">
          <div className={styles.posterMovie} style={{backgroundImage: `url('${process.env.imageUrl}w500/${movie.poster_path}')`}}>
            <span>{movie.vote_average}</span>
          </div>

          <h3>{movie.title}</h3>
        </a>
      </Link>
    </div>
  )
}