import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const MyAppointments = () => {
  const { token, backendUrl, currencySymbol, slotDateFormat } = useContext(AppContext);
  const [appointments,setAppointments] = useState([]);
  const [loading,setLoading] = useState(true);

  const fetchAppointments = async () => {
    if (!token) return;
    try {
      const {data} = await axios.get(`${backendUrl}/api/appointment/user`,{headers:{token}});
      if (data.success) setAppointments(data.appointments);
      else toast.error(data.message);
    } catch(error) { toast.error(error.response?.data?.message || error.message); }
    finally { setLoading(false); }
  };

  useEffect(()=>{fetchAppointments()},[token]);

  const cancel = async (appointmentId) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      const {data} = await axios.post(`${backendUrl}/api/appointment/cancel`,{appointmentId},{headers:{token}});
      if(data.success){toast.success(data.message);fetchAppointments()} else toast.error(data.message);
    } catch(error){toast.error(error.response?.data?.message || error.message)}
  };

  const pay = async (appointmentId) => {
    try {
      const {data} = await axios.post(`${backendUrl}/api/appointment/pay`,{appointmentId},{headers:{token}});
      if(data.success){toast.success(data.message);fetchAppointments()} else toast.error(data.message);
    } catch(error){toast.error(error.response?.data?.message || error.message)}
  };

  if (!token) return <div className="py-20 text-center">Please login to view your appointments.</div>;
  if (loading) return <div><p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My appointments</p><p className="py-10 text-gray-500">Loading...</p></div>;

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My appointments</p>
      {appointments.length === 0 ? <p className="py-10 text-gray-500">No appointments booked yet.</p> : <div>
        {appointments.map((item)=> {
          const doctor=item.doctorId;
          return <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-5 border-b" key={item._id}>
            <div><img className="w-32 bg-indigo-50" src={doctor?.image} alt="" /></div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">{doctor?.name}</p><p>{doctor?.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address:</p><p className="text-xs">{doctor?.address?.line1}</p><p className="text-xs">{doctor?.address?.line2}</p>
              <p className="text-xs mt-1"><span className="text-sm text-neutral-700 font-medium">Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
              <p className="text-xs mt-1"><span className="font-medium">Fee:</span> {currencySymbol}{item.amount} &nbsp; <span className={item.payment?"text-green-600":"text-orange-500"}>{item.payment?"Paid":"Payment pending"}</span></p>
              {item.isCompleted && <p className="text-green-600 text-xs mt-1">Completed</p>}
            </div>
            <div className="flex flex-col gap-2 justify-end">
              {!item.payment && !item.cancelled && !item.isCompleted && <button onClick={()=>pay(item._id)} className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer">Pay Online</button>}
              {!item.cancelled && !item.isCompleted && <button onClick={()=>cancel(item._id)} className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer">Cancel appointment</button>}
              {item.cancelled && <button disabled className="text-sm text-red-500 text-center sm:min-w-48 py-2 border rounded cursor-default">Cancelled</button>}
            </div>
          </div>
        })}
      </div>}
    </div>
  );
};
export default MyAppointments;
