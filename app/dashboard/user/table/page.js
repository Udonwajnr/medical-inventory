"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "@/components/ui/pagination"
import ContainerLayout from "@/app/components/ContainerLayout"
import Link from "next/link"

export default function UsersTable() {
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  const users = [
    { id: 1, fullName: "John Doe", dateOfBirth: "1990-01-01", gender: "Male", phoneNumber: "123-456-7890", email: "johndoe@example.com" },
    { id: 2, fullName: "Jane Smith", dateOfBirth: "1985-05-10", gender: "Female", phoneNumber: "987-654-3210", email: "janesmith@example.com" },
    { id: 3, fullName: "Michael Brown", dateOfBirth: "1978-09-23", gender: "Male", phoneNumber: "555-555-5555", email: "michaelbrown@example.com" },
    { id: 4, fullName: "Emily Johnson", dateOfBirth: "1995-12-15", gender: "Female", phoneNumber: "123-789-4560", email: "emilyjohnson@example.com" },
    { id: 5, fullName: "Daniel Williams", dateOfBirth: "1988-02-14", gender: "Male", phoneNumber: "789-123-4560", email: "danielwilliams@example.com" },
    { id: 6, fullName: "Emma Wilson", dateOfBirth: "1993-07-22", gender: "Female", phoneNumber: "456-789-1230", email: "emmawilson@example.com" },
    { id: 7, fullName: "Olivia Taylor", dateOfBirth: "1992-03-30", gender: "Female", phoneNumber: "321-654-9870", email: "oliviataylor@example.com" },
    { id: 8, fullName: "Sophia Martinez", dateOfBirth: "1989-11-07", gender: "Female", phoneNumber: "654-321-7890", email: "sophiamartinez@example.com" },
    { id: 9, fullName: "James Anderson", dateOfBirth: "1984-04-19", gender: "Male", phoneNumber: "111-222-3333", email: "jamesanderson@example.com" },
    { id: 10, fullName: "Charlotte Thomas", dateOfBirth: "1991-06-08", gender: "Female", phoneNumber: "444-555-6666", email: "charlottethomas@example.com" },
  ]
  
  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(search.toLowerCase()),
  )
  const indexOfLastUser = currentPage * itemsPerPage
  const indexOfFirstUser = indexOfLastUser - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <ContainerLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Users Table</h1>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search users..."
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
                <TableHead>Full Name</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <Link href={`/dashboard/user/${user.id}`}>
                      {user.fullName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/user/${user.id}`}>
                      {user.dateOfBirth}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/user/${user.id}`}>
                      {user.gender}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/user/${user.id}`}>
                      {user.phoneNumber}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/user/${user.id}`}>
                      {user.email}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstUser + 1} to {indexOfLastUser} of {filteredUsers.length} users
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
