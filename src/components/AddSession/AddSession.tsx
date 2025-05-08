import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addSessions } from '../../store/sessionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from "../../store/store";

export default function AddSession({ movieId }: { movieId: number }) {
  const dispatch = useDispatch<AppDispatch>();
  const formik = useFormik({
    initialValues: {
      date: '',
      time: '',
      ticketPrice: 0,
      countOfSeats: 0,
    },
    validationSchema: Yup.object({
      date: Yup.string().required('Date is required'),
      time: Yup.string().required('Time is required'),
      ticketPrice: Yup.number().min(1, 'Price must be greater than 0').required('Ticket price is required'),
      countOfSeats: Yup.number().min(1, 'Seats must be greater than 0').required('Count of seats is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      const seatsArray = Array.from({ length: values.countOfSeats }, (_, i) => i + 1);
      const session = {
        dateTime: `${values.date}T${values.time}`,
        price: values.ticketPrice,
        seats: seatsArray,
      };
      dispatch(addSessions({movieId, session}))
    },
  });

  return (
    <dialog id={`add_session_${movieId}`} className="modal">
      <div className="modal-box">
        <h1 className="text-black dark:text-white font-bold text-2xl text-start pb-4">Add new Session: </h1>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <div>
            <legend className="fieldset-legend">Choose date:</legend>
            <input
              type="date"
              name="date"
              className="input text-black w-full dark:text-white"
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.date && formik.errors.date ? (
              <div className="text-red-500">{formik.errors.date}</div>
            ) : null}
          </div>


          <div>
            <legend className="fieldset-legend">Choose time:</legend>
            <input
              type="time"
              name="time"
              className="input text-black w-full dark:text-white"
              value={formik.values.time}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.time && formik.errors.time ? (
              <div className="text-red-500">{formik.errors.time}</div>
            ) : null}
          </div>

          {/* Ticket Price Input */}
          <div>
            <legend className="fieldset-legend">Ticket price:</legend>
            <input
              type="number"
              name="ticketPrice"
              className="input text-black w-full dark:text-white"
              placeholder="Type here"
              value={formik.values.ticketPrice}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.ticketPrice && formik.errors.ticketPrice ? (
              <div className="text-red-500">{formik.errors.ticketPrice}</div>
            ) : null}
          </div>

          {/* Count of Seats Input */}
          <div>
            <legend className="fieldset-legend">Count of Seats:</legend>
            <input
              type="number"
              name="countOfSeats"
              className="input text-black w-full dark:text-white"
              placeholder="Type here"
              value={formik.values.countOfSeats}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.countOfSeats && formik.errors.countOfSeats ? (
              <div className="text-red-500">{formik.errors.countOfSeats}</div>
            ) : null}
          </div>

          {/* Buttons */}
          <div className="flex flex-row justify-end gap-2 pt-4">
            <button
              type="button"
              className="btn"
              onClick={() => {
                const dialog = document.getElementById(`add_session_${movieId}`) as HTMLDialogElement | null;
                if (dialog) dialog.close();
                console.log(movieId)
              }}
            >
              Close
            </button>
            <button type="submit" className="btn">
              Add
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}