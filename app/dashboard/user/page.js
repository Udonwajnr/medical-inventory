"use client"
import React from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card"
import DrugInventoryTable from "../../components/DrugInventoryTable"
import ContainerLayout from "@/app/components/ContainerLayout"
import UserTable from '@/app/components/UserTable'
import { useEffect,useState } from 'react'
import api from '@/app/axios/axiosConfig'

export default function UserDashboard() {
    const [hospital, setHospital] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    async function fetchUsers() {
      try {
        const hospitalId = localStorage.getItem("_id")
        const response = await api.get(`https://medical-api-advo.onrender.com/api/hospital/${hospitalId}`);
        setHospital(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, []);

  console.log(hospital)
  return (
    <>
    <div>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {/* Dashboard Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Total Users</CardTitle>
                        <CardDescription>
                            <span className="text-4xl font-bold">{hospital?.users?.length || 0}</span>
                            <span className="text-muted-foreground">Total Users</span>
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant="outline">View Users</Button>
                    </CardFooter>
                </Card>
    
                {/* <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Admins</CardTitle>
                        <CardDescription>
                            <span className="text-4xl font-bold">0</span>
                            <span className="text-muted-foreground">Total admin users</span>
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant="outline">Manage Admins</Button>
                    </CardFooter>
                </Card> */}
                {/* New Cards */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Users with Medications</CardTitle>
                        <CardDescription>
                            <span className="text-4xl font-bold">{hospital?.users?.[0]?.medication?.length}</span>
                            <span className="text-muted-foreground">Users currently on medication</span>
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant="outline">View Users</Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Users with Custom Medications Regimen</CardTitle>
                        <CardDescription>
                            <span className="text-4xl font-bold">{hospital?.userSpecificMedicationRegimen?.length||0}</span>
                            <span className="text-muted-foreground">Total Users with Custom Medications Regimen</span>
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant="outline">View Users with Regimen</Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Recently Registered Users and User Table */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Recently Registered Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            {hospital?.users?.slice(0,4)?.map((user)=>{
                        return(
                            <div key={user._id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div>
                                        <div className="font-medium">{user.fullName}</div>
                                        <div className="text-sm text-muted-foreground">{user.created}</div>
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost">
                                    <ExpandIcon className="h-5 w-5" />
                                </Button>
                            </div>) 
                            })}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline">View All Users</Button>
                    </CardFooter>
                </Card>
                {/* User Table Component */}
                <UserTable />
            </div>
        </main>
    </div>
</>

  )
}

function ExpandIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" />
        <path d="M3 16.2V21m0 0h4.8M3 21l6-6" />
        <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" />
        <path d="M3 7.8V3m0 0h4.8M3 3l6 6" />
      </svg>
    )
  }