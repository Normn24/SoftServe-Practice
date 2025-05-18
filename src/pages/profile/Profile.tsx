import { useEffect } from 'react'
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../store/profileSlice";

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.profile.user)
  useEffect(() => {
    dispatch(fetchProfile())
  }, [])

  return (
    <section className="flex flex-col justify-center px-100 gap-5">
        <h1 className="text-3xl font-bold py-2">User Profile</h1>
        {user.map(item => (
            <div className="flex flex-col gap-10 w-full" >
              <div className="flex flex-row items-center justify-between w-full">
                <h1 className="font-medium text-2xl">Email: </h1>
                <input type="text" placeholder="Type here" className="input  text-white bg-gray-800 border border-white" defaultValue={item.email} disabled/>
              </div>

              <div className="flex flex-row items-center justify-between w-full">
                <h1 className="font-medium text-2xl">Password: </h1>
                <input type="text" placeholder="Type here" className="input  text-white bg-gray-800 border border-white" defaultValue={item.password}/>
              </div>

              <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg w-full bg-yellow-400 text-black border-none">Update</button>

            </div>
            
        ))}
    </section>
  )
}