import React,{useEffect,useState} from "react";
import { useParams } from "react-router-dom";
import API from "../../api/api";

export default function AcademicInternshipTrack(){

const { applicationId } = useParams();

const [data,setData] = useState(null);

useEffect(()=>{

const fetchData = async()=>{

  const res = await API.get(`/applications/${applicationId}/academic-track`);
  setData(res.data.data);

};

fetchData();

},[applicationId]);

if(!data){
return <div className="p-10">Loading progress...</div>;
}

return(

<div className="max-w-5xl mx-auto p-8">

<h1 className="text-xl font-bold mb-6">
Internship Monitoring
</h1>

<div className="grid grid-cols-2 gap-4 mb-8 text-sm">

<div>
<span className="text-gray-500">Student</span>
<div>{data.student.fullName}</div>
</div>

<div>
<span className="text-gray-500">Company</span>
<div>{data.company.name}</div>
</div>

<div>
<span className="text-gray-500">Mentor</span>
<div>{data.mentor?.fullName}</div>
</div>

<div>
<span className="text-gray-500">Status</span>
<div>{data.status}</div>
</div>

</div>

{/* TASK TABLE */}

<h2 className="font-semibold mb-3">Task Progress</h2>

<table className="w-full border text-sm">

<thead className="bg-gray-100">

<tr>
<th className="p-2 border">Task</th>
<th className="p-2 border">Status</th>
<th className="p-2 border">Created</th>
</tr>

</thead>

<tbody>

{data.tasks.map((t,i)=>(
<tr key={i}>
<td className="border p-2">{t.label}</td>
<td className="border p-2">{t.status}</td>
<td className="border p-2">
{new Date(t.createdAt).toLocaleDateString()}
</td>
</tr>
))}

</tbody>

</table>

{/* LOG SUMMARY */}

<h2 className="font-semibold mt-8 mb-3">
Activity Logs
</h2>

<table className="w-full border text-sm">

<thead className="bg-gray-100">
<tr>
<th className="p-2 border">Date</th>
<th className="p-2 border">Status</th>
</tr>
</thead>

<tbody>

{data.logs.map(l=>(
<tr key={l._id}>
<td className="border p-2">
{new Date(l.logDate).toLocaleDateString()}
</td>
<td className="border p-2">{l.status}</td>
</tr>
))}

</tbody>

</table>

</div>

);

}