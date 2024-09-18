"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/app/auth/auth-context";
import api from "@/app/axios/axiosConfig";
import { Bars } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateMedication() {
  const router = useRouter();
  const { hospitalData } = useAuth();

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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

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
    if (expiryDate <= currentDate) newErrors.expiryDate = "Expiry date must be higher than current year or month";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess('');

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    try {
      await api.post(
        `https://medical-api-advo.onrender.com/api/medication/${hospitalData._id}/medications`,
        medicationData
      );
      setSuccess('Product created successfully!');
      toast.success("Product created successfully!");
      setMedicationData({
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
      router.push("/dashboard/inventory");
    } catch (error) {
      setErrors({ general: error.response?.data?.message || 'Error creating product. Please try again.' });
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
              {errors.general && <div className="text-red-500">{errors.general}</div>}
              <div className="grid gap-2">
                <Label htmlFor="nameOfDrugs">Name</Label>
                <Input
                  id="nameOfDrugs"
                  placeholder="Aspirin"
                  value={medicationData.nameOfDrugs}
                  onChange={handleChange}
                  required
                />
                {errors.nameOfDrugs && <div className="text-red-500">{errors.nameOfDrugs}</div>}
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
                {errors.dosage && <div className="text-red-500">{errors.dosage}</div>}
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
                {errors.dosageForm && <div className="text-red-500">{errors.dosageForm}</div>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dosageAmount">Dosage Amount</Label>
                <Input
                  id="dosageAmount"
                  type="number"
                  placeholder="2"
                  value={medicationData.dosageAmount}
                  onChange={handleChange}
                  min="0" // Ensures non-negative values
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
                    placeholder="6"
                    value={medicationData.frequency.value}
                    onChange={handleChange}
                    min="0" // Ensures non-negative values
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
                  {errors.frequencyUnit && <div className="text-red-500">{errors.frequencyUnit}</div>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="durationValue"
                    type="number"
                    placeholder="5"
                    value={medicationData.duration.value}
                    onChange={handleChange}
                    min="0" // Ensures non-negative values
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
                  {errors.durationUnit && <div className="text-red-500">{errors.durationUnit}</div>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="numberOfUnits">Number of Units</Label>
                <Input
                  id="numberOfUnits"
                  type="number"
                  placeholder="10"
                  value={medicationData.numberOfUnits}
                  onChange={handleChange}
                  min="0" // Ensures non-negative values
                  required
                />
                {errors.numberOfUnits && <div className="text-red-500">{errors.numberOfUnits}</div>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantityInStock">Quantity in Stock</Label>
                <Input
                  id="quantityInStock"
                  type="number"
                  placeholder="50"
                  value={medicationData.quantityInStock}
                  onChange={handleChange}
                  min="0" // Ensures non-negative values
                  required
                />
                {errors.quantityInStock && <div className="text-red-500">{errors.quantityInStock}</div>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="20"
                  value={medicationData.price}
                  onChange={handleChange}
                  min="0" // Ensures non-negative values
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
                  value={medicationData.expiryDate}
                  onChange={handleChange}
                  required
                />
                {errors.expiryDate && <div className="text-red-500">{errors.expiryDate}</div>}
              </div>
              <div className="flex items-center space-x-4">
                <Input
                  id="inStock"
                  type="checkbox"
                  checked={medicationData.inStock}
                  onChange={handleChange}
                />
                <Label htmlFor="inStock">In Stock</Label>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Additional notes"
                  value={medicationData.notes}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  placeholder="123456789"
                  value={medicationData.barcode}
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
                  min="0" // Ensures non-negative values
                />
              </div>
              <Button type="submit" disabled={loading} className="mt-4">
                {loading ? (
                  <Bars
                    height="20"
                    width="20"
                    color="#ffffff"
                    ariaLabel="bars-loading"
                    wrapperClass="flex justify-center items-center"
                  />
                ) : (
                  "Create Product"
                )}
              </Button>
              {success && <div className="text-green-500 mt-4">{success}</div>}
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
