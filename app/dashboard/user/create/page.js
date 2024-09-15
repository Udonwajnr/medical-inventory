"use client"
import { useState,useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import api from "@/app/axios/axiosConfig"
import { Bars } from "react-loader-spinner"
export default function CreateUser({ hospitalId }) {
  const router = useRouter()
  const [hospital,setHospital] = useState("")
  useEffect(()=>{
    const hospitalId = localStorage.getItem("_id")
    setHospital(hospitalId)
  },[])
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    email: "",
    medications: [{ name: "" }]
  })

  const [loading, setLoading] = useState(false)

  // Function to handle input change for the form
  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  // Function to handle gender change
  const handleGenderChange = (value) => {
    setFormData((prev) => ({ ...prev, gender: value }))
  }

  // Function to handle adding a new medication field
  const handleAddMedication = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [...prev.medications, { name: "" }]
    }))
  }

  // Function to handle removing a medication field
  const handleRemoveMedication = (index) => {
    const newMedications = formData.medications.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, medications: newMedications }))
  }

  // Function to handle medication field change
  const handleMedicationChange = (index, value) => {
    const newMedications = formData.medications.map((medication, i) =>
      i === index ? { ...medication, name: value } : medication
    )
    setFormData((prev) => ({ ...prev, medications: newMedications }))
  }

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post(
        `https://medical-api-advo.onrender.com/api/user/hospital/${hospital}/users`,
        formData
      )
      console.log("User created:", response.data)

      // Redirect or reset form after successful submission
      router.push("/dashboard/user")
    } catch (error) {
      console.error("Error creating user:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
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
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="text"
                        placeholder="Medication Name"
                        value={medication.name}
                        onChange={(e) =>
                          handleMedicationChange(index, e.target.value)
                        }
                        required
                      />
                      <Button
                        variant="destructive"
                        onClick={() => handleRemoveMedication(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={handleAddMedication}>
                    Add Medication
                  </Button>
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? <Bars color="#ffffff" height={24} width={24} />  : "Create User"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
