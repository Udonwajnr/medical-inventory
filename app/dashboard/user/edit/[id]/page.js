import React from 'react'
import ContainerLayout from '@/app/components/ContainerLayout'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu"

export default function EditUser() {
  return (
    <ContainerLayout>
      <main className="flex-1 overflow-auto p-6">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Edit User</CardTitle>
              <CardDescription>Update the details of the user below.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" placeholder="John" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" placeholder="Doe" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" placeholder="john.doe@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" type="tel" defaultValue="+1234567890" placeholder="+1234567890" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" defaultValue="123 Main St, Springfield" placeholder="123 Main St, Springfield" rows={3} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Input id="role" defaultValue="Admin" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Select Role</DropdownMenuLabel>
                      <DropdownMenuItem>Admin</DropdownMenuItem>
                      <DropdownMenuItem>User</DropdownMenuItem>
                      <DropdownMenuItem>Editor</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Account Status</Label>
                  <Input id="status" type="checkbox" defaultChecked={true} />
                  <span>Active</span>
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </ContainerLayout>
  )
}
