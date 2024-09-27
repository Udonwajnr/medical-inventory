"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import api from "@/app/axios/axiosConfig";
import { Skeleton } from "@/components/ui/skeleton";
import {Pill, CheckCircle, XCircle,PlusCircle, Trash2 } from 'lucide-react'

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
    medications: [{ nameOfDrugs: "", id: "", quantity: 1, startDate: "", endDate: "", remove: false, current: true }],
    newMedications: [{ nameOfDrugs: "", id: "", quantity: 1, startDate: "", endDate: "" }],
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
 const [activeMedicationIndex, setActiveMedicationIndex] = useState(null);
 const [activeNewMedicationIndex, setActiveNewMedicationIndex] = useState(null);
 


  useEffect(() => {
    const fetchUserAndMedications = async () => {
      try {
        const hospitalIdFromLocalStorage = localStorage.getItem("_id");
        setHospitalId(hospitalIdFromLocalStorage);

        const userResponse = await api.get(`https://medical-api-advo.onrender.com/api/user/hospital/${hospitalIdFromLocalStorage}/users/${userId}`);
        const userData = userResponse.data;
        console.log(userData)
        setFormData({
          fullName: userData.fullName,
          dateOfBirth: userData.dateOfBirth,
          gender: userData.gender,
          phoneNumber: userData.phoneNumber,
          email: userData.email,
          medications: Array.isArray(userData.medications)
            ? userData.medications.map((med) => ({
                nameOfDrugs: med.medication.nameOfDrugs,
                id: med.medication._id,
                quantity: Number(med.quantity),
                startDate: med.startDate || "",
                endDate: med.endDate || "",
                remove: false,
                current: med.current,
              }))
            : [{ nameOfDrugs: "", id: "", quantity: 1, startDate: "", endDate: "", remove: false, current: true }],
          newMedications: [{ nameOfDrugs: "", id: "", quantity: 1, startDate: "", endDate: "" }],
        });

        const medicationResponse = await api.get(`https://medical-api-advo.onrender.com/api/medication/${hospitalIdFromLocalStorage}/medications`);
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

  const handleAddNewMedication = () => {
    setFormData((prev) => ({
      ...prev,
      newMedications: [...prev.newMedications, { nameOfDrugs: "", id: "", quantity: 1, startDate: "", endDate: "" }],
    }));
  };

  const handleRemoveNewMedication = (index) => {
    const newMedications = formData.newMedications.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, newMedications: newMedications }));
  };

  const handleRemoveMedication = (index) => {
    const newMedications = formData.medications.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, medications: newMedications,remove:true}));
  
  };

  const handleMedicationChange = (index, value, isNew = false) => {
    const targetMedications = isNew ? "newMedications" : "medications";
    const updatedMedications = formData[targetMedications].map((medication, i) =>
      i === index ? { ...medication, nameOfDrugs: value, id: "" } : medication
    );
  
    // Update state and log for debugging
    setFormData((prev) => ({ ...prev, [targetMedications]: updatedMedications }));
    console.log(`Updated ${targetMedications}:`, updatedMedications); // Log to verify updates
  
    // Filter medications based on input value
    const filtered = medicationsData.filter((med) =>
      med.nameOfDrugs.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredMedications(filtered);
  };
  
  const handleSelectMedication = (index, selectedMedication, isNew = false) => {
    const targetMedications = isNew ? "newMedications" : "medications";
    const updatedMedications = formData[targetMedications].map((medication, i) =>
      i === index
        ? { ...medication, nameOfDrugs: selectedMedication.nameOfDrugs, id: selectedMedication._id }
        : medication
    );
  
    // Update state and clear filtered list
    setFormData((prev) => ({ ...prev, [targetMedications]: updatedMedications }));
    setFilteredMedications([]);
    console.log(`Selected Medication for index ${index}:`, selectedMedication); // Log for debugging
  };
  

  const handleQuantityChange = (index, value, isNew = false) => {
    const targetMedications = isNew ? "newMedications" : "medications";
    const updatedMedications = formData[targetMedications].map((medication, i) =>
      i === index ? { ...medication, quantity: value } : medication
    );
    setFormData((prev) => ({ ...prev, [targetMedications]: updatedMedications }));
  };

  const handleMedicationDateChange = (index, field, value, isNew = false) => {
    const targetMedications = isNew ? "newMedications" : "medications";
    const updatedMedications = formData[targetMedications].map((medication, i) =>
      i === index ? { ...medication, [field]: value } : medication
    );
    setFormData((prev) => ({ ...prev, [targetMedications]: updatedMedications }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
  
    try {
      // Construct medicationsPayload
      const medicationsPayload = formData.medications.map((medication) => ({
        medication: medication.id,
        quantity:  Number(medication.quantity),
        startDate: medication.startDate,
        endDate: medication.endDate,
        // current: medication.current,
        // remove: medication.remove || false, // Default to false if remove is undefined
      }));
      console.log('Medications Payload:', medicationsPayload);
  
      // Construct newMedicationsPayload
      const newMedicationsPayload = formData.newMedications
        .filter((med) => med.id) // Ensure we only include medications with an ID
        .map((medication) => ({
          medication: medication.id,
          quantity: medication.quantity || 1, // Default quantity if undefined
          startDate: medication.startDate || Date.now(), // Default to now if undefined
          endDate: medication.endDate,
          current: true,
          remove: medication.remove || false, // Default to false if remove is undefined
        }));
  
      console.log('New Medications Payload:', newMedicationsPayload);
  
      // Send PUT request
      const response = await api.put(`https://medical-api-advo.onrender.com/api/user/hospital/${hospitalId}/users/${userId}`, {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        medications: medicationsPayload,
        newMedications: newMedicationsPayload,
      });
      
      console.log('Response:', response);
  
      // Redirect on success
      if (response.status === 200) {
        router.push("/dashboard/user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setSubmitting(false);
    }
  };
  
  console.log(formData.medications)
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
                    value={formData?.dateOfBirth ? new Date(formData?.dateOfBirth).toISOString().slice(0, 10) : ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2 w-full">
                  <Label htmlFor="gender">Gender</Label>
                  <Select onValueChange={handleGenderChange} value={formData.gender}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleInputChange} required />
                </div>


                <div className="grid md:grid-cols-2 gap-6">
                     {/* Existing Medications */}
                      <section aria-labelledby="current-medications-title">
                        <h2 id="current-medications-title" className="text-xl font-semibold mb-4">Current Medications of User</h2>
                        <div className="grid gap-4">
                          {formData.medications.filter((medication)=>medication.current === true).map((medication, index) => (
                            <Card key={index}>
                              <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                  <span className="flex items-center">
                                    <Pill className="mr-2" />
                                    Medication {index + 1}
                                  </span>
                                  {/* Optional: Add a remove button here if you want to remove a medication */}
                                  <div
                                    size="icon"
                                    onClick={() => handleRemoveMedication(index)} // Create a remove function
                                    aria-label={`Remove Medication ${index + 1}`}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </div>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex gap-2 mb-4">
                                  <Input
                                    placeholder="Medication Name"
                                    value={medication.nameOfDrugs}
                                    onFocus={() => setActiveMedicationIndex(index)} // Set active index on focus
                                    onBlur={() => setTimeout(() => setActiveMedicationIndex(null), 200)} // Clear the active index after blur (with a delay)
                                    onChange={(e) => handleMedicationChange(index, e.target.value)}
                                  />
                                  {filteredMedications.length > 0 && activeMedicationIndex === index &&(
                                    <ul className="bg-white border rounded-lg w-full">
                                      {filteredMedications.map((med) => (
                                        <li
                                          key={med._id}
                                          className="cursor-pointer p-2 hover:bg-gray-100"
                                          onClick={() => handleSelectMedication(index,med)}
                                        >
                                          {med.nameOfDrugs}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                                <div className="flex gap-2 mb-4">
                                  <div>
                                    <Label>Quantity</Label>
                                    <Input
                                      type="number"
                                      placeholder="Quantity"
                                      value={Number(medication.quantity)}
                                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                                      required
                                    />
                                  </div>

                                  <div>
                                  <Label>Start Date</Label>
                                    <Input
                                      type="date"
                                      placeholder="Start Date"
                                      value={medication.startDate ? new Date(medication.startDate).toISOString().slice(0, 10):""}
                                      onChange={(e) => handleMedicationDateChange(index, "startDate", e.target.value)}
                                    />
                                  </div>
                                  <div>
                                  <Label>End Date</Label>
                                    <Input
                                      type="date"
                                      placeholder="End Date"
                                      value={medication.endDate ? new Date(medication.endDate).toISOString().slice(0, 10) : ""}
                                      onChange={(e) => handleMedicationDateChange(index, "endDate", e.target.value)}
                                    />
                                  </div>
                                </div>
                                <span>Status: {medication.current ? 
                                  <span className="text-green-600 flex items-center"><CheckCircle className="w-4 h-4 mr-1" />On Current Medication</span> : 
                                  <span className="text-red-600 flex items-center"><XCircle className="w-4 h-4 mr-1" /> Not on Current Medication</span>}
                                </span>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </section>
                
                
                
                    {/* New Medications */}
                    <section aria-labelledby="add-medication-title">
        <h2 id="add-medication-title" className="text-xl font-semibold mb-4">Purchase New Medication</h2>
        <Card>
          <CardHeader>
            <CardTitle>New Medication Details</CardTitle>
            <CardDescription>Please fill in the details of the new medication</CardDescription>
          </CardHeader>
          <CardContent>
            {formData.newMedications.map((medication, index) => (
              <div key={index} className="grid gap-4 mb-4">
                  <div className="flex justify-between items-center">
                      <Label>New Medication {index + 1}</Label>
                      <div
                          size="icon"
                          onClick={() => handleRemoveNewMedication(index)} // Create a remove function
                          aria-label={`Remove Medication ${index + 1}`}
                          className="cursor-pointer"
                        >
                          <Trash2 className="h-5 w-5" />
                        </div>
                  </div>
                <div className="flex gap-2 relative">
                  <Input
                    placeholder="New Medication Name"
                    onFocus={() => setActiveNewMedicationIndex(index)} // Set active index on focus
                    onBlur={() => setTimeout(() => setActiveNewMedicationIndex(null), 200)} // Clear the active index after blur (with a delay)
                    value={medication.nameOfDrugs}
                    onChange={(e) => handleMedicationChange(index, e.target.value, true)}
                    // required
                  />
                  
                  {filteredMedications.length > 0 && activeNewMedicationIndex === index &&(
                    <ul className="absolute top-14 border-gray-300 shadow-lg max-h-60 bg-white border rounded-lg w-full overflow-y-auto">
                      {filteredMedications.map((med) => (
                        <li
                          key={med._id}
                          className="cursor-pointer p-2 hover:bg-gray-100"
                          onClick={() => handleSelectMedication(index, med, true)}
                        >
                          {med.nameOfDrugs}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex gap-2">
                <div>
                  <Label>Quantity</Label>
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={medication.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value, true)}
                      // required
                    />
                </div>

                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      placeholder="Start Date"
                      value={medication.startDate}
                      onChange={(e) => handleMedicationDateChange(index, "startDate", e.target.value, true)}
                      // required
                    />
                  </div>
                  <div>
                  <Label>End Date</Label>
                    <Input
                      type="date"
                      placeholder="End Date"
                      value={medication.endDate}
                      onChange={(e) => handleMedicationDateChange(index, "endDate", e.target.value, true)}
                      // required
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" onClick={handleAddNewMedication} className="w-full">
              Add New Medication
            </Button>
          </CardContent>
        </Card>
                    </section>
                </div>

                <Button type="submit" className="mt-6">
                  {submitting ? "Submitting..." : "Submit"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
