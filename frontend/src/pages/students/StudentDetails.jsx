import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";

export default function StudentDetails() {

const { studentId } = useParams();
const navigate = useNavigate();

const [student, setStudent] = useState(null);
const [stats, setStats] = useState(null);
const [internships, setInternships] = useState([]);
const [loading, setLoading] = useState(true);

const fetchData = async () => {
try {

  const [profileRes, statsRes, internshipsRes] = await Promise.all([
    API.get(`/students/${studentId}`),
    API.get(`/students/${studentId}/stats`),
    API.get(`/students/${studentId}/internships`)
  ]);

  setStudent(profileRes.data.data);
  setStats(statsRes.data.data);
  setInternships(internshipsRes.data.data || []);

} catch (err) {
  console.error(err);
  alert("Failed to load student data");
} finally {
  setLoading(false);
}
};

useEffect(() => {
if (studentId) fetchData();
}, [studentId]);

if (loading) {
return ( <div className="flex justify-center items-center min-h-screen">
Loading student details... </div>
);
}

if (!student) {
return <div className="p-8">Student not found</div>;
}

const ongoing = internships.filter(i => i.status === "ongoing");
const completed = internships.filter(i => i.status === "completed");

return ( <div className="p-6 md:p-10 max-w-6xl mx-auto">

  {/* STUDENT PROFILE */}

  <div className="bg-white shadow rounded-xl p-6 mb-8">

    <h1 className="text-2xl font-bold mb-4">
      {student.fullName}
    </h1>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">

      <div>
        <span className="text-gray-500">Email</span>
        <div>{student.user?.email}</div>
      </div>

      <div>
        <span className="text-gray-500">PRN</span>
        <div>{student.prn || "-"}</div>
      </div>

      <div>
        <span className="text-gray-500">ABC ID</span>
        <div>{student.abcId || "-"}</div>
      </div>

      <div>
        <span className="text-gray-500">Course</span>
        <div>{student.courseName}</div>
      </div>

      <div>
        <span className="text-gray-500">Specialization</span>
        <div>{student.specialization}</div>
      </div>

      <div>
        <span className="text-gray-500">Year</span>
        <div>{student.Year}</div>
      </div>

    </div>

  </div>



  {/* INTERNSHIP STATS */}

  {stats && (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

      <StatCard label="Applied" value={stats.applied} />
      <StatCard label="Selected" value={stats.selected} />
      <StatCard label="Ongoing" value={stats.ongoing} />
      <StatCard label="Completed" value={stats.completed} />

    </div>
  )}



  {/* ONGOING INTERNSHIPS */}

  <Section title="Ongoing Internship">

    {ongoing.length === 0 ? (
      <p>No ongoing internship</p>
    ) : (
      ongoing.map(app => (
        <InternshipCard
          key={app._id}
          app={app}
          onView={() =>
           navigate(`/academic-internship-track/${app._id}`)
          }
        />
      ))
    )}

  </Section>



  {/* COMPLETED INTERNSHIPS */}

  <Section title="Completed Internships">

    {completed.length === 0 ? (
      <p>No completed internships</p>
    ) : (
      completed.map(app => (
        <InternshipCard
          key={app._id}
          app={app}
          onView={() =>
            navigate(`/internships/${app._id}/logbook`)
          }
        />
      ))
    )}

  </Section>

</div>
);
}

function StatCard({ label, value }) {
return ( <div className="bg-white shadow rounded-xl p-4 text-center"> <div className="text-2xl font-bold">{value}</div> <div className="text-xs text-gray-500 uppercase">
{label} </div> </div>
);
}

function Section({ title, children }) {
return ( <div className="bg-white shadow rounded-xl p-6 mb-8"> <h2 className="text-lg font-bold mb-4">{title}</h2>
{children} </div>
);
}

function InternshipCard({ app, onView }) {

return ( <div className="border rounded-lg p-4 flex justify-between items-center">

  <div>

    <div className="font-semibold">
      {app.internship?.title}
    </div>

    <div className="text-sm text-gray-500">
      {app.company?.name}
    </div>

  </div>

  <button
    onClick={onView}
    className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
  >
    View
  </button>

</div>
);
}
