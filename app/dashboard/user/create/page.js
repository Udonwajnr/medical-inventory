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
import { toast } from "sonner";

export default function CreateUser() {
  const router = useRouter();
  const [hospital, setHospital] = useState("");
  const [medicationsData, setMedicationsData] = useState([]); // All medications from the API
  const [activeMedicationIndex, setActiveMedicationIndex] = useState(null);
  const [filteredMedications, setFilteredMedications] = useState([]); // Medications filtered by input
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    email: "",
    medications: [{ nameOfDrugs: "", id: "", quantity: 1, startDate:"", endDate:"" }],
  });
  const wrapperRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Fetch medications when component mounts
  useEffect(() => {
    const hospitalId = localStorage.getItem("_id");
    setHospital(hospitalId);

    const fetchMedications = async () => {
      try {
        const response = await api.get(
          `https://medical-api-advo.onrender.com/api/medication/${hospitalId}/medications`
        );
        setMedicationsData(response.data);
      } catch (error) {
        console.error("Error fetching medications:", error);
      }
    };

    fetchMedications();

    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setFilteredMedications([]); // Hide dropdown when clicking outside
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle gender selection change
  const handleGenderChange = (value) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  // Add new medication field
  const handleAddMedication = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [...prev.medications, { nameOfDrugs: "", id: "", quantity: 1 }],
    }));
  };

  // Remove medication field
  const handleRemoveMedication = (index) => {
    const newMedications = formData.medications.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, medications: newMedications }));
  };

  // Handle typing medication name and filtering available medications
  const handleMedicationChange = (index, value) => {
    const medicationName = value;
    const filtered = medicationsData.filter((med) =>
      med.nameOfDrugs.toLowerCase().includes(medicationName.toLowerCase())
    );
    setFilteredMedications(filtered); // Show dropdown with filtered medications

    const newMedications = formData.medications.map((medication, i) =>
      i === index ? { ...medication, nameOfDrugs: medicationName, id: "" } : medication
    );
    setFormData((prev) => ({ ...prev, medications: newMedications }));
  };

  // Handle selecting a medication from the dropdown
  const handleSelectMedication = (index, selectedMedication) => {
    const newMedications = formData.medications.map((medication, i) =>
      i === index
        ? { ...medication, nameOfDrugs: selectedMedication.nameOfDrugs, id: selectedMedication._id }
        : medication
    );
    setFormData((prev) => ({ ...prev, medications: newMedications }));
    setFilteredMedications([]); // Hide dropdown after selection
  };

  // Handle changing medication quantity
  const handleQuantityChange = (index, value) => {
    const newMedications = formData.medications.map((medication, i) =>
      i === index ? { ...medication, quantity: value } : medication
    );
    setFormData((prev) => ({ ...prev, medications: newMedications }));
  };

  // Handle medication date changes (startDate and endDate)
  const handleMedicationDateChange = (index, field, value) => {
    const newMedications = formData.medications.map((medication, i) =>
      i === index ? { ...medication, [field]: value } : medication
    );
  setFormData((prev) => ({ ...prev, medications: newMedications }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const medicationsPayload = formData.medications.map((medication) => ({
        medication: medication.id,
        quantity: medication.quantity,
        startDate: medication.startDate || Date.now(),
        endDate: medication.endDate || null, // Optional end date
      }));

      const response = await api.post(
        `https://medical-api-advo.onrender.com/api/user/hospital/${hospital}/users`,
        {
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          medications: medicationsPayload,
        }
      ).then((data)=>{
          toast("User created Successfully")
      })
      
      ;
      router.push("/dashboard/user");
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
              {/* User Details Fields */}
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                 className="capitalize" 
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
               <div className="grid gap-4 rounded-lg">
  <Label className="text-lg font-semibold text-gray-700">Medications</Label>
  {formData.medications.map((medication, index) => (
    <div
      key={index}
      className="flex flex-col gap-4 p-4 border border-gray-200 rounded-lg bg-white relative shadow-sm"
      ref={wrapperRef}
    >
      {/* Medication Name & Quantity */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-600">Medication Name</Label>
          <Input
            type="text"
            placeholder="Medication Name"
            value={medication.nameOfDrugs}
            onFocus={() => setActiveMedicationIndex(index)} // Set active index on focus
            onBlur={() => setTimeout(() => setActiveMedicationIndex(null), 200)} // Clear the active index after blur (with a delay)
            onChange={(e) => handleMedicationChange(index, e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-600">Quantity</Label>
          <Input
            type="number"
            placeholder="Quantity"
            value={medication.quantity}
            onChange={(e) => handleQuantityChange(index, e.target.value)}
            min="1"
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
        </div>
      </div>

      {/* Medication Suggestions Dropdown (show only for the active input) */}
      {filteredMedications.length > 0 && activeMedicationIndex === index && (
        <ul className="absolute top-20 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
          {filteredMedications.map((med) => (
            <li
              key={med._id}
              className="p-4 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
              onClick={() => handleSelectMedication(index, med)}
            >
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-700">{med.nameOfDrugs}</span>
                <span className="text-xs text-gray-500">Dosage: {med.dosage || 'N/A'}</span>
                <span className="text-xs text-gray-400">{med.description || 'No description available'}</span>
              </div>
              <span className="text-xs text-blue-600 hover:underline">Select</span>
            </li>
          ))}
        </ul>
      )}

      {/* Start Date & End Date */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-600 ">Start Date</Label>
          <Input
            type="datetime-local"
            value={medication.startDate || ''}
            onChange={(e) => handleMedicationDateChange(index, 'startDate', e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 "
          />
        </div>
        {/* <div className="flex flex-col">
          <Label className="text-sm font-medium text-gray-600">End Date</Label>
          <Input
            type="date"
            value={medication.endDate || ''}
            onChange={(e) => handleMedicationDateChange(index, 'endDate', e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div> */}
      </div>

      {/* Remove Medication Button */}
      <Button
        type="button"
        onClick={() => handleRemoveMedication(index)}
        className="bg-red-500 text-white rounded-md p-2 mt-4 hover:bg-red-600"
      >
        Remove
      </Button>
    </div>
    ))}

        {/* Add Medication Button */}
          <Button
            type="button"
            onClick={handleAddMedication}
            className=" text-white rounded-md p-2 hover:bg-blue-600"
          >
            Add Medication
          </Button>
          </div>

              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create User"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

