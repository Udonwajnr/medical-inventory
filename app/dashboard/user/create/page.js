import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import ContainerLayout from "@/app/components/ContainerLayout"

export default function CreateUser() {
  return (
        <ContainerLayout>
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
          <Button type="submit">Create User</Button>
        </form>
      </CardContent>
    </Card>
  </div>
            </main>
        </ContainerLayout>
  )
}
