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
import { Bars } from "react-loader-spinner";
import { Checkbox } from "@/components/ui/checkbox"
export default function EditUser() {
  const router = useRouter();
  const { id } = useParams();
  const userId = id || "";
  const [hospitalId, setHospitalId] = useState("");
  const [medicationsData, setMedicationsData] = useState([]);
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [userMedication,setUserMedication] = useState([])
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    email: "",
    medications: [{
      nameOfDrugs: "", 
      id: "", 
      quantity: 1, 
      startDate: "", 
      endDate: "", 
      remove: false, 
      current: true, 
      custom: false, 
      customDosage: "", 
      customFrequency: { value: '', unit: 'hours' }, 
      customDuration: { value: '', unit: 'days' }
    }],
    newMedications: [{ nameOfDrugs: "", id: "", quantity: 1, startDate: "", endDate: "" ,custom: false, customDosage: "", customFrequency: { value: '', unit: 'hours' }, customDuration: { value: '', unit: 'days' }}],
  });
 const [loading, setLoading] = useState(true);
 const [submitting, setSubmitting] = useState(false);
 const [activeMedicationIndex, setActiveMedicationIndex] = useState(null);
 const [userExist,setUserExist] = useState(null)
 const [activeNewMedicationIndex, setActiveNewMedicationIndex] = useState(null);
 
  useEffect(() => {
    const fetchUserAndMedications = async () => {
      try {
        const hospitalIdFromLocalStorage = localStorage.getItem("_id");
        setHospitalId(hospitalIdFromLocalStorage);

        const userResponse = await api.get(`https://medical-api-advo.onrender.com/api/user/hospital/${hospitalIdFromLocalStorage}/users/${userId}`);
        const userData = userResponse.data;
        console.log(userData)
        setUserMedication(userData.medications)
        setFormData({
          fullName: userData.fullName,
          dateOfBirth: userData.dateOfBirth,
          gender: userData.gender,
          phoneNumber: userData.phoneNumber,
          email: userData.email,
          medications: Array.isArray(userData.medications)
            ? userData.medications.map((med) => ({
                _id:med._id,
                nameOfDrugs: med.medication.nameOfDrugs,
                id: med.medication._id,
                quantity: Number(med.quantity),
                startDate: med.startDate || "",
                endDate: med.endDate || "",
                current: med.current,
                remove:false,
                current: true,
                custom: med?.custom, customDosage:med?.customDosage,
                customFrequency: { value: med?.customFrequency?.value, unit: med?.customFrequency?.unit },
                customDuration: { value: med?.customDuration?.value, unit: med?.customDuration?.unit }
              })) : [{ nameOfDrugs: "", id: "", quantity: 1, startDate: "", endDate: "", remove: false, current: true,custom: false, customDosage: "", customFrequency: { value: '', unit: 'hours' }, customDuration: { value: '', unit: 'days' } }],
          newMedications: [{ nameOfDrugs: "", id: "", quantity: 1, startDate: "", endDate: "",custom: false, customDosage: "", customFrequency: { value: '', unit: 'hours' }, customDuration: { value: '', unit: 'days' }}],
        });

        const medicationResponse = await api.get(`https://medical-api-advo.onrender.com/api/medication/${hospitalIdFromLocalStorage}/medications`)
        .then((medicationResponse)=>{
          setMedicationsData(medicationResponse.data);
        }).catch((error)=>console.log(error))
        // setMedicationsData(medicationResponse.data);
        console.log(medicationsData)
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

  const toggleMarkedForRemoval = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      medications: prevState.medications.map((med, i) =>
        i === index ? { ...med, remove: !med.remove } : med
      ),
    }));
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
    const quantityValue = Math.max(1, Number(value)); 
    const updatedMedications = formData[targetMedications].map((medication, i) =>
      i === index ? { ...medication,  quantity: quantityValue } : medication
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

  const handleCustomChange = (index, field, value, isNew = false) => {
    const targetMedications = isNew ? "newMedications" : "medications";
    const updatedMedications = formData[targetMedications].map((medication, i) =>
      i === index ? { ...medication, [field]: value } : medication
    );
    setFormData((prev) => ({ ...prev, [targetMedications]: updatedMedications }));
  };

  const toggleNewMedicationCustomField = (index) => {
    setFormData((prevFormData) => {
      const updatedNewMedications = prevFormData.newMedications.map((medication, medIndex) => {
        if (medIndex === index) {
          return { ...medication, custom: !medication.custom };
        }
        return medication;
      });
      return { ...prevFormData, newMedications: updatedNewMedications };
    });
  };
  
  // Function to toggle the custom field
  const toggleCustomField = (index) => {
    setFormData((prevFormData) => {
      const updatedMedications = prevFormData.medications.map((medication, medIndex) => {
        if (medIndex === index) {
          return { ...medication, custom: !medication.custom }; // Toggle the custom field
        }
        return medication;
      });
      return { ...prevFormData, medications: updatedMedications };
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Validation for custom fields
    const validateCustomFields = (medication) => {
        if (medication.custom) {
            return medication.customDosage && medication.customFrequency?.value && medication.customDuration?.value;
        }
        return true;
    };

    // Validate medications and new medications
    const areMedicationsValid = formData.medications.every(validateCustomFields);
    const areNewMedicationsValid = formData.newMedications.every(validateCustomFields);

    if (!areMedicationsValid || !areNewMedicationsValid) {
        alert("Please fill in all required custom fields.");
        setSubmitting(false);
        return;
    }

    try {
        // Prepare payload for regular medications
        const medicationsPayload = formData.medications.map((med) => ({
            _id:med._id,
            medication: med.id,
            quantity: Number(med.quantity),
            startDate: med.startDate,
            endDate: med.endDate,
            current: med.current,
            remove: med.remove || false,
            custom: med.custom,
            customDosage: med.custom ? med.customDosage : undefined,
            customFrequency: med.custom ? med.customFrequency : undefined,
            customDuration: med.custom ? med.customDuration : undefined,
        }));

        // Prepare payload for new medications
        const newMedicationsPayload = formData.newMedications
            .filter((med) => med.id) // Include only medications with an ID
            .map((med) => ({
                medication: med.id,
                quantity: Number(med.quantity) || 1,
                startDate: med.startDate || new Date().toISOString(),
                endDate: med.endDate,
                current: med.current !== undefined ? med.current : true,
                custom: med.custom,
                customDosage: med.custom ? med.customDosage : undefined,
                customFrequency: med.custom ? med.customFrequency : undefined,
                customDuration: med.custom ? med.customDuration : undefined,
            }));

        console.log('Medications Payload:', medicationsPayload);
        console.log('New Medications Payload:', newMedicationsPayload);

        // Send PUT request with medications data
        const response = await api.put(
            `https://medical-api-advo.onrender.com/api/user/hospital/${hospitalId}/users/${userId}`,
            {
                fullName: formData.fullName,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                medications: medicationsPayload,
                newMedications: newMedicationsPayload,
            }
        );

        console.log('Response:', response);

        if (response.status === 200) {
            router.push("/dashboard/user");
        }
    } catch (error) {
        console.error("Error updating user:", error);
    } finally {
        setSubmitting(false);
    }
};

// console.log(formData.medications)

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
                          {userMedication.length === 0
                          ?
                           <h2>User Does Not have any Medication</h2>
                          :
                          formData.medications.filter((medication)=>medication.current === true).map((medication, index) => (   
                            <>
                              <Card key={index} className={medication.remove ? "border-red-500" : ""}>
                                <CardHeader>
                                  <CardTitle className="flex items-center justify-between">
                                    <span className="flex items-center">
                                      <Pill className="mr-2" />
                                      Medication {index + 1}
                                    </span>
                                    {/* Optional: Add a remove button here if you want to remove a medication */}    
                                    <div className="flex items-center space-x-2"> 
                                      <Checkbox
                                        id={`${medication._id}`}
                                        checked={medication.remove}
                                        onCheckedChange={() => toggleMarkedForRemoval(index)}
                                      />
                                      <Label htmlFor={`remove-${medication._id}`} className="text-sm text-muted-foreground">
                                        Mark for removal
                                      </Label>
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
                                        min="1"
                                        type="number"
                                        placeholder="Quantity"
                                        value={medication.quantity}
                                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                                        required
                                      />
                                    </div>

                                    <div>
                                    <Label>Start Date</Label>
                                      <Input
                                        type="datetime-local"
                                        placeholder="Start Date"
                                        value={medication.startDate ? new Date(medication.startDate).toISOString().slice(0, 16):""}
                                        onChange={(e) => handleMedicationDateChange(index, "startDate", e.target.value)}
                                      />
                                    </div>
                                    <div>
                                    <Label>End Date</Label>
                                      <Input
                                        type="datetime-local"
                                        placeholder="End Date"
                                        value={medication.endDate ? new Date(medication.endDate).toISOString().slice(0, 16) : ""}
                                        onChange={(e) => handleMedicationDateChange(index, "endDate", e.target.value)}
                                        disable={true}
                                      />
                                    </div>
                                  </div>
                                  <span>Status: {medication.current ? 
                                    <span className="text-green-600 flex items-center"><CheckCircle className="w-4 h-4 mr-1" />On Current Medication</span> : 
                                    <span className="text-red-600 flex items-center"><XCircle className="w-4 h-4 mr-1" /> Not on Current Medication</span>}
                                  </span>
                                  
                                  {/* Custom Medication */}
                                  <div className="flex items-center gap-2 mt-2">
                                    <Label className="text-sm text-muted-foreground">Custom Medication</Label>
                                    <Checkbox
                                    checked={medication.custom}
                                    onCheckedChange={() => toggleCustomField(index)}
                                  />

                                  </div>
                                {medication.custom &&(
                                  <div className="custom-fields">
                                    <div className="mt-2">
                                        <Label>Custom Dosage</Label>
                                        <Input
                                          placeholder="Custom Dosage"
                                          value={medication.customDosage}
                                          onChange={(e) => handleCustomChange(index, "customDosage", e.target.value)}
                                        />
                                    </div>

                                    <div className="mt-2">
                                      <Label>Custom Frequency</Label>
                                      <div className="flex gap-2">
                                        <Input
                                          placeholder="Custom Frequency"
                                          value={medication.customFrequency.value}
                                          onChange={(e) => handleCustomChange(index, "customFrequency", { ...medication.customFrequency, value: e.target.value })}
                                        />
                                        <Select
                                          value={medication.customFrequency.unit}
                                          onValueChange={(value) => handleCustomChange(index, "customFrequency", { ...medication.customFrequency, unit: value })}
                                        >
                                          <SelectTrigger className="w-[180px]">
                                              <SelectValue placeholder="Hours" />
                                        </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="hours">Hours</SelectItem>
                                            <SelectItem value="days">Days</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>

                                <div className="mt-2 gap-2">
                                  <Label>
                                      Custom Duration
                                  </Label>
              
                                  <div className="flex ">
                                    <Input
                                      placeholder="Custom Duration"
                                      value={medication.customDuration.value}
                                      onChange={(e) => handleCustomChange(index, "customDuration", { ...medication.customDuration, value: e.target.value })}
                                    />
                                    <Select
                                      value={medication.customDuration.unit}
                                      onValueChange={(value) => handleCustomChange(index, "customDuration", { ...medication.customDuration, unit: value })}
                                    >
                                      <SelectTrigger className="w-[180px]">
                                          <SelectValue placeholder="Days" />
                                    </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="days">Days</SelectItem>
                                        <SelectItem value="weeks">Weeks</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                  </div>
                                )}
                                </CardContent>
                              </Card>
                            </>
                          ))
                          
                          }
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
      />
      
      {filteredMedications.length > 0 && activeNewMedicationIndex === index && (
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
          min="1"
          type="number"
          placeholder="Quantity"
          value={medication.quantity}
          onChange={(e) => handleQuantityChange(index, e.target.value, true)}
        />
      </div>

      <div>
        <Label>Start Date</Label>
        <Input
          type="datetime-local"
          placeholder="Start Date"
          value={medication.startDate}
          onChange={(e) => handleMedicationDateChange(index, "startDate", e.target.value, true)}
        />
      </div>
    </div>

    {/* Checkbox for toggling custom fields */}
    <div className="flex gap-2">
      <Checkbox
        checked={medication.custom}
        onCheckedChange={() => toggleNewMedicationCustomField(index)}
      />
      <Label className="text-sm text-muted-foreground">Add Custom Medication</Label>
    </div>

    {/* Render custom fields if custom is true */}
    {medication.custom && (
      <div className="custom-fields grid gap-2">
        <Input
          placeholder="Custom Dosage"
          value={medication.customDosage}
          onChange={(e) => handleCustomChange(index, "customDosage", e.target.value, true)}
        />
        <div>
            <Label>Custom Frequency</Label>
            <div className="flex">

            <Input
              placeholder="Custom Frequency Value"
              value={medication.customFrequency.value}
              onChange={(e) => handleCustomChange(index, "customFrequency", { ...medication.customFrequency, value: e.target.value }, true)}
            />
            <Select
              value={medication.customFrequency.unit}
              onValueChange={(value) => handleCustomChange(index, "customFrequency", { ...medication.customFrequency, unit: value }, true)}
            >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Hours" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
          </SelectContent>
            </Select>
            </div>
        </div>
        <div>
          <Label>
            Custom Duration
          </Label>
            <div className="flex">
              <Input
                placeholder="Custom Duration Value"
                value={medication.customDuration.value}
                onChange={(e) => handleCustomChange(index, "customDuration", { ...medication.customDuration, value: e.target.value }, true)}
              />
              <Select
                value={medication.customDuration.unit}
                onValueChange={(value) => handleCustomChange(index, "customDuration", { ...medication.customDuration, unit: value }, true)}
              >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Days" />
             </SelectTrigger>

                 <SelectContent>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                  </SelectContent>
              </Select>
            </div>
        </div>
      </div>
    )}
  </div>
    ))}

            <Button type="button" onClick={handleAddNewMedication} className="w-full">
              Add New Medication
            </Button>
          </CardContent>
        </Card>
                    </section>
                </div>

                <Button type="submit" className="mt-6" disable={submitting ? true : false}>
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
