"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import api from "@/app/axios/axiosConfig";
import { Bars } from "react-loader-spinner";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditUser() {
  const router = useRouter();
  const { id } = useParams(); // Get the user ID from the URL
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
    medications: [{ nameOfDrugs: "", id: "", quantity: 1 }],
  });

  const [loading, setLoading] = useState(true); // For loading data
  const [submitting, setSubmitting] = useState(false); // For form submission
  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchUserAndMedications = async () => {
      try {
        const hospitalIdFromLocalStorage = localStorage.getItem("_id");
        setHospitalId(hospitalIdFromLocalStorage);

        // Fetch user details
        const userResponse = await api.get(
          `https://medical-api-advo.onrender.com/api/user/hospital/${hospitalIdFromLocalStorage}/users/${userId}`
        );
        const userData = userResponse.data;
        console.log(userData.medication)
        // Prepopulate the form with user data
        setFormData({
          fullName: userData.fullName,
          dateOfBirth: userData.dateOfBirth,
          gender: userData.gender,
          phoneNumber: userData.phoneNumber,
          email: userData.email,
          medications: Array.isArray(userData.medication)
            ? userData.medication.map((med) => ({
                nameOfDrugs: med.medication.nameOfDrugs,
                id: med.medication._id,
                quantity: med.quantity,
              }))
            : [{ nameOfDrugs: "", id: "", quantity: 1 }],
        });

        // Fetch medication options
        const medicationResponse = await api.get(
          `https://medical-api-advo.onrender.com/api/medication/${hospitalIdFromLocalStorage}/medications`
        );
        setMedicationsData(medicationResponse.data);
      } catch (error) {
        console.error("Error fetching user or medications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndMedications();
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
      medications: [...prev.medications, { nameOfDrugs: "", id: "", quantity: 1 }],
    }));
  };

  const handleRemoveMedication = (index) => {
    const newMedications = formData.medications.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, medications: newMedications }));
  };

  const handleMedicationChange = (index, value) => {
    const medicationName = value;
    const filtered = medicationsData.filter((med) =>
      med.nameOfDrugs.toLowerCase().includes(medicationName.toLowerCase())
    );
    setFilteredMedications(filtered);

    const newMedications = formData.medications.map((medication, i) =>
      i === index ? { ...medication, nameOfDrugs: medicationName, id: "" } : medication
    );
    setFormData((prev) => ({ ...prev, medications: newMedications }));
  };

  const handleSelectMedication = (index, selectedMedication) => {
    const newMedications = formData.medications.map((medication, i) =>
      i === index
        ? { ...medication, nameOfDrugs: selectedMedication.nameOfDrugs, id: selectedMedication._id }
        : medication
    );
    setFormData((prev) => ({ ...prev, medications: newMedications }));
    setFilteredMedications([]);
  };

  const handleQuantityChange = (index, value) => {
    const newMedications = formData.medications.map((medication, i) =>
      i === index ? { ...medication, quantity: value } : medication
    );
    setFormData((prev) => ({ ...prev, medications: newMedications }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const medicationsPayload = formData.medications.map((medication) => ({
        medication: medication.id,
        quantity: medication.quantity,
      }));

      const response = await api.put(
        `https://medical-api-advo.onrender.com/api/user/hospital/${hospitalId}/users/${userId}`,
        {
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          medication: medicationsPayload,
        }
      );
      router.push("/dashboard/user");
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit User</CardTitle>
            <CardDescription>Modify the user information below.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
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
                    value={formData?.dateOfBirth?new Date(formData?.dateOfBirth).toISOString().slice(0, 10):""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2 w-full">
                  <Label htmlFor="gender">Gender</Label>
                  <Select onValueChange={handleGenderChange} value={formData.gender}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Gender" />
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
                    placeholder="123-456-7890"
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
                    placeholder="johndoe@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Medication Section */}
                <div className="grid gap-2">
                  <Label>Medications</Label>
                  {formData.medications.map((medication, index) => (
                    <div key={index} className="flex items-center gap-2 relative" ref={wrapperRef}>
                      <Input
                        type="text"
                        placeholder="Medication Name"
                        value={medication.nameOfDrugs}
                        onChange={(e) => handleMedicationChange(index, e.target.value)}
                      />
                      {filteredMedications.length > 0 && (
                        <div className="absolute top-10 left-0 w-full border rounded bg-white shadow-lg z-10">
                          {filteredMedications.map((med) => (
                            <div
                              key={med._id}
                              className="cursor-pointer hover:bg-gray-100 p-2"
                              onClick={() => handleSelectMedication(index, med)}
                            >
                              {med.nameOfDrugs}
                            </div>
                          ))}
                        </div>
                      )}
                      <Input
                        type="number"
                        placeholder="Quantity"
                        value={medication.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        className="w-[100px]"
                      />
                      <Button type="button" onClick={() => handleRemoveMedication(index)} variant="destructive">
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button type="button" onClick={handleAddMedication}>
                    Add Medication
                  </Button>
                </div>

                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <Bars
                      height="20"
                      width="50"
                      color="#fff"
                      ariaLabel="bars-loading"
                      visible={true}
                    />
                  ) : (
                    "Update User"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
