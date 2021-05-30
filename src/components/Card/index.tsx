import styles from './styles.module.scss';

export function Card(props) {
  return (
    <div
      className={styles.cardContainer}
      style={{backgroundImage: `url('${process.env.imageUrl}w500/${props.movie.poster_path}')`}}
    >
      <span>{props.movie.vote_average}</span>
      {/* <div>
        <h3>{props.movie.title}</h3>
      </div> */}
    </div>
  )
}