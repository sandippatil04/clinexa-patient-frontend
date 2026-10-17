import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, updateProfile, token } = useContext(AppContext);
  const [data,setData] = useState(null);
  const [isEdit,setIsEdit] = useState(false);
  const [saving,setSaving] = useState(false);

  useEffect(() => { if (userData) setData({...userData,address:userData.address || {line1:"",line2:""}}); }, [userData]);

  if (!token) return <div className="py-20 text-center">Please login to view your profile.</div>;
  if (!data) return <div className="py-20 text-center text-gray-500">Loading profile...</div>;

  const save = async () => {
    setSaving(true);
    try {
      const result = await updateProfile({
        name:data.name, phone:data.phone, address:data.address, gender:data.gender, dob:data.dob
      });
      if (result.success) { toast.success(result.message); setIsEdit(false); }
      else toast.error(result.message);
    } catch (error) { toast.error(error.response?.data?.message || error.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm">
      <img className="w-36 rounded" src={data.image || assets.profile_pic} alt="" />
      {isEdit ? <input className="bg-gray-50 text-3xl font-medium max-w-60 mt-4" type="text" value={data.name || ""} onChange={e=>setData(p=>({...p,name:e.target.value}))}/> : <p className="font-medium text-3xl text-neutral-800 mt-4">{data.name}</p>}
      <hr className="bg-zinc-400 h-[1px] border-none" />
      <div>
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Email id:</p><p className="text-blue-500">{data.email}</p>
          <p className="font-medium">Phone:</p>
          {isEdit?<input className="bg-gray-100 max-w-52" value={data.phone || ""} onChange={e=>setData(p=>({...p,phone:e.target.value}))}/>:<p className="text-blue-400">{data.phone}</p>}
          <p className="font-medium">Address:</p>
          {isEdit?<p><input className="bg-gray-50" value={data.address?.line1 || ""} onChange={e=>setData(p=>({...p,address:{...p.address,line1:e.target.value}}))}/><br/><input className="bg-gray-50" value={data.address?.line2 || ""} onChange={e=>setData(p=>({...p,address:{...p.address,line2:e.target.value}}))}/></p>:<p className="text-gray-500">{data.address?.line1}<br/>{data.address?.line2}</p>}
        </div>
      </div>
      <div>
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender:</p>
          {isEdit?<select className="max-w-24 bg-gray-100" value={data.gender || "Not Selected"} onChange={e=>setData(p=>({...p,gender:e.target.value}))}><option>Not Selected</option><option>Male</option><option>Female</option><option>Other</option></select>:<p className="text-gray-400">{data.gender}</p>}
          <p className="font-medium">Birthday:</p>
          {isEdit?<input className="max-w-32 bg-gray-100" type="date" value={data.dob && data.dob !== "Not Selected" ? data.dob : ""} onChange={e=>setData(p=>({...p,dob:e.target.value}))}/>:<p className="text-gray-400">{data.dob}</p>}
        </div>
      </div>
      <div className="mt-10">{isEdit?<button disabled={saving} className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all cursor-pointer disabled:opacity-50" onClick={save}>{saving?"Saving...":"Save information"}</button>:<button className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all cursor-pointer" onClick={()=>setIsEdit(true)}>Edit</button>}</div>
    </div>
  );
};
export default MyProfile;
