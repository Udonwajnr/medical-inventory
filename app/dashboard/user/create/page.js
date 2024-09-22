"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import api from "@/app/axios/axiosConfig";
import { Bars } from "react-loader-spinner";

export default function CreateUser() {
  const router = useRouter();
  const [hospital, setHospital] = useState("");
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
  const wrapperRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hospitalId = localStorage.getItem("_id");
    setHospital(hospitalId);

    const fetchMedications = async () => {
      try {
        const response = await api.get(`https://medical-api-advo.onrender.com/api/medication/${hospitalId}/medications`);
        setMedicationsData(response.data);
      } catch (error) {
        console.error("Error fetching medications:", error);
      }
    };

    fetchMedications();

    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setFilteredMedications([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    setLoading(true);
  
    try {
      // Map the medications to the expected format
      const medicationsPayload = formData.medications.map(medication => ({
        medication: medication.id,          // Ensure this is the correct medication ID
        quantity: medication.quantity        // Ensure this is the correct quantity
      }));

      console.log({ 
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        medication: medicationsPayload // Ensure this is correctly formatted
      });
  
      const response = await api.post(
        `https://medical-api-advo.onrender.com/api/user/hospital/${hospital}/users`,
        { 
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          medication: medicationsPayload // Ensure this is correctly formatted
        }
      );
      router.push("/dashboard/user");
      // Handle successful response, e.g., redirect or show a success message
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setLoading(false);
    }
};

  

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create User</CardTitle>
            <CardDescription>Fill out the form to add a new user.</CardDescription>
          </CardHeader>
          <CardContent>
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
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2 w-full">
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={handleGenderChange}>
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
                      required
                    />
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={medication.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      min="1"
                      required
                    />
                    {filteredMedications.length > 0 && (
                      <ul className="absolute top-12 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredMedications.map((med) => (
                          <li
                            key={med._id}
                            className="p-4 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                            onClick={() => handleSelectMedication(index, med)}
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-gray-700">{med.nameOfDrugs}</span>
                              <span className="text-xs text-gray-500">Dosage: {med.dosage || "N/A"}</span>
                              <span className="text-xs text-gray-400">{med.description || "No description available"}</span>
                            </div>
                            <span className="text-xs text-blue-600 hover:underline">Select</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <Button type="button" onClick={() => handleRemoveMedication(index)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={handleAddMedication}>
                  Add Medication
                </Button>
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? <Bars width="20" color="#fff" /> : "Create User"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
