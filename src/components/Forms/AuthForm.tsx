import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik";
import {
  login,
  registerUser,
  clearToken,
  initializeSession,
  clearError,
} from "../../store/authSlice";
import { AppDispatch, RootState } from "../../store/store";
import { LoginPayload, RegisterPayload } from "../../types/authTypes";
import {
  logInValidationSchema,
  registrationValidationSchema,
} from "../../validation/validationSchemas";
import { initialValuesTemp } from "../../validation/initialValuesTemp";
import { loginFields, signupFields } from "../../validation/authfields";
import { useNavigate } from "react-router-dom";

interface AuthFormProps {
  mode: "login" | "signup";
  handleClose: () => void;
  onSwitchMode: () => void;
}

function AuthForm({ mode, handleClose, onSwitchMode }: AuthFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate()

  useEffect(() => {
    if (mode === "login") {
      dispatch(initializeSession());
    }
    dispatch(clearToken());
  }, [dispatch, mode]);

  const handleClearError = () => {
    dispatch(clearError());
  };

  const isLoginMode = mode === "login";
  const title = isLoginMode ? "Log In" : "Sign up";
  const fields = isLoginMode ? loginFields : signupFields;
  const initialValues = isLoginMode
    ? initialValuesTemp.login
    : initialValuesTemp.registration;
  const validationSchema = isLoginMode
    ? logInValidationSchema
    : registrationValidationSchema;
  const submitButtonText = isLoginMode ? "Log In" : "Sign up";
  const bottomLinkText = isLoginMode
    ? "Don't have an account?"
    : "Already have an account?";
  const bottomLinkButtonText = isLoginMode ? "Sign Up" : "Log In";

  const handleSubmit = async (values: FormikValues) => {
    let response;
    if (isLoginMode) {
      response = await dispatch(login(values as LoginPayload));
    } else {
      response = await dispatch(registerUser(values as RegisterPayload));
    }

    if (response.meta?.requestStatus === "fulfilled") {
      if (isLoginMode) {
        handleClose();
      } else {
        onSwitchMode();
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-gray-800 shadow-lg rounded-lg px-8 pt-6 pb-8 w-[440px] max-w-md text-white">
        <h2 className="text-center text-2xl font-bold mb-6">{title}</h2>
        <Formik
          initialValues={initialValues ?? " "}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              {fields.map(
                ({ name, label, type, placeholder, autoComplete }) => (
                  <div className="mb-4" key={name}>
                    <label
                      className="block text-sm font-bold mb-2"
                      htmlFor={name}
                    >
                      {label}
                    </label>
                    <Field
                      className="shadow appearance-none border border-gray-600 bg-gray-700 rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-400"
                      id={name}
                      type={type}
                      placeholder={placeholder}
                      name={name}
                      autoComplete={autoComplete || "off"}
                    />
                    <ErrorMessage
                      name={name}
                      component="div"
                      className="text-red-500 text-xs mt-1 text-center"
                    />
                  </div>
                )
              )}

              <div
                className={`flex items-center ${
                  isLoginMode ? "justify-between" : "justify-end"
                } mt-6`}
              >
                <button
                  className={`bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 ${
                    !isLoginMode ? "ml-auto" : ""
                  }`}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : submitButtonText}
                </button>
                {isLoginMode && (
                  <a
                    className="inline-block align-baseline font-semibold text-sm text-indigo-400 hover:text-indigo-300"
                    href="/forgot-password"
                  >
                    Forgot your password?
                  </a>
                )}
              </div>
            </Form>
          )}
        </Formik>
        {error && (
          <div
            className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded relative mt-4"
            role="alert"
          >
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
              onClick={handleClearError}
              aria-label="Close error"
            >
              <svg
                className="fill-current h-6 w-6 text-red-500 hover:text-red-400"
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
          {bottomLinkText}{" "}
          <button
            type="button"
            onClick={onSwitchMode}
            className="font-semibold text-yellow-400 hover:text-yellow-500 focus:outline-none focus:underline"
          >
            {bottomLinkButtonText}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthForm;
