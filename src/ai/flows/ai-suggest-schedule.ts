// src/ai/flows/ai-suggest-schedule.ts
'use server';

/**
 * @fileOverview An AI agent for suggesting optimal tech assignments based on availability and travel time.
 *
 * - aiSuggestSchedule - A function that handles the tech assignment suggestion process.
 * - AiSuggestScheduleInput - The input type for the aiSuggestSchedule function.
 * - AiSuggestScheduleOutput - The return type for the aiSuggestSchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiSuggestScheduleInputSchema = z.object({
  weekRange: z
    .string()
    .describe('The week range for which to suggest the schedule, in ISO format (YYYY-MM-DD/YYYY-MM-DD).'),
  techAvailability: z
    .record(z.string(), z.array(z.object({
      startTime: z.string().describe('Start time in ISO format'),
      endTime: z.string().describe('End time in ISO format'),
    })))
    .describe('A map of tech IDs to their availability for the week.'),
  jobDetails: z.array(z.object({
    jobId: z.string().describe('The ID of the job.'),
    location: z.string().describe('The location of the job.'),
    durationMin: z.number().describe('The duration of the job in minutes.'),
  })).describe('A list of job details including ID, location, and duration.'),
  travelTimeMatrix: z
    .record(z.string(), z.record(z.string(), z.number()))
    .describe('A matrix of travel times between locations in minutes. Indexed by origin and destination.'),
});

export type AiSuggestScheduleInput = z.infer<typeof AiSuggestScheduleInputSchema>;

const AiSuggestScheduleOutputSchema = z.record(z.string(), z.string().nullable()).describe('A map of job IDs to assigned tech IDs.');

export type AiSuggestScheduleOutput = z.infer<typeof AiSuggestScheduleOutputSchema>;

export async function aiSuggestSchedule(input: AiSuggestScheduleInput): Promise<AiSuggestScheduleOutput> {
  return aiSuggestScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSuggestSchedulePrompt',
  input: {schema: AiSuggestScheduleInputSchema},
  output: {schema: AiSuggestScheduleOutputSchema},
  prompt: `You are an AI scheduling assistant for a contracting business. Your goal is to assign jobs to technicians based on their availability, the location of the jobs, and the travel time between jobs.

  Here is the week range for the schedule: {{{weekRange}}}

  Here is the availability of each technician:
  {{#each techAvailability}}
    Technician ID: {{@key}}
    Availability:
    {{#each this}}
      Start Time: {{{startTime}}}, End Time: {{{endTime}}}
    {{/each}}
  {{/each}}

  Here are the job details:
  {{#each jobDetails}}
    Job ID: {{{jobId}}}, Location: {{{location}}}, Duration: {{{durationMin}}} minutes
  {{/each}}

  Here is the travel time matrix:
  {{#each travelTimeMatrix}}
    Origin: {{@key}}
    {{#each this}}
      Destination: {{@key}}, Travel Time: {{{this}}} minutes
    {{/each}}
  {{/each}}

  Based on this information, suggest an optimal schedule by assigning each job to a technician. If a job cannot be assigned, set the technician ID to null.
  Return a JSON object where the keys are job IDs and the values are the assigned technician IDs (or null if unassigned). Adhere to the schema: {{{outputSchema}}}
  Ensure that assignments respect tech availability, minimize travel time, and efficiently utilize technician time.`,
});

const aiSuggestScheduleFlow = ai.defineFlow(
  {
    name: 'aiSuggestScheduleFlow',
    inputSchema: AiSuggestScheduleInputSchema,
    outputSchema: AiSuggestScheduleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
