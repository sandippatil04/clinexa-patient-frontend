import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  const [showFilter,setShowFilter] = useState(false);
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const filterDoc = speciality ? doctors.filter(doc => doc.speciality === speciality) : doctors;
  const go = (value) => navigate(value ? `/doctors/${value}` : "/doctors");

  return <div>
    <p className="text-gray-600">Browse through the doctors specialist.</p>
    <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
      <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter?"bg-primary text-white":""}`} onClick={()=>setShowFilter(v=>!v)}>Filters</button>
      <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter?"flex":"hidden sm:flex"}`}>
        {["General physician","Gynecologist","Dermatologist","Pediatricians","Neurologist","Gastroenterologist"].map(s=><p key={s} onClick={()=>go(speciality===s?"":s)} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality===s?"bg-indigo-100 text-black":""}`}>{s}</p>)}
      </div>
      <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
        {filterDoc.map(item=><div onClick={()=>navigate(`/appointment/${item._id}`)} className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hove:translate-y-[-10px] transition-all duration-500" key={item._id}>
          <img className="bg-blue-50" src={item.image} alt="" />
          <div className="p-4"><div className="flex items-center gap-2 text-sm text-center text-green-500"><p className="w-2 h-2 bg-green-500 rounded-full"></p><p>{item.available?"Available":"Unavailable"}</p></div><p className="text-gray-900 text-lg font-medium">{item.name}</p><p className="text-gray-600 text-sm">{item.speciality}</p></div>
        </div>)}
      </div>
    </div>
  </div>;
};
export default Doctors;
