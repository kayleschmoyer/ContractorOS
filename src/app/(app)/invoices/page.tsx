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

const invoices = [
  { id: "INV-001", customer: "Liam Johnson", job: "Kitchen Remodel", amount: "$1,500.00", dueDate: "2024-08-01", status: "Paid" },
  { id: "INV-002", customer: "Olivia Smith", job: "Bathroom Plumbing", amount: "$350.00", dueDate: "2024-08-05", status: "Pending" },
  { id: "INV-003", customer: "Noah Williams", job: "Full House Repaint", amount: "$5,000.00", dueDate: "2024-07-25", status: "Overdue" },
  { id: "INV-004", customer: "Emma Brown", job: "Garden Landscaping", amount: "$800.00", dueDate: "2024-08-10", status: "Draft" },
  { id: "INV-005", customer: "James Jones", job: "Electrical Wiring", amount: "$1,200.00", dueDate: "2024-08-15", status: "Pending" },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Paid":
      return "default";
    case "Pending":
      return "secondary";
    case "Overdue":
      return "destructive";
    case "Draft":
      return "outline";
    default:
      return "secondary";
  }
};

export default function InvoicesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Invoices</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Management</CardTitle>
          <CardDescription>Track and manage all your invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(invoice.status)}>{invoice.status}</Badge>
                  </TableCell>
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
                        <DropdownMenuItem>View PDF</DropdownMenuItem>
                        <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
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
