"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/auth/auth-context";
import api from "@/app/axios/axiosConfig";
import { Bars } from "react-loader-spinner";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditProductInventory() {
  const router = useRouter();
  const { id } = useParams(); // Retrieve the product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hospitalId = localStorage.getItem("_id"); // Fetch hospital ID from localStorage
        const response = await api.get(
          `https://medical-api-advo.onrender.com/api/medication/${hospitalId}/medications/${id}`
        );
        setProduct(response.data); // Set product data
      } catch (err) {
        setError("Failed to fetch product data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData(e.target);
    const updatedProduct = {
      nameOfDrugs: formData.get("nameOfDrugs"),
      dosage: formData.get("dosage"),
      frequency: formData.get("frequency"),
      time: formData.get("time"),
      notes: formData.get("notes"),
      quantityInStock: parseInt(formData.get("quantityInStock")),
      barcode: formData.get("barcode"),
      price: parseFloat(formData.get("price")),
      expiryDate: formData.get("expiryDate"),
      inStock: formData.get("inStock") === "on",
      reorderLevel: parseInt(formData.get("reorderLevel")),
    };

    try {
      const hospitalId = localStorage.getItem("_id");
      const response = await api.put(
        `https://medical-api-advo.onrender.com/api/medication/${hospitalId}/medications/${id}`,
        updatedProduct
      );
      if (response.status !== 200) {
        throw new Error("Failed to update product");
      }
      router.push("/dashboard/inventory"); // Redirect after success
    } catch (err) {
      // Check specific error messages based on the schema
      if (err.response?.data?.errors) {
        setError(Object.values(err.response.data.errors).map((e) => e.message).join(", "));
      } else {
        setError(err.message || "Failed to update product");
      }
      console.log(err);
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

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

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
              <div className="grid gap-2">
                <Label htmlFor="nameOfDrugs">Name</Label>
                <Input
                  id="nameOfDrugs"
                  name="nameOfDrugs"
                  defaultValue={product?.nameOfDrugs || ""}
                  placeholder="Aspirin"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input id="dosage" name="dosage" defaultValue={product?.dosage || ""} placeholder="100 mg" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Input id="frequency" name="frequency" defaultValue={product?.frequency || ""} placeholder="Daily" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="datetime-local"
                  defaultValue={product?.time ? new Date(product.time).toISOString().slice(0, 16) : ""}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  defaultValue={product?.notes || ""}
                  placeholder="Take after meals"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantityInStock">Quantity in Stock</Label>
                  <Input
                    id="quantityInStock"
                    name="quantityInStock"
                    type="number"
                    defaultValue={product?.quantityInStock || ""}
                    placeholder="50"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input id="barcode" name="barcode" defaultValue={product?.barcode || ""} placeholder="123456789012" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={product?.price || ""}
                    placeholder="10.99"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    type="date"
                    defaultValue={product?.expiryDate ? new Date(product.expiryDate).toISOString().slice(0, 10) : ""}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="inStock">In Stock</Label>
                  <Input id="inStock" name="inStock" type="checkbox" defaultChecked={product?.inStock || false} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reorderLevel">Reorder Level</Label>
                  <Input
                    id="reorderLevel"
                    name="reorderLevel"
                    type="number"
                    defaultValue={product?.reorderLevel || ""}
                    placeholder="10"
                  />
                </div>
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <Bars height={24} width={24} color="#ffffff" ariaLabel="loading-indicator" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
