import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../../api/api";

export default function OnboardingDetails() {
  const { type, id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/admin/onboarding/${type}/${id}`);
      setData(res.data?.data || null);

    } catch (err) {
      console.error("Details fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [type, id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!data) return <div className="p-6">No data found</div>;

  const isCollege = type === "college";

  return (
    <div className="p-6 max-w-5xl">

      <h2 className="text-2xl font-semibold mb-6">
        Onboarding Details
      </h2>

      {/* REQUESTER INFO */}
      <div className="bg-white border rounded p-4 mb-6">
        <h3 className="font-semibold mb-3">Requester Information</h3>

        <p><strong>Name:</strong> {data.requesterName}</p>
        <p><strong>Email:</strong> {data.requesterEmail}</p>
        <p><strong>Phone:</strong> {data.requesterPhone || "—"}</p>
      </div>


      {/* ORGANIZATION INFO */}
      <div className="bg-white border rounded p-4 mb-6">
        <h3 className="font-semibold mb-3">
          {isCollege ? "College Information" : "Company Information"}
        </h3>

        {isCollege ? (
          <>
            <p><strong>Name:</strong> {data.collegeName}</p>
            <p><strong>Location:</strong> {data.location}</p>
            <p><strong>Website:</strong> {data.website || "—"}</p>
            <p><strong>Email Domain:</strong> {data.emailDomain || "—"}</p>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {data.companyName}</p>
            <p><strong>Industry:</strong> {data.industry || "—"}</p>
            <p><strong>Company Size:</strong> {data.companySize || "—"}</p>
            <p><strong>Website:</strong> {data.website || "—"}</p>
            <p><strong>Email Domain:</strong> {data.emailDomain || "—"}</p>

            {data.locations?.length > 0 && (
              <div className="mt-2">
                <strong>Locations:</strong>
                <ul className="list-disc ml-5">
                  {data.locations.map((loc, i) => (
                    <li key={i}>
                      {loc.city}, {loc.state}, {loc.country}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>


      {/* DOCUMENT */}
      <div className="bg-white border rounded p-4 mb-6">
        <h3 className="font-semibold mb-3">Verification Document</h3>

        {data.verificationDocumentUrl ? (
          <a
            href={data.verificationDocumentUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            View Document
          </a>
        ) : (
          <p>No document</p>
        )}
      </div>


      {/* APPROVAL INFO */}
      <div className="bg-white border rounded p-4 mb-6">
        <h3 className="font-semibold mb-3">Approval Information</h3>

        <p><strong>Status:</strong> {data.status}</p>

        {data.reviewedBy && (
          <p><strong>Reviewed By:</strong> {data.reviewedBy.email}</p>
        )}

        {data.reviewedAt && (
          <p>
            <strong>Reviewed At:</strong>{" "}
            {new Date(data.reviewedAt).toLocaleString()}
          </p>
        )}
      </div>


      {/* CREATED ACCOUNT */}
      <div className="bg-white border rounded p-4">
        <h3 className="font-semibold mb-3">Created Account</h3>

        {data.createdUser ? (
          <>
            <p><strong>Email:</strong> {data.createdUser.email}</p>
            <p><strong>Role:</strong> {data.createdUser.role}</p>
          </>
        ) : (
          <p>No account created yet</p>
        )}
      </div>

    </div>
  );
}