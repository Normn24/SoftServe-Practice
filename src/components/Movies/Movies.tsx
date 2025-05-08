import axios from 'axios';
import {  useEffect, useState } from 'react'
import Card from '../Card/Card';
import Spinner from '../Spinner/Spinner';

export default function Movies() {
  const [movies, setMovies] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>()

  useEffect(() => {
    setLoading(true);
    const apiUrl = 'https://soft-serve-practice-back.vercel.app/api/movies-in-cinema';
    axios.get(apiUrl)
    .then((res) => {
      console.log(res.data);
      setMovies(res.data);
      setLoading(false);
    })
  }, [])


  return (
    <div className='p-9'>
      <div className='flex justify-between'>
        <h1 className='text-3xl font-bold'>Movies List</h1>
      </div>
        

      {loading === true ? (
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
