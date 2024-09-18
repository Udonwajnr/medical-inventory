"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/app/axios/axiosConfig";
import { Skeleton } from "@/components/ui/skeleton";

export default function MedicationDetails() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Retrieve the product ID from URL
  const router = useRouter();

  useEffect(() => {
    const fetchProductData = async () => {
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
    fetchProductData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 md:py-12">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-6 w-3/4 mt-4" />
        <Skeleton className="h-20 w-full mt-8" />
        <Skeleton className="h-16 w-full mt-4" />
        <Skeleton className="h-16 w-full mt-4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 md:py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-6 md:gap-8">
        <div>
          <h1 className="text-2xl font-bold">{product?.nameOfDrugs}</h1>
          <p className="text-muted-foreground">
            Generic Name: {product?.genericName || "Not available"}
          </p>
        </div>
        <div className="grid gap-4">
          <DetailSection title="Dosage Information" content={product?.dosage || "Dosage details not available."} />
          <DetailSection title="Frequency" content={formatFrequency(product?.frequency)} />
          <DetailSection title="Time" content={product?.time ? new Date(product.time).toLocaleTimeString() : "Time details not available."} />
          <DetailSection title="Description" content={product?.notes || "Description not available."} />
          <DetailSection title="Quantity In Stock" content={product?.quantityInStock || "Stock quantity not available."} />
          <DetailSection title="Barcode" content={product?.barcode || "Barcode not available."} />
          <DetailSection title="Price" content={product?.price ? `$${product.price}` : "Price not available."} />
          <DetailSection title="Expiry Date" content={product?.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : "Expiry date not available."} />
          <DetailSection title="In Stock" content={product?.inStock ? "Yes" : "No"} />
          <DetailSection title="Reorder Level" content={product?.reorderLevel || "Reorder level not available."} />
          <DetailSection title="Precautions and Warnings" content={formatList(product?.precautions)} />
          <DetailSection title="Storage Instructions" content={product?.storageInstructions || "Storage instructions not available."} />
        </div>
      </div>
    </div>
  );
}

const DetailSection = ({ title, content }) => (
  <div>
    <h2 className="text-lg font-semibold">{title}</h2>
    <p>{content}</p>
  </div>
);

const formatFrequency = (frequency) => {
  if (!frequency) return "Frequency details not available.";
  return `${frequency.value} ${frequency.unit}`;
};

const formatList = (items) => {
  if (!items || items.length === 0) return "No items listed.";
  return (
    <ul className="grid gap-2">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
};
