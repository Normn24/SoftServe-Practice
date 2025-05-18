import axios from 'axios';
import {  useEffect, useState} from 'react'
import Card from '../Card/Card';
import Spinner from '../Spinner/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllMovies } from '../../store/allMovies';
import { RootState, AppDispatch } from '../../store/store';
import { StatusEnum } from '../../utils/EnumsFile';

export default function Movies() {
  const movies = useSelector((state: RootState) => state.allMovies.allMovie)
  const status = useSelector((state: RootState) => state.allMovies.status)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchAllMovies())

  }, [])


  return (
    <div className='p-9 pt-30'>
      <div className='flex justify-between'>
        <h1 className='text-3xl font-bold text-black dark:text-white'>Movies List</h1>
      </div>
        

      {status === StatusEnum.LOADING ? (
        <Spinner/>      
      ) : (
        <div className='flex flex-wrap gap-5 justify-start mt-5'>
        {movies.map((movie) => (
          <Card key={movie.movieId} movie={movie} />
        ))}
        </div>
      )}
      
      
        
        
    </div>
  )
}
