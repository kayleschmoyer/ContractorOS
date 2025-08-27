"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Wand2, Loader2 } from "lucide-react";
import { aiSuggestSchedule, type AiSuggestScheduleInput, type AiSuggestScheduleOutput } from "@/ai/flows/ai-suggest-schedule";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const exampleInput: AiSuggestScheduleInput = {
    weekRange: '2024-07-22/2024-07-28',
    techAvailability: {
        'tech_123': [{ startTime: '2024-07-22T08:00:00Z', endTime: '2024-07-22T17:00:00Z' }],
        'tech_456': [{ startTime: '2024-07-23T09:00:00Z', endTime: '2024-07-23T18:00:00Z' }],
    },
    jobDetails: [
        { jobId: 'job_abc', location: '123 Main St', durationMin: 120 },
        { jobId: 'job_def', location: '456 Oak Ave', durationMin: 180 },
    ],
    travelTimeMatrix: {
        '123 Main St': { '456 Oak Ave': 30 },
        '456 Oak Ave': { '123 Main St': 30 },
    },
};

export default function AiSuggestionForm() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiSuggestScheduleOutput | null>(null);
  const { toast } = useToast();
  
  const [inputData, setInputData] = useState({
      weekRange: exampleInput.weekRange,
      techAvailability: JSON.stringify(exampleInput.techAvailability, null, 2),
      jobDetails: JSON.stringify(exampleInput.jobDetails, null, 2),
      travelTimeMatrix: JSON.stringify(exampleInput.travelTimeMatrix, null, 2),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setInputData({ ...inputData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
        const parsedInput: AiSuggestScheduleInput = {
            weekRange: inputData.weekRange,
            techAvailability: JSON.parse(inputData.techAvailability),
            jobDetails: JSON.parse(inputData.jobDetails),
            travelTimeMatrix: JSON.parse(inputData.travelTimeMatrix),
        };

        const suggestion = await aiSuggestSchedule(parsedInput);
        setResult(suggestion);

    } catch (error) {
      console.error("AI suggestion failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get AI suggestion. Please check if the input JSON is valid.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Wand2 className="mr-2 h-4 w-4" />
          AI Suggest
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline">AI Schedule Assistant</DialogTitle>
          <DialogDescription>
            Provide scheduling constraints and let AI suggest optimal tech assignments.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-4">
            <form id="ai-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="techAvailability">Technician Availability (JSON)</Label>
                    <Textarea id="techAvailability" name="techAvailability" value={inputData.techAvailability} onChange={handleInputChange} className="h-48 font-code" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="jobDetails">Job Details (JSON)</Label>
                    <Textarea id="jobDetails" name="jobDetails" value={inputData.jobDetails} onChange={handleInputChange} className="h-48 font-code" />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="travelTimeMatrix">Travel Time Matrix (JSON)</Label>
                    <Textarea id="travelTimeMatrix" name="travelTimeMatrix" value={inputData.travelTimeMatrix} onChange={handleInputChange} className="h-32 font-code" />
                </div>
                {result && (
                    <div className="md:col-span-2">
                        <h3 className="font-semibold mb-2">Suggested Assignments:</h3>
                        <Card>
                            <CardContent className="p-4">
                                <pre className="font-code text-sm bg-muted p-4 rounded-md overflow-x-auto">
                                    {JSON.stringify(result, null, 2)}
                                </pre>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </form>
        </div>
        <DialogFooter>
          <Button type="submit" form="ai-form" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Generate Suggestion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
