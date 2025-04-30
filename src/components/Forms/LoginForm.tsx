import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { login, clearToken, initializeSession } from "../../store/authSlice";
import { AppDispatch, RootState } from "../../store/store";
import { AuthFormProps, LoginPayload } from "../../types/authTypes";
import { logInValidationSchema } from "../../validation/validationSchemas";
import { initialValuesTemp } from "../../validation/initialValuesTemp";

function LoginForm({ handleClose, onSignUpClick }: AuthFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(initializeSession());
  }, [dispatch]);

  const handleClearError = () => {
    dispatch(clearToken());
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-[#2b2f31]  shadow-md rounded px-8 pt-6 pb-8 mb-4 w-420 max-w-md text-white">
        <h2 className="text-center text-2xl font-bold mb-6">Log in</h2>
        <Formik
          initialValues={initialValuesTemp.login}
          validationSchema={logInValidationSchema}
          onSubmit={async (values: LoginPayload) => {
            await dispatch(login(values)).then((response) => {
              if (response.meta.requestStatus === "fulfilled") {
                handleClose();
              }
            });
          }}
        >
          {() => (
            <Form>
              <div className="mb-4">
                <label
                  className="block  text-sm font-bold mb-2"
                  htmlFor="loginOrEmail"
                >
                  Email
                </label>
                <Field
                  className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                  id="loginOrEmail"
                  type="text"
                  placeholder="Enter you email"
                  name="loginOrEmail"
                />
                <ErrorMessage
                  name="loginOrEmail"
                  component="div"
                  className="text-red-500 text-s text-center"
                />
              </div>
              <div className="mb-6">
                <label
                  className="block  text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <Field
                  className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-s text-center"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Log in
                </button>
                <a
                  className="inline-block align-baseline font-semibold text-sm text-indigo-500 hover:text-indigo-600"
                  href="/forgot-password"
                >
                  Forgot your password
                </a>
              </div>
            </Form>
          )}
        </Formik>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">{error}</span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={handleClearError}
            >
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path
                  fillRule="evenodd"
                  d="M14.348 14.849a1.2 1.2 0 01-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 11-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 111.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 111.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 010 1.698z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
        )}
        <p className="text-center text-gray-400 text-xs mt-4">
          Don`t have an account?{" "}
          <button
            onClick={onSignUpClick}
            className="font-semibold text-yellow-400 hover:text-yellow-500"
          >
            Sign Up?
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
