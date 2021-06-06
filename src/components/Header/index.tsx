import Image from 'next/image';

import styles from './styles.module.scss';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.logoContent}>
        <h1>Promo<strong>MOVIES</strong></h1>
      </div>
    </header>
  )
}