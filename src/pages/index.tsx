import { GetStaticProps } from 'next';
import { useContext, useEffect, useState } from 'react';
import ReactLoading from 'react-loading';

import { api } from '../services/api';
import InfiniteScroll from '../utils/infiniteScroll';
import { MovieContext } from '../contexts/MovieContext';

import { Card } from '../components/Card';

import styles from '../styles/index.module.scss';

interface IProps {
  page: number;
  total_pages: number;
  movies: IMovies[];
  filter: IFilter[];
}
interface IMovies {
  id: number;
  genre_ids: number[];
  title: string;
  vote_average: number;
  poster_path: string;
  overview: string;
  adult: boolean;
  popularity: number;
}

interface IFilter {
  id: number;
  name: string;
  active: boolean;
}

export default function Home(props: IProps) {
  const {
    allMovies,
    filterGenre,
    handleAllMovies,
    handleFilterGenre
  } = useContext(MovieContext);

  const [page, setPage] = useState(1);
  const [language, setLanguage] = useState('en-US');
  const [loading, setLoading] = useState(false);
  const [endScroll, setEndScroll] = useState(false);
  const [movies, setMovies] = useState<IMovies[]>(props.movies);
  
  useEffect(() => {
    setLoading(true);
    filterGenre.length <= 0 && handleFilterGenre(props.filter);
    setShowMovies();
    setLoading(false);
  }, [])

  async function getMore() {
    if (page === props.total_pages) {
      setEndScroll(true);
      return;
    };

    setLoading(true);
    const nextPage = page + 1;

    // await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      const { data } = await api.get('movie/popular', {
        headers: { Authorization: `Bearer ${process.env.apiKeyV4}` },
        params: {
          // api_key: process.env.apiKeyV3,
          language,
          page: nextPage
        }
      });
      
      const newList: IMovies[] = data.results;
      const oldList: IMovies[] = allMovies.length > 0 ? allMovies : movies;

      newList.forEach((element: IMovies) => {
        oldList.push(element);
      });

      handleAllMovies(oldList);
      setPage(nextPage);

      setShowMovies();

    } catch (error) {
      console.log('ERROR: ', error.message);
    }

    setLoading(false)
  }

  async function handleFilter(id: number) {
    setLoading(true);
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const activeFilter = filterGenre.map(el => {
      if(el.id === id) {
        el.active = el.active ? false : true
      }

      return el;
    });

    handleFilterGenre(activeFilter);

    setShowMovies();

    setLoading(false);
  }

  function removeFilter() {
    setLoading(true);
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const activeFilter = filterGenre.map(el => {
      if (el.active) {
        el.active = false;
      }

      return el;
    });

    handleFilterGenre(activeFilter);

    setShowMovies();

    setLoading(false);
  }

  function setShowMovies() {
    const activeFilters = filterGenre.filter(el => el.active);
    let listMovies: IMovies[] = [];

    if (activeFilters.length > 0) {
      for (const filter of activeFilters) {
        const arrayMovieFilter = allMovies.filter(movie => movie.genre_ids.find(el => el === filter.id));

        arrayMovieFilter.forEach(el => {
          if (listMovies.length === 0 || !listMovies.find(movie => movie.id === el.id)) {
            listMovies.push(el);
          }
        });
      }

      listMovies.sort(function(a, b) {
        if (a.popularity > b.popularity) {
          return -1;
        }
        if (a.popularity < b.popularity) {
          return 1;
        }

        return 0;
      });
    } else {
      listMovies = allMovies;
    }

    setMovies(listMovies);
  }

  return (
    <>
      <div className={styles.cardContainer}>
        <div className={styles.filterContainer}>
          {filterGenre.map(filter => {
            return (
              <button
                key={filter.id}
                className={filter.active ? styles.active : ''}
                onClick={() => handleFilter(filter.id)}
              >
                {filter.name}
              </button>
            )
          })}
          <button className={styles.clearFilter} onClick={removeFilter}>Clear All</button>
        </div>
        <div className={styles.bodyContainer} id="CardContainer">
          {movies.map(movie => {
            return (
              <Card key={movie.id} movie={movie}/>
            )
          })}
          {movies && !loading && !endScroll ? <InfiniteScroll getMore={getMore}/> : <div />}
        </div>
        {loading && <ReactLoading className={styles.loading} type={"spinningBubbles"} color={"#9F75FF"} height={'3rem'} width={'3rem'} />}
      </div>
    </>  
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data: movieData } = await api.get('movie/popular', {
    headers: { Authorization: `Bearer ${process.env.apiKeyV4}` },
    params: {
      // api_key: process.env.apiKeyV3,
      language: 'en-US',
      page: 1
    }
  });

  const { data: genreData } = await api.get('genre/movie/list', {
    headers: { Authorization: `Bearer ${process.env.apiKeyV4}` },
    params: {
      // api_key: process.env.apiKeyV3,
      language: 'en-US',
      page: 1
    }
  });

  return {
    props: {
      page: movieData.page,
      total_pages: movieData.total_pages,
      movies: movieData.results,
      filter: genreData.genres,
    },
    revalidate: 60 * 60 * 8,
  }
}
