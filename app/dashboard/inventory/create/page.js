"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/app/auth/auth-context";
import api from "@/app/axios/axiosConfig";
import { Bars } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import { toast } from "sonner"


export default function CreateProduct() {
  const router = useRouter();
  const { hospitalData } = useAuth();

  const [medicationData, setMedicationData] = useState({
    nameOfDrugs: '',
    dosage: '',
    dosageForm: '',
    dosageAmount: '',
    frequency: '',
    duration: '',
    numberOfUnits: '',
    notes: '',
    quantityInStock: '',
    barcode: '',
    price: '',
    expiryDate: '',
    inStock: false,
    reorderLevel: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setMedicationData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate expiry date
    const currentDate = new Date();
    const expiryDate = new Date(medicationData.expiryDate);

    if (expiryDate <= currentDate) {
      setError('Expiry date must be in the future.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(
        `https://medical-api-advo.onrender.com/api/medication/${hospitalData._id}/medications`, 
        medicationData
      );
      setSuccess('Product created successfully!');
      toast("Product created successfully!")
      setMedicationData({
        nameOfDrugs: '',
        dosage: '',
        dosageForm: '',
        dosageAmount: '',
        frequency: '',
        duration: '',
        numberOfUnits: '',
        notes: '',
        quantityInStock: '',
        barcode: '',
        price: '',
        expiryDate: '',
        inStock: false,
        reorderLevel: ''
      });
      window.location.href = "/dashboard/inventory";
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Product</CardTitle>
            <CardDescription>Fill out the form to add a new product to your inventory.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="nameOfDrugs">Name</Label>
                <Input
                  id="nameOfDrugs"
                  placeholder="Aspirin"
                  value={medicationData.nameOfDrugs}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  placeholder="100 mg"
                  value={medicationData.dosage}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dosageForm">Dosage Form</Label>
                <Input
                  id="dosageForm"
                  placeholder="Tablet"
                  value={medicationData.dosageForm}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dosageAmount">Dosage Amount</Label>
                <Input
                  id="dosageAmount"
                  type="number"
                  placeholder="2"
                  value={medicationData.dosageAmount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Input
                  id="frequency"
                  placeholder="Every 6 hours"
                  value={medicationData.frequency}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="5 days"
                  value={medicationData.duration}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="numberOfUnits">Number of Units</Label>
                <Input
                  id="numberOfUnits"
                  type="number"
                  placeholder="30"
                  value={medicationData.numberOfUnits}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Take with a full glass of water"
                  rows={3}
                  value={medicationData.notes}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantityInStock">Quantity in Stock</Label>
                  <Input
                    id="quantityInStock"
                    type="number"
                    placeholder="50"
                    value={medicationData.quantityInStock}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    placeholder="123456789012"
                    value={medicationData.barcode}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="10.99"
                    value={medicationData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={medicationData.expiryDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="inStock">In Stock</Label>
                  <Input
                    id="inStock"
                    type="checkbox"
                    checked={medicationData.inStock}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reorderLevel">Reorder Level</Label>
                  <Input
                    id="reorderLevel"
                    type="number"
                    placeholder="10"
                    value={medicationData.reorderLevel}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? <Bars color="#ffffff" height={24} width={24} /> : "Create Product"}
              </Button>
            </form>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && <p className="text-green-500 mt-4">{success}</p>}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
