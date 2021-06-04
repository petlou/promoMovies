import Image from 'next/image';

import styles from './styles.module.scss';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.topContent}>
        <h1>Promo<strong>MOVIES</strong></h1>
        <p>en-US</p>
      </div>
    </header>
  )
}