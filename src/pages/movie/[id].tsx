import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';

import { api } from '../../services/api';

import styles from './styles.module.scss';

export default function Movie({ movie }) {
  const router = useRouter();

  console.log(movie)
  return (
    <>
      <h1>{movie.original_title}</h1>
      <span>{JSON.stringify(movie)}</span>
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

  const { data } = await api.get(`movie/${id}`, {
    params: {
      api_key: process.env.apiKeyV3,
    }
  });

  return {
    props: {
      movie: data,
    },
    revalidate: 60 * 60 * 8,
  }
}