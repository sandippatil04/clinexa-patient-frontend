import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctors, currencySymbol, token, backendUrl } = useContext(AppContext);
  const daysOfWeek = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
  const [docInfo,setDocInfo] = useState(null);
  const [docSlots,setDocSlots] = useState([]);
  const [slotIndex,setSlotIndex] = useState(0);
  const [slotTime,setSlotTime] = useState("");
  const [booking,setBooking] = useState(false);

  useEffect(() => {
    setDocInfo(doctors.find(doc => doc._id === docId) || null);
  }, [doctors, docId]);

  useEffect(() => {
    if (!docInfo) return;
    const getAvailableSlots = () => {
      const slots = [];
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        let start = new Date(currentDate);
        if (i === 0) {
          const hour = today.getHours();
          start.setHours(hour >= 10 ? Math.min(hour + 1, 20) : 10, today.getMinutes() > 30 ? 30 : 0, 0, 0);
        } else start.setHours(10,0,0,0);
        const end = new Date(currentDate);
        end.setHours(21,0,0,0);
        const timeSlots = [];
        while (start < end) {
          timeSlots.push({ datetime:new Date(start), time:start.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}) });
          start.setMinutes(start.getMinutes()+30);
        }
        slots.push(timeSlots);
      }
      setDocSlots(slots);
      setSlotIndex(0);
      setSlotTime("");
    };
    getAvailableSlots();
  }, [docInfo]);

  const bookAppointment = async () => {
    if (!token) return navigate("/login");
    if (!slotTime) return toast.error("Please select a time slot");
    setBooking(true);
    try {
      const selected = docSlots[slotIndex]?.find(slot => slot.time === slotTime);
      if (!selected) return;
      const d = selected.datetime;
      const slotDate = `${d.getDate()}_${d.getMonth()+1}_${d.getFullYear()}`;
      const {data} = await axios.post(`${backendUrl}/api/appointment/book`, {docId,slotDate,slotTime}, {headers:{token}});
      if (data.success) {
        toast.success(data.message);
        navigate("/my-appointments");
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally { setBooking(false); }
  };

  if (!docInfo) return <div className="py-20 text-center text-gray-500">Doctor not found.</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div><img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt="" /></div>
        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">{docInfo.name}<img className="w-5" src={assets.verified_icon} alt="" /></p>
          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600"><p>{docInfo.degree} - {docInfo.speciality}</p><button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button></div>
          <div><p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">About <img src={assets.info_icon} alt="" /></p><p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p></div>
          <p className="text-gray-500 font-medium mt-4">Appointment fee: <span className="text-gray-600">{currencySymbol}{docInfo.fees}</span></p>
        </div>
      </div>

      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <p>Booking Slots</p>
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {docSlots.map((item,index)=><div onClick={()=>{setSlotIndex(index);setSlotTime("")}} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex===index?"bg-primary text-white":"border border-gray-200"}`} key={index}><p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p><p>{item[0] && item[0].datetime.getDate()}</p></div>)}
        </div>
        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {(docSlots[slotIndex] || []).map((item,index)=><p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time===slotTime?"bg-primary text-white":"text-gray-400 border border-gray-300"}`} key={index}>{item.time.toLowerCase()}</p>)}
        </div>
        <button disabled={booking} onClick={bookAppointment} className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 cursor-pointer disabled:opacity-60">{booking?"Booking...":"Book an appointment"}</button>
      </div>
      <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
    </div>
  );
};
export default Appointment;
