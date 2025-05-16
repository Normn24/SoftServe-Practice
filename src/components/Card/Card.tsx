import { Genre, Movie } from '../../types/movieType';
import AddSession from '../AddSession/AddSession';

type CardProps = {
  movie: Movie;
}

export default function Card({ movie }: CardProps) {
  return (
    <div className="card bg-base-100 image-full w-96 shadow-sm">
            <figure>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.tmdbDetails?.poster_path}`}
                alt={movie.tmdbDetails?.title || "Movie Poster"}
              />
            </figure>
            <div className="card-body flex justify-between">
              <div className='flex flex-col gap-4'>
                <h2 className="card-title text-yellow-400">{movie.tmdbDetails?.title || "No Title"}</h2>
                <p>{movie.tmdbDetails?.overview}</p>
                <div className='flex gap-1 justify-start items-start'>
                  {movie.tmdbDetails.genres.map((genre: Genre) => (
                    <h3 className='w-[70%]' key={genre.id}>• {genre?.name}</h3>
                    
                  ))}
                </div>
              </div>   
              <div className="card-actions justify-between items-center flex-row">
                <div className='flex flex-row items-center gap-2'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="yellow" className="size-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                  
                  <h1 className='font-extrabold text-xl text-yellow-300'>{movie.tmdbDetails?.vote_average.toFixed(1)}</h1>
                </div>
                <button onClick={() => {
                  const dialog = document.getElementById(`add_session_${movie.movieId}`) as HTMLDialogElement | null;
                  if (dialog) dialog.showModal();
                }} className="btn bg-yellow-400 dark:text-yellow-400 dark:bg-gray-900">Add new session</button>
              </div>
              <AddSession movieId={movie.movieId}/>
            </div>
    </div>
  )
}
