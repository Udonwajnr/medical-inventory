"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";
import { Bars } from "react-loader-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import api from "@/app/axios/axiosConfig";
import { useRouter, useParams } from "next/navigation";

export default function EditProductInventory() {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [medicationData, setMedicationData] = useState({
    nameOfDrugs: '',
    dosage: '',
    dosageForm: '',
    dosageAmount: '',
    frequency: { value: '', unit: 'hours' },
    duration: { value: '', unit: 'days' },
    numberOfUnits: '',
    notes: '',
    quantityInStock: '',
    barcode: '',
    price: '',
    expiryDate: '',
    inStock: false,
    reorderLevel: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hospitalId = localStorage.getItem("_id");
        const response = await api.get(
          `https://medical-api-advo.onrender.com/api/medication/${hospitalId}/medications/${id}`
        );
        setProduct(response.data);
        setMedicationData({
          ...response.data,
          frequency: { value: response.data.frequency.value, unit: response.data.frequency.unit },
          duration: { value: response.data.duration.value, unit: response.data.duration.unit }
        });
      } catch (err) {
        toast.error("Failed to fetch product data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    if (id.includes('frequency') || id.includes('duration')) {
      const [field, subField] = id.split(/(?=[A-Z])/);
      setMedicationData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [subField.toLowerCase()]: value
        }
      }));
    } else {
      setMedicationData((prev) => ({
        ...prev,
        [id]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!medicationData.nameOfDrugs) newErrors.nameOfDrugs = "Name is required.";
    if (!medicationData.dosage) newErrors.dosage = "Dosage is required.";
    if (!medicationData.dosageForm) newErrors.dosageForm = "Dosage form is required.";
    if (medicationData.dosageAmount <= 0 || isNaN(medicationData.dosageAmount)) newErrors.dosageAmount = "Dosage amount must be a positive number.";
    if (medicationData.frequency.value <= 0 || isNaN(medicationData.frequency.value)) newErrors.frequencyValue = "Frequency value must be a positive number.";
    if (medicationData.duration.value <= 0 || isNaN(medicationData.duration.value)) newErrors.durationValue = "Duration value must be a positive number.";
    if (medicationData.numberOfUnits <= 0 || isNaN(medicationData.numberOfUnits)) newErrors.numberOfUnits = "Number of units must be a positive number.";
    if (medicationData.quantityInStock <= 0 || isNaN(medicationData.quantityInStock)) newErrors.quantityInStock = "Quantity in stock must be a positive number.";
    if (medicationData.price <= 0 || isNaN(medicationData.price)) newErrors.price = "Price must be a positive number.";
    if (!medicationData.expiryDate) newErrors.expiryDate = "Expiry date is required.";

    // Check if expiryDate is in the future
    const currentDate = new Date();
    const expiryDate = new Date(medicationData.expiryDate);
    if (expiryDate <= currentDate) newErrors.expiryDate = "Expiry date must be in the future.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setSaving(false);
      return;
    }

    try {
      const hospitalId = localStorage.getItem("_id");
      await api.put(
        `https://medical-api-advo.onrender.com/api/medication/${hospitalId}/medications/${id}`,
        medicationData
      );
      toast.success("Medication updated successfully!");
      router.push("/dashboard/inventory");
    } catch (error) {
      setErrors({ general: error.response?.data?.message || 'Error updating product. Please try again.' });
      toast.error('Failed to update product');
      console.log(error)
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-10 mb-4" />
        <Skeleton className="h-5 mb-4" />
        <Skeleton className="h-5 mb-4" />
        <Skeleton className="h-10 mb-4" />
      </div>
    );
  }
  const hospitalId = localStorage.getItem("_id");
  console.log(hospitalId)

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Product</CardTitle>
            <CardDescription>Update the details of the product below.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              {errors.general && <div className="text-red-500">{errors.general}</div>}
              <div className="grid gap-2">
                <Label htmlFor="nameOfDrugs">Name</Label>
                <Input
                  id="nameOfDrugs"
                  value={medicationData.nameOfDrugs}
                  onChange={handleChange}
                  placeholder="Aspirin"
                  required
                />
                {errors.nameOfDrugs && <div className="text-red-500">{errors.nameOfDrugs}</div>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  value={medicationData.dosage}
                  onChange={handleChange}
                  placeholder="100 mg"
                  required
                />
                {errors.dosage && <div className="text-red-500">{errors.dosage}</div>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dosageForm">Dosage Form</Label>
                <Input
                  id="dosageForm"
                  value={medicationData.dosageForm}
                  onChange={handleChange}
                  placeholder="Tablet"
                  required
                />
                {errors.dosageForm && <div className="text-red-500">{errors.dosageForm}</div>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dosageAmount">Dosage Amount</Label>
                <Input
                  id="dosageAmount"
                  type="number"
                  value={medicationData.dosageAmount}
                  onChange={handleChange}
                  placeholder="2"
                  min="0"
                  required
                />
                {errors.dosageAmount && <div className="text-red-500">{errors.dosageAmount}</div>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="frequency">Frequency</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="frequencyValue"
                    type="number"
                    value={medicationData.frequency.value}
                    onChange={handleChange}
                    placeholder="6"
                    min="0"
                    required
                  />
                  {errors.frequencyValue && <div className="text-red-500">{errors.frequencyValue}</div>}
                  <Select
                    value={medicationData.frequency.unit}
                    onValueChange={(value) => handleChange({ target: { id: 'frequencyUnit', value } })}
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
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="durationValue"
                    type="number"
                    value={medicationData.duration.value}
                    onChange={handleChange}
                    placeholder="7"
                    min="0"
                    required
                  />
                  {errors.durationValue && <div className="text-red-500">{errors.durationValue}</div>}
                  <Select
                    value={medicationData.duration.unit}
                    onValueChange={(value) => handleChange({ target: { id: 'durationUnit', value } })}
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
              <div className="grid gap-2">
                <Label htmlFor="numberOfUnits">Number of Units</Label>
                <Input
                  id="numberOfUnits"
                  type="number"
                  value={medicationData.numberOfUnits}
                  onChange={handleChange}
                  placeholder="30"
                  min="0"
                  required
                />
                {errors.numberOfUnits && <div className="text-red-500">{errors.numberOfUnits}</div>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantityInStock">Quantity in Stock</Label>
                <Input
                  id="quantityInStock"
                  type="number"
                  value={medicationData.quantityInStock}
                  onChange={handleChange}
                  placeholder="100"
                  min="0"
                  required
                />
                {errors.quantityInStock && <div className="text-red-500">{errors.quantityInStock}</div>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  value={medicationData.barcode}
                  onChange={handleChange}
                  placeholder="1234567890123"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={medicationData.price}
                  onChange={handleChange}
                  placeholder="50"
                  min="0"
                  step=".01"
                  required
                />
                {errors.price && <div className="text-red-500">{errors.price}</div>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={medicationData?.expiryDate ? new Date(medicationData?.expiryDate).toISOString().slice(0, 10) : "" }
                  onChange={handleChange}
                  required
                />
                {errors.expiryDate && <div className="text-red-500">{errors.expiryDate}</div>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={medicationData.notes}
                  onChange={handleChange}
                  placeholder="Any additional notes"
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
              <div className="grid gap-4">
                <Button type="submit" disabled={saving}>
                  {saving ? <Bars width="24" color="#fff" /> : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
