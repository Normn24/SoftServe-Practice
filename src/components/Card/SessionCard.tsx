import { useDispatch} from "react-redux";
import { AppDispatch } from "../../store/store";
import { removeSessions } from "../../store/sessionSlice";
import UpdateSession from "../UpdateSession/UpdateSession";

type SessionCardProps = {
  movieId: any;
  reloadMovies: () => void;
}

export default function SessionCard({  movieId }: SessionCardProps) {
  const dispatch = useDispatch<AppDispatch>();

  const handleDeleteSessinon = async (sessionId: number) => {
    try {
      const movieInId = movieId.movieId;
      await dispatch(removeSessions({ movieId: movieInId, sessionId: sessionId }))
    } catch (error) {
      alert(`Error deleting session: ${error}`);
    }
  }

  return (
    <div className="flex flex-col gap-5 mt-5">
      <h1 className="text-2xl font-bold mt-10">{movieId.tmdbDetails?.title}</h1>
      <div className="flex flex-wrap justify-start gap-5">
       {movieId.sessions.map((session: any) => (
        <div key={session.sessionId} className="card bg-base-100 image-full w-96 shadow-sm">
          <figure>
            <img
              src={`https://image.tmdb.org/t/p/w500${movieId.tmdbDetails?.poster_path}`}
              alt={movieId.tmdbDetails?.title || 'Movie Poster'}
            />
          </figure>
          <div className="card-body flex justify-between">
            <div className="flex flex-col gap-4">
              <h2 className="card-title text-yellow-400">{movieId.tmdbDetails?.title || 'No Title'}</h2>
              <div>
                <p>{new Date(session.dateTime).toLocaleDateString()}</p>
                <p>{new Date(session.dateTime).toLocaleTimeString()}</p>
              </div>
              <h2 className="card-title text-yellow-400">Seats:</h2>
              <div className="flex flex-wrap gap-2">
                {session.seats.map((seat: any) => (
                  <div
                    key={seat.seatNumber}
                    className={`p-2 rounded-lg ${seat.isBooked ? 'bg-green-700' : 'bg-red-700'}`}
                  >
                    <h1>{seat.seatNumber}</h1>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-actions justify-end">
              <a className="btn bg-red-600 border-none" onClick={() => handleDeleteSessinon(session._id)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </a>
              <a className="btn bg-blue-500 border-none" onClick={() => {
                const modal = document.getElementById(`add_session_${session._id}`) as HTMLDialogElement | null;
                if (modal) modal.showModal();
                console.log(session);
              }} >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="white"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              </a>
            </div>
          </div>
          <UpdateSession movieId={movieId.movieId} _id={session._id} dateTime={session.dateTime} ticketPrice={session.price} countOfSeats={session.seats}/>
        </div>
      ))}
      </div>
    </div>
  );
}