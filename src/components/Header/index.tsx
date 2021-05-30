import Image from 'next/image';

import styles from './styles.module.scss';

export function Header(props) {


  return (
    <header
      className={styles.headerContainer}
      style={{backgroundImage: `url('${process.env.imageUrl}original/inJjDhCjfhh3RtrJWBmmDqeuSYC.jpg')`}}
    >
      <div className={styles.topContent}>
        <h1>Promo<strong>MOVIES</strong></h1>
        <p>en-US</p>
      </div>

      <div className={styles.infoContent}>
        <h2>{props.movie.title}</h2>
        <p>{props.movie.overview}</p>
        <a href="">more info</a>
      </div>
    </header>
  )
}