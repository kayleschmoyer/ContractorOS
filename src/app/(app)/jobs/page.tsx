import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const jobStatuses = ["Scheduled", "In-Progress", "Invoiced", "Paid"];

const jobsByStatus = {
  Scheduled: [
    { id: 1, title: "Kitchen Sink Repair", customer: "Alice Johnson", priority: "High" },
    { id: 2, title: "Fence Installation", customer: "Bob Williams", priority: "Medium" },
  ],
  "In-Progress": [
    { id: 3, title: "Full Bathroom Remodel", customer: "Charlie Brown", priority: "High" },
  ],
  Invoiced: [
    { id: 4, title: "Exterior Painting", customer: "Diana Prince", priority: "Low" },
  ],
  Paid: [
    { id: 5, title: "Roof Inspection", customer: "Ethan Hunt", priority: "Medium" },
  ]
};

const JobCard = ({ job }: { job: { id: number; title: string; customer: string; priority: string; }}) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-start justify-between pb-2">
      <CardTitle className="text-base font-medium">{job.title}</CardTitle>
      <Badge variant={job.priority === "High" ? "destructive" : "secondary"}>{job.priority}</Badge>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">{job.customer}</p>
    </CardContent>
    <CardFooter className="flex justify-between items-center">
        <div className="flex -space-x-2">
            <Avatar className="h-8 w-8 border-2 border-card">
                <AvatarImage src="https://picsum.photos/50" data-ai-hint="user avatar"/>
                <AvatarFallback>JD</AvatarFallback>
            </Avatar>
             <Avatar className="h-8 w-8 border-2 border-card">
                <AvatarImage src="https://picsum.photos/51" data-ai-hint="user avatar"/>
                <AvatarFallback>SA</AvatarFallback>
            </Avatar>
        </div>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <MoreHorizontal className="h-4 w-4"/>
      </Button>
    </CardFooter>
  </Card>
);

export default function JobsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Jobs</h1>
        <Button asChild>
          <Link href="/jobs/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Job
          </Link>
        </Button>
      </div>
      <Tabs defaultValue="Scheduled" className="flex-grow">
        <TabsList className="grid w-full grid-cols-4">
          {jobStatuses.map((status) => (
            <TabsTrigger key={status} value={status}>{status}</TabsTrigger>
          ))}
        </TabsList>
        {jobStatuses.map((status) => (
          <TabsContent key={status} value={status}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
              {jobsByStatus[status as keyof typeof jobsByStatus].map(job => (
                <JobCard key={job.id} job={job}/>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
