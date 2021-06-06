import { useState } from 'react';

import { MovieContext } from '../contexts/MovieContext';

import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

import '../styles/global.scss'
import styles from '../styles/app.module.scss';

function MyApp({ Component, pageProps }) {
  const [allMovies, setAllMovies] = useState([]);
  const [filterGenre, setFilterGenre] = useState([]);
  const [page, setPage] = useState(1);

  function handleAllMovies(movies, page) {
    setAllMovies(movies);
    setPage(page);
  }

  function handleFilterGenre(filters) {
    setFilterGenre(filters);
  }

  return (
    <MovieContext.Provider 
      value={{
        allMovies,
        filterGenre,
        page,
        handleAllMovies,
        handleFilterGenre
      }}
    >
      <div className={styles.pageContent}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>
    </MovieContext.Provider>
  )
}

export default MyApp
