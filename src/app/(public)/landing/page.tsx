import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
            <h1 className="font-headline text-5xl md:text-7xl font-bold mb-4">
                Welcome to ContractorOS
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
                The all-in-one platform to manage your jobs, scheduling, invoicing, and payments, built for the modern contractor.
            </p>
            <div className="flex gap-4">
                <Button asChild size="lg">
                    <Link href="/dashboard">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                    <Link href="#">Learn More</Link>
                </Button>
            </div>
        </div>
    )
}
