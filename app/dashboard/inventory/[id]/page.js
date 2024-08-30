import React from 'react'
import ContainerLayout from '@/app/components/ContainerLayout'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function EditProduct() {
  return (
    <ContainerLayout>
        <main className="flex-1 overflow-auto p-6">
  <div className="grid gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Edit Product</CardTitle>
        <CardDescription>Update the details of the product below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="nameOfDrugs">Name</Label>
            <Input id="nameOfDrugs" defaultValue="Aspirin" placeholder="Aspirin" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dosage">Dosage</Label>
            <Input id="dosage" defaultValue="100 mg" placeholder="100 mg" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Input id="frequency" defaultValue="Daily" placeholder="Daily" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="time">Time</Label>
            <Input id="time" type="datetime-local" defaultValue="2024-08-28T09:00:00" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" defaultValue="Take after meals" placeholder="Take after meals" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="quantityInStock">Quantity in Stock</Label>
              <Input id="quantityInStock" type="number" defaultValue="50" placeholder="50" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input id="barcode" defaultValue="123456789012" placeholder="123456789012" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" step="0.01" defaultValue="10.99" placeholder="10.99" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input id="expiryDate" type="date" defaultValue="2025-12-31" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="inStock">In Stock</Label>
              <Input id="inStock" type="checkbox" defaultChecked={true} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reorderLevel">Reorder Level</Label>
              <Input id="reorderLevel" type="number" defaultValue="10" placeholder="10" />
            </div>
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
