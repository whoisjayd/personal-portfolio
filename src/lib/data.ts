import React from 'react';
import {
    Cpu,
    Database,
    Code,
    Codepen,
    Pointer,
    BarChart,
    Rocket,
    Share2,
    Zap,
    GitBranch,
    Server,
    Award,
    Star,
    Component,
    Container,
    Network,
  } from "lucide-react";
import type { Achievement, Experience, Skill, Project } from './types';

  
export const customSkills: Skill[] = [
    // Programming Languages
    { name: "Python", icon: React.createElement(Cpu, { className: "h-5 w-5 text-accent" }) },
    { name: "JavaScript", icon: React.createElement(Code, { className: "h-5 w-5 text-accent" }) },
    { name: "SQL", icon: React.createElement(Database, { className: "h-5 w-5 text-accent" }) },
    { name: "HTML/CSS", icon: React.createElement(Codepen, { className: "h-5 w-5 text-accent" }) },
  
    // Web Development & Frameworks
    { name: "Flask", icon: React.createElement(Server, { className: "h-5 w-5 text-accent" }) },
    { name: "FastAPI", icon: React.createElement(Rocket, { className: "h-5 w-5 text-accent" }) },
    { name: "Bootstrap", icon: React.createElement(Component, { className: "h-5 w-5 text-accent" }) },
    { name: "Chart.js", icon: React.createElement(BarChart, { className: "h-5 w-5 text-accent" }) },
  
    // Web Scraping & Automation
    { name: "Scrapy", icon: React.createElement(Network, { className: "h-5 w-5 text-accent" }) },
    { name: "Selenium", icon: React.createElement(Pointer, { className: "h-5 w-5 text-accent" }) },
  
    // Databases & Cloud
    { name: "MongoDB", icon: React.createElement(Database, { className: "h-5 w-5 text-accent" }) },
  
    // Tools & DevOps
    { name: "Docker", icon: React.createElement(Container, { className: "h-5 w-5 text-accent" }) },
    { name: "Git", icon: React.createElement(GitBranch, { className: "h-5 w-5 text-accent" }) },
  
    // Network & Communication
    { name: "REST APIs", icon: React.createElement(Share2, { className: "h-5 w-5 text-accent" }) },
    { name: "WebSockets", icon: React.createElement(Zap, { className: "h-5 w-5 text-accent" }) },
  ];
  

// Updated with specific achievements from the resumes.
export const achievements: Achievement[] = [
    { 
        icon: React.createElement(Award, { className: "text-primary" }), 
        title: "Teknofest 2024 Finalist", 
        description: "Ranked 9th among over 100 international teams in the Model Satellite Competition held in Turkey.",
        date: 'September 2024',
        link:'https://drive.google.com/file/d/1dMDAadEzdYpUXZIoc8hYWNfudpT7McH5/view'
    },
    { 
        icon: React.createElement(Award, { className: "text-primary" }), 
        title: "Flipkart Grid 5.0 National Finalist", 
        description: "Achieved National Finalist status, placing in the Top 10 among more than 80 teams in the Robotics Challenge.",
        date: 'January 2024',
        link:'https://drive.google.com/file/d/1V8OLyjEm5rKcZEVwYj7V6OfO7c_Ijy7B/view'
    },
    { 
        icon: React.createElement(Award, { className: "text-primary" }), 
        title: "CanSat India 2022 Runner-Up", 
        description: "Secured 2nd place among over 50 teams in the model satellite competition organized by ASI and ISRO.",
        date: 'December 2023',
    },
];

// Updated with leadership roles from the resumes instead of generic work experience.
export const experience: Experience[] = [
    {
      role: "Project Intern",
      company: "Elipsis Infotech",
      period: "May 2025 - June 2025",
      description: "Successfully completed a project-based internship by developing a functional proof of concept (PoC) for a centralized AC Control system. The solution enabled the remote control of multiple air conditioners within a workspace through a single interface, allowing efficient switching on/off operations. This significantly reduced manual effort, time, and energy consumption."
    },  
    {
        role: "Mentor, Team Dyaus",
        company: "SAE, Nirma University",
        period: "October 2024 - Present",
        description: "Mentoring over 15 team members in troubleshooting hardware and software issues, developing strategic competition approaches, and participating in recruitment."
    },
    {
        role: "Vice-Captain, Team Dyaus",
        company: "SAE, Nirma University",
        period: "April 2024 - September 2024",
        description: "Managed a 20-member team for international competitions, coordinated timelines and task allocation, and handled internal budget allocation."
    },
];

/**
 * A list of repository names to exclude from the projects list.
 * This is useful for hiding forks, private work, or irrelevant projects.
 */
export const excludedRepos: string[] = [
    'whoisjayd',
    'teknofest-model-satellite-gui',
    'Bank-Management-System',
    'personal-portfolio'
];

/**
 * Use this section to add custom projects or enhance projects fetched from GitHub.
 * - To enhance a GitHub project: use the exact 'name' of the repo. The 'id' and 'isCustom' fields are not needed.
 *   You can add 'priority' (lower numbers appear first), and 'media' for carousels.
 * - To create a new custom project: use a unique 'id', set 'isCustom: true', and provide all necessary project details.
 */
export const projectOverrides: Partial<Project>[] = [
    {
        // This ENHANCES a real GitHub repo by adding a media carousel and priority.
        name: 'Finance-Manager',
        priority: 2,
        media: [
            { type: 'video', url: 'https://res.cloudinary.com/dx9ctc074/video/upload/v1750612468/xjnwfyagyptuyalparfk.mp4', aiHint: 'dashboard' },
            { type: 'image', url: 'https://i.imgur.com/H33MA9W.png', aiHint: 'dashboard' },
            { type: 'image', url: 'https://i.imgur.com/PNjjy0O.png', aiHint: 'dashboard' },
            { type: 'image', url: 'https://i.imgur.com/uw27TSC.png', aiHint: 'dashboard' },
            { type: 'image', url: 'https://i.imgur.com/UGsW3AV.png', aiHint: 'dashboard' },
           ]
        
    },
    {
        name: 'gitresume',
        priority: 1,
        media: [
            { type: 'video', url: 'https://res.cloudinary.com/dx9ctc074/video/upload/v1750616473/xir6vohwthjuybosq3wh.mp4', aiHint: 'dashboard' },
            { type: 'image', url: 'https://i.imgur.com/F9Xz8cs.png', aiHint: 'dashboard' },
           ]
    }
    // {
    //     // This is a completely CUSTOM project that doesn't exist on GitHub.
    //     id: 'custom-video-project',
    //     name: 'Interactive Data Visualization',
    //     description: 'A showcase of interactive data visualizations built with D3.js, featuring a short video demonstration of complex animations and user interactions.',
    //     isCustom: true, // Mark as a purely custom project
    //     html_url: '#', 
    //     homepage: '#',
    //     priority: 3,
    //     media: [
    //         { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    //         { type: 'image', url: 'https://placehold.co/600x400.png', aiHint: 'data visualization' }
    //     ],
    //     stargazers_count: 123,
    //     forks_count: 45,
    //     language: 'JavaScript',
    //     topics: ['d3js', 'data-visualization', 'animation'],
    // },
];
