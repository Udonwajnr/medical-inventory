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
import { PlusCircle, Pill, Trash2 } from 'lucide-react'

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
  const [activeMedicationIndex, setActiveMedicationIndex] = useState({ existing: null, new: null });


  useEffect(() => {
    const fetchUserAndMedications = async () => {
      try {
        const hospitalIdFromLocalStorage = localStorage.getItem("_id");
        setHospitalId(hospitalIdFromLocalStorage);

        const userResponse = await api.get(`/api/user/hospital/${hospitalIdFromLocalStorage}/users/${userId}`);
        const userData = userResponse.data;

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
                quantity: med.quantity,
                startDate: med.startDate || "",
                endDate: med.endDate || "",
                remove: false,
                current: true,
              }))
            : [{ nameOfDrugs: "", id: "", quantity: 1, startDate: "", endDate: "", remove: false, current: true }],
          newMedications: [{ nameOfDrugs: "", id: "", quantity: 1, startDate: "", endDate: "" }],
        });

        const medicationResponse = await api.get(`/api/medication/${hospitalIdFromLocalStorage}/medications`);
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

  const handleMedicationChange = (index, value, isNew = false) => {
    const targetMedications = isNew ? "newMedications" : "medications";
    const medicationName = value;
    const filtered = medicationsData.filter((med) =>
      med.nameOfDrugs.toLowerCase().includes(medicationName.toLowerCase())
    );
    setFilteredMedications(filtered);

    const updatedMedications = formData[targetMedications].map((medication, i) =>
      i === index ? { ...medication, nameOfDrugs: medicationName, id: "" } : medication
    );
    setFormData((prev) => ({ ...prev, [targetMedications]: updatedMedications }));
   
    // Update the active medication index
   setActiveMedicationIndex((prev) => ({
    ...prev,
    [isNew ? 'new' : 'existing']: index,
  }));
  };

  const handleSelectMedication = (index, selectedMedication, isNew = false) => {
    const targetMedications = isNew ? "newMedications" : "medications";
    const updatedMedications = formData[targetMedications].map((medication, i) =>
      i === index
        ? { ...medication, nameOfDrugs: selectedMedication.nameOfDrugs, id: selectedMedication._id }
        : medication
    );
    setFormData((prev) => ({ ...prev, [targetMedications]: updatedMedications }));
    setFilteredMedications([]);

    // Set active medication index to the selected one
  setActiveMedicationIndex((prev) => ({
    ...prev,
    [isNew ? 'new' : 'existing']: index,
  }));
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
      const medicationsPayload = formData.medications.map((medication) => ({
        medication: medication.id,
        quantity: medication.quantity,
        startDate: medication.startDate,
        endDate: medication.endDate,
        current: medication.current,
        remove: medication.remove,
      }));

      const newMedicationsPayload = formData.newMedications
        .filter((med) => med.id)
        .map((medication) => ({
          medication: medication.id,
          quantity: medication.quantity,
          startDate: medication.startDate,
          endDate: medication.endDate,
          current: true,
        }));

      await api.put(`/api/user/hospital/${hospitalId}/users/${userId}`, {
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        medications: medicationsPayload,
        newMedications: newMedicationsPayload,
      });

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
                        <h2 id="current-medications-title" className="text-2xl font-semibold mb-4">Current Medications</h2>
                        <div className="grid gap-4">
                            {formData.medications.map((medication, index) => (
                              <Card key={index} className={activeMedicationIndex.existing === index ? "ring-2 ring-blue-500" : ""}>
                                <CardHeader>
                                  <CardTitle className="flex items-center justify-between">
                                    <span className="flex items-center">
                                      <Pill className="mr-2" />
                                      Medication {index + 1}
                                    </span>
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      onClick={() => removeMedication(index)}
                                      aria-label={`Remove Medication ${index + 1}`}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex gap-2 mb-4">
                                    <Input
                                      placeholder="Medication Name"
                                      value={medication.nameOfDrugs}
                                      onChange={(e) => handleMedicationChange(index, e.target.value)}
                                      onFocus={() => setActiveMedicationIndex(prev => ({ ...prev, existing: index }))} // Set active index on focus
                                    />
                                    {filteredMedications.length > 0 && (
                                      <ul className="bg-white border rounded-lg w-full">
                                        {filteredMedications.map((med) => (
                                          <li
                                            key={med._id}
                                            className="cursor-pointer p-2 hover:bg-gray-100"
                                            onClick={() => handleSelectMedication(index, med)}
                                          >
                                            {med.nameOfDrugs}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>
                                  <div className="flex gap-2 mb-4">
                                    <Input
                                      type="number"
                                      placeholder="Quantity"
                                      value={medication.quantity}
                                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                                      required
                                    />
                                    <Input
                                      type="date"
                                      placeholder="Start Date"
                                      value={medication.startDate}
                                      onChange={(e) => handleMedicationDateChange(index, "startDate", e.target.value)}
                                    />
                                    <Input
                                      type="date"
                                      placeholder="End Date"
                                      value={medication.endDate}
                                      onChange={(e) => handleMedicationDateChange(index, "endDate", e.target.value)}
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </section>
                
                
                
                    {/* New Medications */}
                    <section aria-labelledby="add-medication-title">
        <h2 id="add-medication-title" className="text-2xl font-semibold mb-4">Add New Medication</h2>
        <Card>
          <CardHeader>
            <CardTitle>New Medication Details</CardTitle>
            <CardDescription>Please fill in the details of the new medication</CardDescription>
          </CardHeader>
          <CardContent>
            {formData.newMedications.map((medication, index) => (
              <div key={index} className="grid gap-4 mb-4">
                <Label>New Medication {index + 1}</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="New Medication Name"
                    value={medication.nameOfDrugs}
                    onChange={(e) => handleMedicationChange(index, e.target.value, true)}
                    onFocus={() => setActiveMedicationIndex(prev => ({ ...prev, new: index }))} // Set active index on focus
                    required
                  />
                  {filteredMedications.length > 0 && (
                    <ul className="bg-white border rounded-lg w-full">
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
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={medication.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value, true)}
                    required
                  />
                  <Input
                    type="date"
                    placeholder="Start Date"
                    value={medication.startDate}
                    onChange={(e) => handleMedicationDateChange(index, "startDate", e.target.value, true)}
                    required
                  />
                  <Input
                    type="date"
                    placeholder="End Date"
                    value={medication.endDate}
                    onChange={(e) => handleMedicationDateChange(index, "endDate", e.target.value, true)}
                    required
                  />
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
