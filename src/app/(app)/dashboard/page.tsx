
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
import { Briefcase, Calendar, DollarSign, Users } from "lucide-react";
import { getCompanyMetrics, getUpcomingJobs, getRecentActivity } from "@/lib/firebase-admin";
import { format } from "date-fns";
import { ChartConfig } from "@/components/ui/chart"
import { RevenueChart } from "./revenue-chart";


async function DashboardPage() {
  const companyId = 'demo-co'; // Hardcoded for now
  const metrics = await getCompanyMetrics(companyId);
  const upcomingJobs = await getUpcomingJobs(companyId);
  const recentActivity = await getRecentActivity(companyId);
  
  const chartData = [
    { date: "2024-07-20", revenue: 1200 },
    { date: "2024-07-21", revenue: 1500 },
    { date: "2024-07-22", revenue: 800 },
    { date: "2024-07-23", revenue: 2200 },
    { date: "2024-07-24", revenue: 1800 },
    { date: "2024-07-25", revenue: 3000 },
    { date: "2024-07-26", revenue: metrics.revenueLast7d },
  ];

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">7-Day Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.revenueLast7d.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all paid invoices
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{metrics.activeJobs}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled or in-progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Invoices</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.unpaidInvoices}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingJobs.filter(j => format(j.scheduledAt, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')).length}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Revenue from the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart chartData={chartData} chartConfig={chartConfig} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Jobs</CardTitle>
            <CardDescription>Jobs scheduled for the next 7 days.</CardDescription>
          </CardHeader>
          <CardContent>
             {upcomingJobs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Job</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingJobs.map(job => (
                       <TableRow key={job.id}>
                         <TableCell>{job.customerName}</TableCell>
                         <TableCell>{job.title}</TableCell>
                         <TableCell>{format(job.scheduledAt, "MMM d")}</TableCell>
                       </TableRow>
                    ))}
                  </TableBody>
                </Table>
             ) : (
                <p className="text-sm text-muted-foreground">No upcoming jobs.</p>
             )}
          </CardContent>
        </Card>

      </div>
       <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across your company.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map(activity => (
                 <div key={activity.id} className="flex items-start gap-4">
                   <div className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground">
                    {activity.type === 'payment' ? <DollarSign/> : <Briefcase/>}
                   </div>
                   <div>
                      <div>{activity.description}</div>
                      <p className="text-sm text-muted-foreground">{format(activity.createdAt, "MMMM d, yyyy 'at' h:mm a")}</p>
                   </div>
                 </div>
            ))}
          </CardContent>
        </Card>
    </div>
  );
}

export default DashboardPage;
