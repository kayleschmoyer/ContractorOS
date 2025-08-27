import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const customers = [
  { id: "cus_1", name: "Liam Johnson", email: "liam@example.com", jobs: 5, totalSpent: "$2,500.00" },
  { id: "cus_2", name: "Olivia Smith", email: "olivia@example.com", jobs: 2, totalSpent: "$1,500.00" },
  { id: "cus_3", name: "Noah Williams", email: "noah@example.com", jobs: 8, totalSpent: "$10,000.00" },
  { id: "cus_4", name: "Emma Brown", email: "emma@example.com", jobs: 1, totalSpent: "$300.00" },
  { id: "cus_5", name: "James Jones", email: "james@example.com", jobs: 3, totalSpent: "$750.00" },
];

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Customers</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Overview</CardTitle>
          <CardDescription>Manage your customers and view their history.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Jobs</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-muted-foreground">{customer.email}</div>
                  </TableCell>
                  <TableCell>{customer.jobs}</TableCell>
                  <TableCell>{customer.totalSpent}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
