import type { ReactNode } from "react";

export type GithubUser = {
  public_repos: number;
  followers: number;
  following: number;
  created_at: any;
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
};

export type GithubRepo = {
  id: number;
  name:string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  homepage: string | null;
  fork: boolean;
};

export type ProjectMedia = {
  type: 'image' | 'video';
  url: string;
  aiHint?: string;
};

// Unified project type for GitHub repos, custom overrides, and purely custom projects
export type Project = {
  id: number | string;
  name: string;
  description: string | null;
  html_url?: string; // Optional for custom projects
  stargazers_count?: number;
  forks_count?: number;
  language?: string | null;
  topics?: string[];
  homepage?: string | null;
  media?: ProjectMedia[];
  isCustom?: boolean;
  summary?: string;
  languages?: LanguagesData;
  full_name?: string; // Only for GitHub repos
  priority?: number;
};

export type ReadmeData = {
  content: string;
};

export type LanguagesData = {
  [language: string]: number;
};

export type ProjectDetails = {
  summary: string;
  languages: LanguagesData;
};

export interface Skill {
  description?: string;
  name: string;
  icon: ReactNode;
}

export interface Achievement {
  date: any;
  icon: ReactNode;
  title: string;
  description: string;
  link?:string;
  category?: string;
  featured?:boolean;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  technologies?: any;
}
