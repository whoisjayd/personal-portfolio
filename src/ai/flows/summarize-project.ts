// Summarize Project Flow
'use server';
/**
 * @fileOverview Summarizes a GitHub project using AI.
 *
 * - summarizeProject - A function that generates a project summary.
 * - SummarizeProjectInput - The input type for the summarizeProject function.
 * - SummarizeProjectOutput - The return type for the summarizeProject function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeProjectInputSchema = z.object({
  name: z.string().describe('The name of the project.'),
  description: z.string().describe('The description of the project.'),
  readmeContent: z.string().describe('The content of the project README file.'),
  languages: z.array(z.string()).describe('The languages used in the project.'),
  topics: z.array(z.string()).describe('The topics associated with the project.'),
});
export type SummarizeProjectInput = z.infer<typeof SummarizeProjectInputSchema>;

const SummarizeProjectOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the project.'),
});
export type SummarizeProjectOutput = z.infer<typeof SummarizeProjectOutputSchema>;

export async function summarizeProject(input: SummarizeProjectInput): Promise<SummarizeProjectOutput> {
  return summarizeProjectFlow(input);
}

const summarizeProjectPrompt = ai.definePrompt({
  name: 'summarizeProjectPrompt',
  input: {schema: SummarizeProjectInputSchema},
  output: {schema: SummarizeProjectOutputSchema},
  prompt: `You are an AI expert in generating high-quality, concise, and informative summaries of GitHub repositories.

Your task is to analyze the given project metadata and README content to write a compelling 10-12 sentence detailed structred summary. This summary should be suitable for use in developer portfolios, project showcases, or discovery platforms.

Your summary must be:
- Clear and concise, avoiding jargon or repetition.
- Professional yet approachable in tone.
- Focused on the value and uniqueness of the project.

The summary should highlight the following:
1. **What the project does** — Describe its core functionality or purpose.
2. **Why it’s useful or unique** — Mention features, innovations, or intended use cases.
3. **Technologies used** — Include relevant programming languages, frameworks, or tools.
4. **Relevant insights** — Incorporate key points from the README content and topic tags, such as how to use the project, noteworthy design decisions, or developer focus.

Avoid:
- Overly technical explanations that reduce readability.
- Copying raw sentences from the README.
- Listing technologies without context.
- Generic or template phrases like "This repository contains..."

Use natural language that communicates what makes the project stand out.

Input:
- Project Name: {{name}}
- GitHub Description: {{description}}
- README Content: {{readmeContent}}
- Languages Used: {{#each languages}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Topics/Tags: {{#each topics}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Output:
Summary: [Your concise summary here]`,
});

const summarizeProjectFlow = ai.defineFlow(
  {
    name: 'summarizeProjectFlow',
    inputSchema: SummarizeProjectInputSchema,
    outputSchema: SummarizeProjectOutputSchema,
  },
  async (input: any) => {
    const {output} = await summarizeProjectPrompt(input);
    return output!;
  }
);
