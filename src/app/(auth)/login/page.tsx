import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Login to ContractorOS</CardTitle>
                    <CardDescription>Enter your credentials to access your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" required />
                    </div>
                    <div className="space-y-2">
                         <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required />
                    </div>
                     <Button type="submit" className="w-full">
                        Login
                    </Button>
                     <Button variant="outline" className="w-full">
                        Login with Google
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
