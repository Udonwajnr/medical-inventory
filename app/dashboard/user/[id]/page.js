"use client";
import { useState, useEffect } from "react";
import ContainerLayout from "@/app/components/ContainerLayout";
import api from "@/app/axios/axiosConfig";
import { useRouter, useParams } from "next/navigation";

export default function UserDetails() {
  const { id } = useParams(); // Get the user ID from the URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const hospitalId = localStorage.getItem("_id"); // Get hospital ID from local storage

      if (!hospitalId || !id) {
        setError("Invalid User ID or Hospital ID. Redirecting...");
        setTimeout(() => {
          router.push("/dashboard/inventory");
        }, 2000);
        return;
      }

      try {
        const response = await api.get(`https://medical-api-advo.onrender.com/api/user/hospital/${hospitalId}/users/${id}`);
        setUser(response.data);
      } catch (err) {
        setError("Failed to fetch user details.");
        setTimeout(() => {
          router.push("/dashboard/inventory");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id, router]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="grid gap-6 md:gap-8">
          <div>
            <h1 className="text-2xl font-bold">{user?.fullName}</h1>
          </div>
          <div className="grid gap-4">
            <div>
              <h2 className="text-lg font-semibold">Contact Information</h2>
              <p>Email: {user?.email}</p>
              <p>Phone: {user?.phoneNumber}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Date of Birth</h2>
              <p>{new Date(user?.dateOfBirth).toLocaleDateString()}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Gender</h2>
              <p>{user?.gender}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Address</h2>
              <p>{user.address || "Not Available"}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Account Status</h2>
              <p>{user?.status || "Not Available"}</p>
            </div>
            {/* <div>
              <h2 className="text-lg font-semibold">Role</h2>
              <p>{user.role || "Not Available"}</p>
            </div> */}
            {/* <div>
              <h2 className="text-lg font-semibold">Preferences</h2>
              <ul className="grid gap-2">
                <li>Receive newsletters: {user.preferences?.newsletters ? "Yes" : "No"}</li>
                <li>Enable two-factor authentication: {user.preferences?.twoFactor ? "Yes" : "No"}</li>
                <li>Dark mode: {user.preferences?.darkMode ? "Enabled" : "Disabled"}</li>
              </ul>
            </div> */}
            {/* <div>
              <h2 className="text-lg font-semibold">Joined Date</h2>
              <p>{new Date(user.joinedDate).toLocaleDateString() || "Not Available"}</p>
            </div> */}
            <div>
              <h2 className="text-lg font-semibold">Medication</h2>
              {user.medication.length > 0 ? (
                <ul className="grid gap-2">
                  {user.medication.map((med, index) => (
                    <li key={index}>{med}</li>
                  ))}
                </ul>
              ) : (
                <p>No medication assigned</p>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold">Hospital</h2>
              {user.hospital.length > 0 ? (
                <ul className="grid gap-2">
                  {user.hospital.map((hospital, index) => (
                    <li key={index}>{hospital}</li>
                  ))}
                </ul>
              ) : (
                <p>No hospital information available</p>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold">Medication Regimen</h2>
              {user.userSpecificMedicationRegimen && user.userSpecificMedicationRegimen.length > 0 ? (
                <ul className="grid gap-2">
                  {user.userSpecificMedicationRegimen.map((regimen, index) => (
                    <li key={index}>{regimen}</li>
                  ))}
                </ul>
              ) : (
                <p>No specific medication regimen available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
