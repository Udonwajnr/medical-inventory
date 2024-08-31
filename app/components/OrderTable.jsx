"use client"
import { Table, TableHead,TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
  } from "@/components/ui/card";
import {useState} from "react"

export default function OrderTable() {
    const [sortColumn, setSortColumn] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    
    const orders = [
        {
          id: '1',
          orderNumber: 'ORD001',
          date: '2024-08-25T14:48:00.000Z',
          totalAmount: 150.75,
          status: 'Completed',
        },
        {
          id: '2',
          orderNumber: 'ORD002',
          date: '2024-08-26T09:30:00.000Z',
          totalAmount: 220.40,
          status: 'Pending',
        },
        {
          id: '3',
          orderNumber: 'ORD003',
          date: '2024-08-27T11:15:00.000Z',
          totalAmount: 80.00,
          status: 'Completed',
        },
        {
          id: '4',
          orderNumber: 'ORD004',
          date: '2024-08-28T16:00:00.000Z',
          totalAmount: 340.25,
          status: 'Pending',
        },
        {
          id: '5',
          orderNumber: 'ORD005',
          date: '2024-08-29T12:45:00.000Z',
          totalAmount: 125.50,
          status: 'Completed',
        },
        {
          id: '6',
          orderNumber: 'ORD006',
          date: '2024-08-30T08:00:00.000Z',
          totalAmount: 95.60,
          status: 'Completed',
        },
        {
          id: '7',
          orderNumber: 'ORD007',
          date: '2024-08-31T10:30:00.000Z',
          totalAmount: 200.00,
          status: 'Pending',
        },
        {
          id: '8',
          orderNumber: 'ORD008',
          date: '2024-08-25T15:00:00.000Z',
          totalAmount: 60.25,
          status: 'Completed',
        },
        {
          id: '9',
          orderNumber: 'ORD009',
          date: '2024-08-26T14:00:00.000Z',
          totalAmount: 310.75,
          status: 'Completed',
        },
        {
          id: '10',
          orderNumber: 'ORD010',
          date: '2024-08-27T13:00:00.000Z',
          totalAmount: 180.90,
          status: 'Pending',
        },
      ];


    // Sorting function
    const sortedOrders = orders.sort((a, b) => {
        const orderA = a[sortColumn];
        const orderB = b[sortColumn];
    
        if (sortDirection === "asc") {
          return orderA < orderB ? -1 : 1;
        } else {
          return orderA > orderB ? -1 : 1;
        }
      });

  return (
    <Card className="w-full">
    <CardHeader className="pb-3">
      <CardTitle>Users Orders</CardTitle>
      <CardDescription className="max-w-lg text-balance leading-relaxed">
        View and manage your medication orders.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => {
                setSortColumn("name");
                setSortDirection(
                  sortDirection === "asc" ? "desc" : "asc"
                );
              }}
            >
              Medication{" "}
              {sortColumn === "name" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "\u2191" : "\u2193"}
                </span>
              )}
            </TableHead>
            <TableHead
              className="text-right cursor-pointer"
              onClick={() => {
                setSortColumn("price");
                setSortDirection(
                  sortDirection === "asc" ? "desc" : "asc"
                );
              }}
            >
              Price{" "}
              {sortColumn === "price" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "\u2191" : "\u2193"}
                </span>
              )}
            </TableHead>
            <TableHead
              className="text-right cursor-pointer"
              onClick={() => {
                setSortColumn("quantity");
                setSortDirection(
                  sortDirection === "asc" ? "desc" : "asc"
                );
              }}
            >
              Quantity{" "}
              {sortColumn === "quantity" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "\u2191" : "\u2193"}
                </span>
              )}
            </TableHead>
            <TableHead
              className="text-right cursor-pointer"
              onClick={() => {
                setSortColumn("total");
                setSortDirection(
                  sortDirection === "asc" ? "desc" : "asc"
                );
              }}
            >
              Total{" "}
              {sortColumn === "total" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "\u2191" : "\u2193"}
                </span>
              )}
            </TableHead>
            <TableHead
              className="text-right cursor-pointer"
              onClick={() => {
                setSortColumn("paymentMethod");
                setSortDirection(
                  sortDirection === "asc" ? "desc" : "asc"
                );
              }}
            >
              Payment Method{" "}
              {sortColumn === "paymentMethod" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "\u2191" : "\u2193"}
                </span>
              )}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">
                {order.name}
              </TableCell>
              <TableCell className="text-right">
                ${order.price.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                {order.quantity}
              </TableCell>
              <TableCell className="text-right">
                ${order.total.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                {order.paymentMethod}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>

  );
}
