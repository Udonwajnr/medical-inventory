"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import api from "@/app/axios/axiosConfig";
import { Bars } from "react-loader-spinner";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditUser() {
  const router = useRouter();
  const { id } = useParams();
  const userId = id || "";
  const [hospitalId, setHospitalId] = useState("");
  const [medicationsData, setMedicationsData] = useState([]);
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    email: "",
    medications: [{ nameOfDrugs: "", id: "" }],
  });
  const [loading, setLoading] = useState(true); // For loading data
  const [submitting, setSubmitting] = useState(false); // For form submission
  const [medicationFocusedIndex, setMedicationFocusedIndex] = useState(null); // Track focused medication input

  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchHospitalAndUser = async () => {
      try {
        const hospitalIdFromLocalStorage = localStorage.getItem("_id");
        setHospitalId(hospitalIdFromLocalStorage);

        // Fetch user details
        const userResponse = await api.get(
          `https://medical-api-advo.onrender.com/api/user/hospital/${hospitalIdFromLocalStorage}/users/${userId}`
        );
        const userData = userResponse.data;

        // Ensure medications is an array
        setFormData({
          ...userData,
          medications: Array.isArray(userData.medications)
            ? userData.medications
            : [{ nameOfDrugs: "", id: "" }],
        });

        // Fetch medication list
        const medicationResponse = await api.get(
          `https://medical-api-advo.onrender.com/api/medication/${hospitalIdFromLocalStorage}/medications`
        );
        setMedicationsData(medicationResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalAndUser();

    // Handle click outside of medication input to close dropdown
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setFilteredMedications([]);
        setMedicationFocusedIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userId]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleGenderChange = (value) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  const handleAddMedication = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [...prev.medications, { nameOfDrugs: "", id: "" }],
    }));
  };

  const handleRemoveMedication = (index) => {
    const newMedications = formData.medications.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, medications: newMedications }));
  };

  const handleMedicationChange = (index, value) => {
    setMedicationFocusedIndex(index); // Set focus to this medication input
    const medicationName = value;
    const filtered = medicationsData.filter((med) =>
      med.nameOfDrugs.toLowerCase().includes(medicationName.toLowerCase())
    );
    setFilteredMedications(filtered);

    const newMedications = formData.medications.map((medication, i) =>
      i === index
        ? { ...medication, nameOfDrugs: medicationName, id: "" }
        : medication
    );
    setFormData((prev) => ({ ...prev, medications: newMedications }));
  };

  const handleSelectMedication = (index, selectedMedication) => {
    const newMedications = formData.medications.map((medication, i) =>
      i === index
        ? {
            ...medication,
            nameOfDrugs: selectedMedication.nameOfDrugs,
            id: selectedMedication._id,
          }
        : medication
    );
    setFormData((prev) => ({ ...prev, medications: newMedications }));
    setFilteredMedications([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await api.put(
        `https://medical-api-advo.onrender.com/api/user/hospital/${hospitalId}/users/${userId}`,
        formData
      );
      console.log("User updated:", response.data);
      router.push("/dashboard/user");
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-10 mb-4" />
        <Skeleton className="h-5 mb-4" />
        <Skeleton className="h-5 mb-4" />
        <Skeleton className="h-10 mb-4" />
      </div>
    );
  }

  return (
    <>
      <main className="flex-1 overflow-auto p-6">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Edit User</CardTitle>
              <CardDescription>Update user details below.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    name="dateOfBirth"
                    defaultValue={
                      formData?.dateOfBirth
                        ? new Date(formData.dateOfBirth)
                            .toISOString()
                            .slice(0, 10)
                        : ""
                    }
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-2 w-full">
                  <Label htmlFor="gender">Gender</Label>
                  <Select onValueChange={handleGenderChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue
                        placeholder={formData.gender || "Select Gender"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Medications</Label>
                  {formData.medications?.map((medication, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 relative"
                      ref={wrapperRef}
                    >
                      <Input
                        type="text"
                        value={medication.nameOfDrugs}
                        onChange={(e) =>
                          handleMedicationChange(index, e.target.value)
                        }
                        // required
                      />
                      {medicationFocusedIndex === index &&
                        filteredMedications.length > 0 && (
                          <ul className="absolute top-12 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                            {filteredMedications.map((med) => (
                              <li
                                key={med._id}
                                className="p-4 hover:bg-blue-50 cursor-pointer"
                                onClick={() =>
                                  handleSelectMedication(index, med)
                                }
                              >
                                <span className="text-sm font-semibold text-gray-700">
                                  {med.nameOfDrugs}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleRemoveMedication(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddMedication}
                  >
                    Add Medication
                  </Button>
                </div>

                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <Bars color="#FFFFFF" height={30} width={30} />
                  ) : (
                    "Update User"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
