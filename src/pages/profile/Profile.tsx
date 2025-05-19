import { useEffect, useState } from 'react';
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updatePassword, updatePasswordLocaly } from "../../store/profileSlice";

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.profile.user);

  const [newPassword, setNewPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleUpdate = () => {
    if (!newPassword.trim()) {
      alert("Please enter a new password");
      return;
    }

    if (newPassword.length < 7 || newPassword.length > 30) {
      alert("Password must be between 7 and 30 characters");
      return;
    }

    const userPassword = password; 

    dispatch(updatePassword({ password: userPassword, newPassword }))
      .unwrap()
      .then(() => {
        dispatch(updatePasswordLocaly({ newPassword }));
        alert("Password updated successfully");
      })
      .catch(() => {
        alert("Failed to update password");
      });
  };

  return (
    <section className="flex flex-col justify-center px-100 gap-5">
      <h1 className="text-3xl font-bold py-2">User Profile</h1>

      {user.length > 0 && (
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-row items-center justify-between w-full">
            <h1 className="font-medium text-2xl">Email: </h1>
            <input
              type="text"
              className="input text-white bg-gray-800 border border-white"
              value={user[0].email}
              disabled
            />
          </div>

          <div className="flex flex-row items-center justify-between w-full">
            <h1 className="font-medium text-2xl">Old Password: </h1>
            <input
              type="password"
              placeholder="Enter new password"
              className="input text-white bg-gray-800 border border-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-row items-center justify-between w-full">
            <h1 className="font-medium text-2xl">New Password: </h1>

            <input
              type="password"
              placeholder="Enter new password"
              className="input text-white bg-gray-800 border border-white"
              value={newPassword}
              minLength={7}
              maxLength={30}
              title='Password must be between 7 and 30 characters'
              onChange={(e) => setNewPassword(e.target.value)}
            />
            
          </div>

          <button
            className="btn btn-lg w-full bg-yellow-400 text-black border-none"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      )}
    </section>
  );
}