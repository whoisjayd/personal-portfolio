"use server";

import { summarizeProject } from "@/ai/flows/summarize-project";
import type { GithubRepo, GithubUser, LanguagesData, ProjectDetails, ReadmeData } from "@/lib/types";
import { excludedRepos } from "@/lib/data";

// --- Configuration ---
// It's best practice to use environment variables for configuration.
// Create a .env.local file in your project root and add these variables.
// Example .env.local:
// GITHUB_USERNAME=whoisjayd
// GITHUB_TOKEN=your_personal_access_token_here

const GITHUB_API_URL = "https://api.github.com";
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// --- Centralized API Fetcher ---
/**
 * A reusable fetcher for the GitHub API.
 * Handles authentication, headers, and Next.js caching automatically.
 * @param path The API endpoint path (e.g., /users/whoisjayd)
 * @returns The JSON response from the API.
 * @throws An error if the fetch fails or the response is not ok.
 */
async function githubApiFetcher<T>(path: string): Promise<T> {
    if (!GITHUB_USERNAME) {
        throw new Error("GITHUB_USERNAME environment variable is not set.");
    }
    
    const headers: HeadersInit = {
        "Accept": "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
    };

    if (GITHUB_TOKEN) {
        headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
    }

    const response = await fetch(`${GITHUB_API_URL}${path}`, {
        headers,
        next: { revalidate: 3600 } // Revalidate every hour
    });

    if (!response.ok) {
        // Provide more context in the error message
        const errorText = await response.text();
        throw new Error(`GitHub API request failed for path: ${path}. Status: ${response.status}. Message: ${errorText}`);
    }

    return response.json() as Promise<T>;
}

// --- Public API Functions ---

export async function getUserProfile(): Promise<GithubUser | null> {
    try {
        return await githubApiFetcher<GithubUser>(`/users/${GITHUB_USERNAME}`);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}

export async function getRepositories(): Promise<GithubRepo[]> {
    try {
        const allRepos: GithubRepo[] = [];
        let page = 1;
        let keepFetching = true;

        while (keepFetching) {
            const repos = await githubApiFetcher<GithubRepo[]>(`/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=100&page=${page}`);
            
            if (repos.length > 0) {
                allRepos.push(...repos);
                page++;
            } else {
                keepFetching = false;
            }
        }

        // Filter out forked repositories and those in the exclusion list
        return allRepos
            .filter(repo => !repo.fork)
            .filter(repo => !excludedRepos.includes(repo.name));
            
    } catch (error) {
        console.error("Error fetching repositories:", error);
        return [];
    }
}

async function fetchAndDecodeReadme(repoFullName: string): Promise<string | null> {
    try {
        const readmeData = await githubApiFetcher<ReadmeData>(`/repos/${repoFullName}/readme`);
        return Buffer.from(readmeData.content, 'base64').toString('utf-8');
    } catch (error) {
        // It's common for a repo to not have a README, so we handle this gracefully.
        // The fetcher will throw an error on a 404, which we catch here.
        console.warn(`Could not fetch README for ${repoFullName}. It might not exist.`);
        return null;
    }
}

async function fetchLanguages(repoFullName: string): Promise<LanguagesData> {
    try {
        return await githubApiFetcher<LanguagesData>(`/repos/${repoFullName}/languages`);
    } catch (error) {
        console.error(`Error fetching languages for ${repoFullName}:`, error);
        return {};
    }
}

export async function getRepository(repoName: string): Promise<GithubRepo | null> {
    try {
        const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
        if (!GITHUB_USERNAME) {
            throw new Error("GITHUB_USERNAME environment variable is not set.");
        }
        return await githubApiFetcher<GithubRepo>(`/repos/${GITHUB_USERNAME}/${repoName}`);
    } catch (error) {
        console.error(`Error fetching repository ${repoName}:`, error);
        return null;
    }
}

export async function getProjectDetails(repo: Pick<GithubRepo, 'full_name' | 'name' | 'description' | 'topics'>): Promise<ProjectDetails> {
    try {
        const [readmeContent, languages] = await Promise.all([
            fetchAndDecodeReadme(repo.full_name),
            fetchLanguages(repo.full_name)
        ]);

        // Truncate README to avoid sending massive text to the AI, which saves costs and improves speed.
        // A 4000-character limit is a good starting point.
        const truncatedReadme = readmeContent ? readmeContent.slice(0, 4000) : "No README found.";

        const summaryResult = await summarizeProject({
            name: repo.name,
            description: repo.description || "No description available.",
            readmeContent: truncatedReadme,
            languages: Object.keys(languages),
            topics: repo.topics || []
        });

        return {
            summary: summaryResult.summary,
            languages: languages
        };
    } catch (error) {
        console.error(`Error getting project details for ${repo.name}:`, error);
        return {
            summary: "Could not generate summary for this project.",
            languages: {}
        };
    }
}

/**
 * Calculates aggregate language statistics across a user's repositories.
 * @param repos - Optional. An array of repositories to avoid re-fetching.
 * @returns An object mapping language names to total bytes.
 */
export async function getLanguageStats(repos?: GithubRepo[]): Promise<LanguagesData> {
    try {
        const repositories = repos || await getRepositories();
        const languagePromises = repositories.map(repo => fetchLanguages(repo.full_name));
        const languageResults = await Promise.all(languagePromises);

        // Use reduce for a more concise and functional approach to aggregation.
        return languageResults.reduce((totalStats, repoLangs) => {
            for (const [lang, bytes] of Object.entries(repoLangs)) {
                totalStats[lang] = (totalStats[lang] || 0) + bytes;
            }
            return totalStats;
        }, {} as LanguagesData);

    } catch (error) {
        console.error("Error fetching language stats:", error);
        return {};
    }
}
