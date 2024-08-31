"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "@/components/ui/pagination"
import ContainerLayout from "@/app/components/ContainerLayout"

export default function SearchUserTable() {
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Admin",
      status: "Active",
      joined: "2023-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "User",
      status: "Inactive",
      joined: "2023-02-10",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      role: "User",
      status: "Active",
      joined: "2023-03-05",
    },
    // Add more user data here
  ]
  
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  )
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <ContainerLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Management</h1>
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>{user.joined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstItem + 1} to {indexOfLastItem} of {filteredUsers.length} users
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
