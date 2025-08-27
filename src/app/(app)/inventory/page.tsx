import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-headline text-3xl font-bold">Inventory</h1>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Inventory management features are under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
