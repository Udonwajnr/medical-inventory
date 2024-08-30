import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import ContainerLayout from "@/app/components/ContainerLayout"

export default function CreateProduct() {
  return (
        <ContainerLayout>
            <main className="flex-1 overflow-auto p-6">
            <div className="grid gap-6">
                <Card>
                <CardHeader>
                    <CardTitle>Create Product</CardTitle>
                    <CardDescription>Fill out the form to add a new product to your store.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="nameOfDrugs">Name</Label>
                        <Input id="nameOfDrugs" placeholder="Aspirin" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="dosage">Dosage</Label>
                        <Input id="dosage" placeholder="100 mg" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="frequency">Frequency</Label>
                        <Input id="frequency" placeholder="Daily" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="time">Time</Label>
                        <Input id="time" type="datetime-local" placeholder="2024-08-28T09:00:00" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" placeholder="Take after meals" rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                        <Label htmlFor="quantityInStock">Quantity in Stock</Label>
                        <Input id="quantityInStock" type="number" placeholder="50" />
                        </div>
                        <div className="grid gap-2">
                        <Label htmlFor="barcode">Barcode</Label>
                        <Input id="barcode" placeholder="123456789012" />
                        </div>
                        <div className="grid gap-2">
                        <Label htmlFor="price">Price</Label>
                        <Input id="price" type="number" step="0.01" placeholder="10.99" />
                        </div>
                        <div className="grid gap-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input id="expiryDate" type="date" placeholder="2025-12-31" />
                        </div>
                        <div className="grid gap-2">
                        <Label htmlFor="inStock">In Stock</Label>
                        <Input id="inStock" type="checkbox" />
                        </div>
                        <div className="grid gap-2">
                        <Label htmlFor="reorderLevel">Reorder Level</Label>
                        <Input id="reorderLevel" type="number" placeholder="10" />
                        </div>
                    </div>
                    <Button type="submit">Create Product</Button>
                    </form>
                </CardContent>
                </Card>
            </div>
            </main>
        </ContainerLayout>
  )
}
