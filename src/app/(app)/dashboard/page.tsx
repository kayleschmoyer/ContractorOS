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
import { ArrowUp, Briefcase, Calendar, Clock, DollarSign, Users } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+23</div>
            <p className="text-xs text-muted-foreground">
              +3 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">2 completed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Jobs</CardTitle>
            <CardDescription>Jobs scheduled for the next 7 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Job</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Olivia Martin</TableCell>
                  <TableCell>Kitchen Remodel</TableCell>
                  <TableCell>2024-07-25</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jackson Lee</TableCell>
                  <TableCell>Bathroom Plumbing</TableCell>
                  <TableCell>2024-07-26</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Isabella Nguyen</TableCell>
                  <TableCell>Full House Repaint</TableCell>
                  <TableCell>2024-07-28</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across your company.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-start gap-4">
               <Clock className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground"/>
               <div>
                  <div>Job #1024 marked as <Badge variant="secondary">Completed</Badge> by Mike Johnson.</div>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
               </div>
             </div>
             <div className="flex items-start gap-4">
               <DollarSign className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground"/>
               <div>
                  <p>Payment of $2,500 received for Invoice #INV-0512.</p>
                  <p className="text-sm text-muted-foreground">4 hours ago</p>
               </div>
             </div>
             <div className="flex items-start gap-4">
               <Users className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground"/>
               <div>
                  <p>New customer 'Evergreen Properties' added.</p>
                  <p className="text-sm text-muted-foreground">1 day ago</p>
               </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
