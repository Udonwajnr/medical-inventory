"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "@/components/ui/pagination"
import ContainerLayout from "@/app/components/ContainerLayout"
import Link from "next/link"
export default function InventoryTable() {
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const medications = [
    {
      id: 1,
      name: "Amoxicillin",
      dosage: "500mg",
      type: "Antibiotic",
      frequency: "Twice daily",
      instructions: "Take with food",
    },
    {
      id: 2,
      name: "Ibuprofen",
      dosage: "200mg",
      type: "Anti-inflammatory",
      frequency: "Every 6 hours as needed",
      instructions: "Do not exceed 800mg per day",
    },
    {
      id: 3,
      name: "Metformin",
      dosage: "500mg",
      type: "Antidiabetic",
      frequency: "Twice daily",
      instructions: "Take with meals",
    },
    {
      id: 4,
      name: "Atorvastatin",
      dosage: "10mg",
      type: "Cholesterol-lowering",
      frequency: "Once daily",
      instructions: "Take at the same time each day",
    },
    {
      id: 5,
      name: "Lisinopril",
      dosage: "20mg",
      type: "Blood pressure medication",
      frequency: "Once daily",
      instructions: "Take in the morning",
    },
    {
      id: 6,
      name: "Sertraline",
      dosage: "50mg",
      type: "Antidepressant",
      frequency: "Once daily",
      instructions: "Take with or without food",
    },
    {
      id: 7,
      name: "Levothyroxine",
      dosage: "100mcg",
      type: "Thyroid medication",
      frequency: "Once daily",
      instructions: "Take on an empty stomach",
    },
    {
      id: 8,
      name: "Omeprazole",
      dosage: "20mg",
      type: "Proton pump inhibitor",
      frequency: "Once daily",
      instructions: "Take 30 minutes before a meal",
    },
    {
      id: 9,
      name: "Metoprolol",
      dosage: "50mg",
      type: "Beta blocker",
      frequency: "Twice daily",
      instructions: "Take with food",
    },
    {
      id: 10,
      name: "Acetaminophen",
      dosage: "325mg",
      type: "Pain reliever",
      frequency: "Every 4-6 hours as needed",
      instructions: "Do not exceed 3,000mg per day",
    },
  ]
  const filteredMedications = medications.filter((medication) =>
    medication.name.toLowerCase().includes(search.toLowerCase()),
  )
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentMedications = filteredMedications.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredMedications.length / itemsPerPage)
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }
  return (
    <ContainerLayout>
        <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Inventory Table</h1>
            <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Search medications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg bg-muted/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            </div>
        </div>
        <div className="overflow-auto border rounded-lg">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Instructions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {currentMedications.map((medication) => (
                <TableRow key={medication.id}>
                      <TableCell className="font-medium">
                      <Link href="/dashboard/inventory/product-detail/test">
                        {medication.name}
                      </Link>
                      </TableCell>
                  
                      <TableCell>
                      <Link href="/dashboard/inventory/product-detail/test">
                        {medication.dosage}
                      </Link>
                        </TableCell>
                      <TableCell>
                        <Link href="/dashboard/inventory/product-detail/test">
                        {medication.type}
                      </Link>
                        </TableCell>

                      <TableCell>
                        <Link href="/dashboard/inventory/product-detail/test">
                          {medication.frequency}
                        </Link>  
                      </TableCell>
                      <TableCell>
                        <Link href="/dashboard/inventory/product-detail/test">
                        {medication.instructions}
                        </Link>  
                      </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
        <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstItem + 1} to {indexOfLastItem} of {filteredMedications.length} medications
            </div>
            <Pagination>
            <PaginationContent>
                <PaginationItem>
                <PaginationPrevious
                    href="#"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                    <PaginationLink
                    href="#"
                    onClick={() => handlePageChange(pageNumber)}
                    isActive={pageNumber === currentPage}
                    >
                    {pageNumber}
                    </PaginationLink>
                </PaginationItem>
                ))}
                <PaginationItem>
                <PaginationNext
                    href="#"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                />
                </PaginationItem>
            </PaginationContent>
            </Pagination>
        </div>
        </div>
    </ContainerLayout>
  )
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}