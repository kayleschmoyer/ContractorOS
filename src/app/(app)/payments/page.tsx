import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-headline text-3xl font-bold">Payments</h1>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Payment processing and tracking features are under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
