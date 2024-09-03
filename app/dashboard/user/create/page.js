"use client"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import ContainerLayout from "@/app/components/ContainerLayout"

export default function CreateUser() {
  const [medications, setMedications] = useState([{ id: "", name: "" }])

  // Function to handle adding a new medication field
  const handleAddMedication = () => {
    setMedications([...medications, { id: "", name: "" }])
  }

  // Function to handle removing a medication field
  const handleRemoveMedication = (index) => {
    const newMedications = medications.filter((_, i) => i !== index)
    setMedications(newMedications)
  }

  // Function to handle change in medication fields
  const handleMedicationChange = (index, field, value) => {
    const newMedications = medications.map((medication, i) => {
      if (i === index) {
        return { ...medication, [field]: value }
      }
      return medication
    })
    setMedications(newMedications)
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
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="John Doe" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" type="date" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input id="gender" placeholder="Male/Female/Other" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" placeholder="123-456-7890" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="johndoe@example.com" />
                </div>

                {/* Medication Section */}
                <div className="grid gap-2">
                  <Label>Medications</Label>
                  {medications.map((medication, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="text"
                        placeholder="Medication Name"
                        value={medication.name}
                        onChange={(e) =>
                          handleMedicationChange(index, "name", e.target.value)
                        }
                        required
                      />
                      <Button variant="destructive" onClick={() => handleRemoveMedication(index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={handleAddMedication}>
                    Add Medication
                  </Button>
                </div>

                <Button type="submit">Create User</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
