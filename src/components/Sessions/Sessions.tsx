import axios from 'axios';
import { useState } from 'react'
import Spinner from '../Spinner/Spinner';
import SessionCard from '../Card/SessionCard';

export default function Sessions() {
  const [movies, setMovies] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>()

  const handleLoadMovies = () => {
    setLoading(true);
    const apiUrl = 'https://soft-serve-practice-back.vercel.app/api/movies-in-cinema';
    axios.get(apiUrl)
    .then((res) => {
      console.log(res.data);
      setMovies(res.data);
      setLoading(false);
    })
  }
  return (
    <div className='p-9'>
        <div className='flex justify-between'>
          <h1 className='text-3xl font-bold'>Sessions</h1>
          <a className='btn bg-yellow-400 btn-md rounded-lg text-black' onClick={handleLoadMovies}>Load</a>
        </div>

         {loading === true ? (
           <Spinner/>
         ) : movies.map((movie) => (          
            <SessionCard movie={movie}/>
        ))}
        

        
    </div>
  )
}
