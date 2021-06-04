import { GetStaticProps } from 'next';
import { useState } from 'react';
import ReactLoading from 'react-loading';

import { api } from '../services/api';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Footer } from '../components/Footer';
import InfiniteScroll from '../utils/infiniteScroll';

import styles from '../styles/index.module.scss';

interface IProps {
  page: number;
  total_pages: number;
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
  const [language, setLanguage] = useState('en-US');
  const [loading, setLoading] = useState(false);
  const [endScroll, setEndScroll] = useState(false);
  const [movies, setMovies] = useState<IMovies[]>(props.movies);

  async function getMore() {
    if (page === props.total_pages) {
      setEndScroll(true);
      return;
    };

    setLoading(true);
    const nextPage = page + 1;

    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      const { data } = await api.get('movie/popular', {
        headers: { Authorization: `Bearer ${process.env.apiKeyV4}` },
        params: {
          // api_key: process.env.apiKeyV3,
          language,
          page: nextPage
        }
      });

      const newList = data.results;
      const oldList = movies;

      newList.forEach((element: IMovies) => {
        oldList.push(element)
      });

      setMovies(oldList);
      setPage(nextPage);  

    } catch (error) {
      console.log('ERROR: ', error.message);
    }

    setLoading(false)
  }

  return (
    <>
      <Header />
      
      <div className={styles.cardContainer}>
        <div className={styles.bodyContainer} id="CardContainer">
          {movies.map(movie => {
            return (
              <Card key={movie.id} movie={movie}/>
            )
          })}
          {movies && !loading && !endScroll ? <InfiniteScroll getMore={getMore}/> : ''}
        </div>
        {loading && <ReactLoading className={styles.loading} type={"spinningBubbles"} color={"#9F75FF"} height={'3rem'} width={'3rem'} />}
      </div>
      
      <Footer />
    </>  
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('movie/popular', {
    headers: { Authorization: `Bearer ${process.env.apiKeyV4}` },
    params: {
      // api_key: process.env.apiKeyV3,
      language: 'en-US',
      page: 1
    }
  });

  return {
    props: {
      page: data.page,
      movies: data.results,
      total_pages: data.total_pages
    },
    revalidate: 60 * 60 * 8,
  }
}
