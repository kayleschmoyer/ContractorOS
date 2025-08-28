import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, ChevronLeft, ChevronRight } from "lucide-react";
import AiSuggestionForm from "./ai-suggestion-form";
import Image from "next/image";

const techs = [
  { id: "tech_1", name: "Mike L.", avatar: "https://picsum.photos/id/1005/50/50" },
  { id: "tech_2", name: "Sarah J.", avatar: "https://picsum.photos/id/1011/50/50" },
  { id: "tech_3", name: "David C.", avatar: "https://picsum.photos/id/1025/50/50" },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const jobs = [
  { techId: "tech_1", day: "Mon", start: 9, duration: 2, title: "Kitchen Sink Repair" },
  { techId: "tech_2", day: "Mon", start: 10, duration: 3, title: "Fence Installation" },
  { techId: "tech_1", day: "Wed", start: 11, duration: 4, title: "Full Bathroom Remodel" },
  { techId: "tech_3", day: "Thu", start: 13, duration: 3, title: "Exterior Painting" },
  { techId: "tech_2", day: "Fri", start: 9, duration: 1, title: "Roof Inspection" },
];

const timeToPosition = (hour: number) => {
    // 9am is start, so (hour - 9) * heightOfHourSlot
    return (hour - 9) * 4; // assuming each hour is 4rem
}

const durationToHeight = (duration: number) => {
    return duration * 4 - 0.5; // duration * heightOfHourSlot - padding
}

export default function SchedulePage() {
  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Schedule</h1>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
             <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4"/></Button>
             <span className="text-lg font-semibold">July 22-28, 2024</span>
             <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4"/></Button>
           </div>
          <AiSuggestionForm />
        </div>
      </div>
      <div className="flex-grow overflow-x-auto">
        <div className="grid grid-cols-[auto_repeat(5,1fr)] min-w-[800px]">
          <div className="col-start-2 col-span-5 grid grid-cols-5">
            {days.map((day, i) => (
              <div key={day} className="text-center py-2 border-b font-semibold">
                <p>{day}</p>
                <p className="text-sm text-muted-foreground">{22 + i}</p>
              </div>
            ))}
          </div>

          <div className="row-start-2 pr-4 text-right">
             {techs.map(tech => (
                 <div key={tech.id} className="h-32 flex flex-col items-center justify-center border-r">
                       <Image src={tech.avatar} alt={tech.name} className="h-12 w-12 rounded-full mb-1" data-ai-hint="user avatar" width={48} height={48} />
                     <p className="font-medium text-sm">{tech.name}</p>
                 </div>
             ))}
          </div>
          
          <div className="row-start-2 col-start-2 col-span-5 grid grid-cols-5 relative">
              {days.map(day => (
                  <div key={day} className="relative border-r h-full">
                      {techs.map(tech => (
                          <div key={tech.id} className="h-32 border-b"></div>
                      ))}
                  </div>
              ))}
              {/* Job blocks */}
              {jobs.map(job => {
                  const techIndex = techs.findIndex(t => t.id === job.techId);
                  const dayIndex = days.findIndex(d => d === job.day);

                  if (techIndex === -1 || dayIndex === -1) return null;

                  const topOffset = techIndex * 8; // 8rem per tech row (h-32)
                  const leftOffset = dayIndex * 20; // 20% width per day

                  return (
                      <div 
                        key={job.title}
                        className="absolute p-2 rounded-lg bg-primary/20 border border-primary text-primary-foreground"
                        style={{
                            top: `calc(${topOffset}rem + ${timeToPosition(job.start)}rem)`,
                            left: `calc(${leftOffset}% + 0.5rem)`,
                            height: `${durationToHeight(job.duration)}rem`,
                            width: 'calc(20% - 1rem)'
                        }}
                      >
                        <p className="font-bold text-xs text-primary">{job.title}</p>
                      </div>
                  )
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
