"use client"
import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import ContainerLayout from "@/app/components/ContainerLayout";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

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

export default function OrderPage() {
  const [sortColumn, setSortColumn] = useState("orderNumber");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortedOrders, setSortedOrders] = useState([]);

  useEffect(() => {
    const formatOrders = orders.map((order) => ({
      ...order,
      formattedDate: format(new Date(order.date), "MM/dd/yyyy"),
    }));

    const sorted = formatOrders.slice().sort((a, b) => {
      const orderA = a[sortColumn];
      const orderB = b[sortColumn];
      if (typeof orderA === "string" && typeof orderB === "string") {
        return sortDirection === "asc" ? orderA.localeCompare(orderB) : orderB.localeCompare(orderA);
      }
      if (sortDirection === "asc") {
        return orderA < orderB ? -1 : 1;
      } else {
        return orderA > orderB ? -1 : 1;
      }
    });

    setSortedOrders(sorted);
  }, [sortColumn, sortDirection]);

  return (
    <>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        {/* Dashboard Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Total Orders</CardTitle>
              <CardDescription>
                <span className="text-4xl font-bold">1,500</span>
                <span className="text-muted-foreground">Total orders placed</span>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline">View Orders</Button>
            </CardFooter>
          </Card>
          {/* Other cards... */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-medium">Order #{order.orderNumber}</div>
                        <div className="text-sm text-muted-foreground">
                          Placed {order.formattedDate}
                        </div>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost">
                      <ExpandIcon className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">View All Orders</Button>
            </CardFooter>
          </Card>
        </div>

        {/* Order Table Component */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle>Order Details</CardTitle>
            <CardDescription>
              Detailed view of all orders with sortable columns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => {
                      setSortColumn("orderNumber");
                      setSortDirection(
                        sortDirection === "asc" ? "desc" : "asc"
                      );
                    }}
                  >
                    Order Number{" "}
                    {sortColumn === "orderNumber" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "\u2191" : "\u2193"}
                      </span>
                    )}
                  </TableHead>
                  <TableHead
                    className="text-right cursor-pointer"
                    onClick={() => {
                      setSortColumn("date");
                      setSortDirection(
                        sortDirection === "asc" ? "desc" : "asc"
                      );
                    }}
                  >
                    Date{" "}
                    {sortColumn === "date" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "\u2191" : "\u2193"}
                      </span>
                    )}
                  </TableHead>
                  <TableHead
                    className="text-right cursor-pointer"
                    onClick={() => {
                      setSortColumn("totalAmount");
                      setSortDirection(
                        sortDirection === "asc" ? "desc" : "asc"
                      );
                    }}
                  >
                    Total Amount{" "}
                    {sortColumn === "totalAmount" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "\u2191" : "\u2193"}
                      </span>
                    )}
                  </TableHead>
                  <TableHead
                    className="text-right cursor-pointer"
                    onClick={() => {
                      setSortColumn("status");
                      setSortDirection(
                        sortDirection === "asc" ? "desc" : "asc"
                      );
                    }}
                  >
                    Status{" "}
                    {sortColumn === "status" && (
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
                      {order.orderNumber}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.formattedDate}
                    </TableCell>
                    <TableCell className="text-right">
                      ${order.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  );
}

function ExpandIcon(props) {
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
      <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" />
      <path d="M3 16.2V21m0 0h4.8M3 21l6-6" />
      <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" />
      <path d="M3 7.8V3m0 0h4.8M3 3l6 6" />
    </svg>
  );
}
