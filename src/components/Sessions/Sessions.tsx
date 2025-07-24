import Spinner from '../Spinner/Spinner';
import SessionCard from '../Card/SessionCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllMovies } from '../../store/allMovies';
import { AppDispatch, RootState } from '../../store/store';
import { StatusEnum } from '../../utils/EnumsFile';

export default function Sessions() {
  const movies = useSelector((state: RootState) => state.allMovies.allMovie)
  const status = useSelector((state: RootState) => state.allMovies.status)
  const dispatch = useDispatch<AppDispatch>()

  const handleLoadMovies = () => {
    dispatch(fetchAllMovies())
  }

  return (
    <div className='p-9'>
        <div className='flex justify-between'>
          <h1 className='text-3xl font-bold text-black dark:text-white'>Sessions</h1>
          <a className='btn bg-yellow-400 btn-md rounded-lg text-black' onClick={handleLoadMovies}>Load</a>
        </div>

         {status === StatusEnum.LOADING ? (
           <Spinner/>
         ) : movies.map((movie) => (          
            <SessionCard  key={movie.movieId} movieId={movie} reloadMovies={handleLoadMovies}/>
        ))}
    </div>
  )
}
