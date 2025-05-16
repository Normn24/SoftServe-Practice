import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { updateSessions } from '../../store/sessionSlice';

type Seat = {
  seatNumber: number;
  isBooked: boolean;
}

type UpdateSessionProps = {
  movieId: number;
  _id: number;
  dateTime: string;
  ticketPrice: number;
  countOfSeats?: Seat[];
}

export default function UpdateSession({movieId, _id, dateTime, ticketPrice, countOfSeats}: UpdateSessionProps) {
  const dateObj = new Date(dateTime);
  const time = dateObj.toISOString().split('T')[1].slice(0, 5);
  const date = dateObj.toISOString().split('T')[0];
  const dispatch = useDispatch<AppDispatch>()


  console.log('Movie Id:', movieId);

  const [newDate, setNewDate] = useState(date)
  const [newTime, setNewTime] = useState(time)
  const [newTicketPrice, setNewTicketPrice] = useState(ticketPrice)
  const [newCountOfSeats, setNewCountOfSeats] = useState(countOfSeats?.length || 0)

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDate(e.target.value)
  }

  const handleChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTime(e.target.value)
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTicketPrice(Number(e.target.value))
  }

  const handleCountOfSeatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCountOfSeats(Number(e.target.value))
  }

  const handleSubmit = () => {
    const updatedSession = {
      dateTime: `${newDate}T${newTime}`,
      price: newTicketPrice,
      seats: Array.from({ length: newCountOfSeats }, (_, i) => ({
        seatNumber: i + 1,
        isBooked: false,
      }))
    }
    dispatch(updateSessions({ movieId: movieId, sessionId: _id, session: updatedSession }))
  }
  return (
    <dialog id={`add_session_${_id}`} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Edit Session</h3>
        <div className='mt-4'>
          <legend className="fieldset-legend">Choose date:</legend>
          <input
            type="date"
            name="date"
            className="input text-black w-full dark:text-white"
            defaultValue={date}
            value={newDate}
            onChange={handleChangeDate}
          />
        </div>

        <div>
          <legend className="fieldset-legend">Choose time:</legend>
          <input
            type="time"
            name="time"
            className="input text-black w-full dark:text-white"
            defaultValue={time}
            value={newTime}
            onChange={handleChangeTime}
          />
        </div>

        <div>
          <label className="fieldset-legend">Ticket price: </label>
          <input type="number"
            name="ticketPrice"
            className="input text-black w-full dark:text-white"
            placeholder="Type here" 
            defaultValue={ticketPrice}
            value={newTicketPrice}
            onChange={handlePriceChange}
          />
        </div>

        <div>
          <legend className="fieldset-legend">Count of Seats:</legend>
          <input
            type="number"
            name="countOfSeats"
            className="input text-black w-full dark:text-white"
            placeholder="Type here"
            defaultValue={countOfSeats?.length}
            value={newCountOfSeats}
            onChange={handleCountOfSeatsChange}
          />
        </div>


        <div className='flex justify-end gap-2 mt-4'>
          <button className="btn" onClick={() => handleSubmit()}>Save</button>
          <form method="dialog">
            <button className="btn">Close</button>
          </form>

        </div>
        
        
        
      </div>
    </dialog>
  )
}
