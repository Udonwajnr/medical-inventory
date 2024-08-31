import React from 'react'
// "use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card"
import DrugInventoryTable from "../../components/DrugInventoryTable"
import ContainerLayout from "@/app/components/ContainerLayout"
import UserTable from '@/app/components/UserTable'

export default function UserManagementDashboard() {
  return (
    <ContainerLayout>
    <div>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {/* Dashboard Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Total Users</CardTitle>
                        <CardDescription>
                            <span className="text-4xl font-bold">1,245</span>
                            <span className="text-muted-foreground">Total registered users</span>
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant="outline">View Users</Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Active Users</CardTitle>
                        <CardDescription>
                            <span className="text-4xl font-bold">876</span>
                            <span className="text-muted-foreground">Users active in the last 7 days</span>
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant="outline">View Activity</Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Pending Approvals</CardTitle>
                        <CardDescription>
                            <span className="text-4xl font-bold">16</span>
                            <span className="text-muted-foreground">Users awaiting approval</span>
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant="outline">Review Approvals</Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Admins</CardTitle>
                        <CardDescription>
                            <span className="text-4xl font-bold">5</span>
                            <span className="text-muted-foreground">Total admin users</span>
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant="outline">Manage Admins</Button>
                    </CardFooter>
                </Card>
                {/* New Cards */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Users with Medications</CardTitle>
                        <CardDescription>
                            <span className="text-4xl font-bold">320</span>
                            <span className="text-muted-foreground">Users currently on medication</span>
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant="outline">View Users</Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Recent Logins</CardTitle>
                        <CardDescription>
                            <span className="text-4xl font-bold">150</span>
                            <span className="text-muted-foreground">Users logged in this week</span>
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant="outline">View Logins</Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle>Inactive Users</CardTitle>
                        <CardDescription>
                            <span className="text-4xl font-bold">60</span>
                            <span className="text-muted-foreground">Users inactive for 30+ days</span>
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button variant="outline">Reactivate Users</Button>
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
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div>
                                        <div className="font-medium">John Doe</div>
                                        <div className="text-sm text-muted-foreground">Registered 2 days ago</div>
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost">
                                    <ExpandIcon className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div>
                                        <div className="font-medium">Jane Smith</div>
                                        <div className="text-sm text-muted-foreground">Registered 4 days ago</div>
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost">
                                    <ExpandIcon className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div>
                                        <div className="font-medium">Michael Brown</div>
                                        <div className="text-sm text-muted-foreground">Registered 5 days ago</div>
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost">
                                    <ExpandIcon className="h-5 w-5" />
                                </Button>
                            </div>
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
</ContainerLayout>

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