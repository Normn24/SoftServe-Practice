import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import { bookSingleSeat, resetBookingState } from "../store/bookingSlice";
import { StatusEnum } from "../utils/EnumsFile";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Loader from "../components/Loader";
import { FaArrowLeft } from "react-icons/fa";
import valid from "card-validator";

interface PaymentLocationState {
  selectedSeatDetails: { _id: string; seatNumber: number }[];
  totalPrice: number;
  movieTitle?: string;
  moviePoster?: string;
  sessionTime?: string;
  sessionDate?: string;
}

const PaymentSchema = Yup.object().shape({
  cardNumber: Yup.string()
    .test(
      "test-number",
      "Credit Card number is invalid",
      (value) => valid.number(value).isValid
    )
    .required("The card number is required"),
  expiryDate: Yup.string()
    .matches(
      /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
      "MM/YY format, for example 05/28"
    )
    .required("Expiration date is required"),
  cvv: Yup.string()
    .matches(/^[0-9]{3,4}$/, "CVV must consist of 3 or 4 digits")
    .required("CVV is required"),
});

const PaymentPage: React.FC = () => {
  const { movieId, sessionId } = useParams<{
    movieId: string;
    sessionId: string;
  }>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {
    selectedSeatDetails,
    totalPrice,
    movieTitle,
    moviePoster,
    sessionTime,
    sessionDate,
  } = (location.state || {}) as PaymentLocationState;

  const { bookingStatus } = useSelector((state: RootState) => state.booking);
  const [isBookingAttempted, setIsBookingAttempted] = useState(false);

  useEffect(() => {
    dispatch(resetBookingState());
  }, [dispatch]);

  const handleSubmitPayment = async () => {
    if (
      !movieId ||
      !sessionId ||
      !selectedSeatDetails ||
      selectedSeatDetails.length === 0
    ) {
      console.error("Missing data for booking");
      return;
    }
    setIsBookingAttempted(true);
    dispatch(resetBookingState());

    try {
      const bookingPromises = selectedSeatDetails.map((seat) =>
        dispatch(
          bookSingleSeat({
            movieId,
            sessionId,
            seatNumber: seat.seatNumber,
          })
        ).unwrap()
      );
      const results = await Promise.allSettled(bookingPromises);
      const successfulBookings = results.filter(
        (r) => r.status === "fulfilled"
      );
      if (successfulBookings.length === selectedSeatDetails.length) {
        alert("Квитки успішно придбані!");
        navigate("/");
      }
    } catch (e) {
      console.error("General error during booking process:", e);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const posterBaseUrl = "https://image.tmdb.org/t/p/original";
  if (!selectedSeatDetails || selectedSeatDetails.length === 0) {
    return (
      <div className="mt-28 p-4 text-white max-w-lg m-auto text-center">
        <h1 className="text-2xl font-semibold mb-4">Помилка</h1>
        <p className="text-gray-400 mb-4">
          No seats have been selected for booking or session data is
          missing.Checkout
        </p>
        <button
          onClick={() => navigate(`/movies/${movieId}/sessions/${sessionId}`)}
          className="bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded hover:bg-yellow-600"
        >
          Back to seat selection
        </button>
      </div>
    );
  }

  return (
    <div className="mt-28 p-4 text-white max-w-[1200px] m-auto min-h-[calc(100vh-130px)] flex flex-col">
      <div className="flex items-center mb-6">
        <button
          onClick={handleGoBack}
          className="mr-4 text-white transition duration-200 w-12 h-12  rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-semibold mb-2 text-center">
          Payment for tickets
        </h1>
      </div>
      <div className="flex gap-10 flex-col max-w-[600px] m-auto mt-0 mb-0">
        <div className="flex flex-col">
          <div className="flex items-end">
            <img
              src={
                moviePoster
                  ? `${posterBaseUrl}${moviePoster}`
                  : "https://via.placeholder.com/40x60.png?text=N/A"
              }
              alt={movieTitle}
              className="w-28 h-42 object-cover rounded-sm mr-4 flex-shrink-0 bg-gray-700"
            />
            <div className="flex flex-col text-gray-400 text-md w-full">
              <h3 className="text-white text-5xl font-medium truncate leading-tight">
                {movieTitle}
              </h3>
              <hr className="mt-4 mb-4" />
              <p>
                {sessionDate} • {sessionTime}
              </p>
              <hr className="mt-4 mb-4" />
              <p>
                Number of tickets:{" "}
                <span className="font-bold text-white">
                  {selectedSeatDetails.length}
                </span>{" "}
                • Amount:{" "}
                <span className="font-bold text-white">{totalPrice}₴</span>
              </p>
            </div>
          </div>
        </div>

        <Formik
          initialValues={{
            cardNumber: "",
            expiryDate: "",
            cvv: "",
          }}
          validationSchema={PaymentSchema}
          onSubmit={handleSubmitPayment}
        >
          {({ dirty, isValid }) => (
            <Form className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-xl">
              <div>
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Card number
                </label>
                <Field
                  type="text"
                  name="cardNumber"
                  id="cardNumber"
                  placeholder="0000 0000 0000 0000"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-3 focus:ring-yellow-500 focus:border-yellow-500"
                />
                <ErrorMessage
                  name="cardNumber"
                  component="div"
                  className="text-red-400 text-xs mt-1"
                />
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor="expiryDate"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Expiration date
                  </label>
                  <Field
                    type="text"
                    name="expiryDate"
                    id="expiryDate"
                    placeholder="ММ/РР"
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-3 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                  <ErrorMessage
                    name="expiryDate"
                    component="div"
                    className="text-red-400 text-xs mt-1"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="cvv"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    CVV2
                  </label>
                  <Field
                    type="text"
                    name="cvv"
                    id="cvv"
                    placeholder="•••"
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-3 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                  <ErrorMessage
                    name="cvv"
                    component="div"
                    className="text-red-400 text-xs mt-1"
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                By clicking the “Pay” button, you confirm that you have read the
                list of information about the service and accept the terms of
                the public agreement.
              </p>

              {bookingStatus === StatusEnum.LOADING && <Loader />}

              {isBookingAttempted && bookingStatus === StatusEnum.SUCCEEDED && (
                <p className="text-green-400 text-sm text-center mt-2">
                  All tickets have been successfully booked!
                </p>
              )}

              <button
                type="submit"
                disabled={
                  bookingStatus === StatusEnum.LOADING || !(dirty && isValid)
                }
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg text-center transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-lg"
              >
                {bookingStatus === StatusEnum.LOADING
                  ? "Processing..."
                  : `Pay ${totalPrice}₴`}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PaymentPage;
