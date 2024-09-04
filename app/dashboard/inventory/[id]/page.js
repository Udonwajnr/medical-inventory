"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/app/axios/axiosConfig";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Retrieve the product ID from URL
  const router = useRouter();

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
    <>
      <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="grid gap-6 md:gap-8">
          <div>
            <h1 className="text-2xl font-bold">{product?.nameOfDrugs}</h1>
            <p className="text-muted-foreground">Generic Name: {product?.genericName}</p>
          </div>
          <div className="grid gap-4">
            <div>
              <h2 className="text-lg font-semibold">Dosage Information</h2>
              <p>{product?.dosage || "Dosage details not available."}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Frequency</h2>
              <p>{product?.frequency || "Frequency details not available."}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Time</h2>
              <p>{product?.time ? new Date(product.time).toLocaleTimeString() : "Time details not available."}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Description</h2>
              <p>{product?.notes || "Description not available."}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Quantity In Stock</h2>
              <p>{product?.quantityInStock || "Stock quantity not available."}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Barcode</h2>
              <p>{product?.barcode || "Barcode not available."}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Price</h2>
              <p>{product?.price ? `$${product.price}` : "Price not available."}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Expiry Date</h2>
              <p>{product?.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : "Expiry date not available."}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">In Stock</h2>
              <p>{product?.inStock ? "Yes" : "No"}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Reorder Level</h2>
              <p>{product?.reorderLevel || "Reorder level not available."}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Precautions and Warnings</h2>
              <ul className="grid gap-2">
                {product?.precautions?.length > 0 ? (
                  product.precautions.map((precaution, index) => (
                    <li key={index}>{precaution}</li>
                  ))
                ) : (
                  <li>No precautions listed.</li>
                )}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Storage Instructions</h2>
              <p>{product?.storageInstructions || "Storage instructions not available."}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
