# Personal Portfolio

A modern, performant, and accessible personal portfolio built with Next.js 13, Radix UI, and Tailwind CSS. This project showcases my work, blog posts, and technical skills, and serves as a platform to share my thoughts and projects with the world.

## 🚀 Features

- **Next.js 13 App Router**: Utilizes the latest Next.js features for fast, scalable, and SEO-friendly pages.
- **Radix UI Primitives**: Accessible and customizable UI components.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Dark Mode**: Seamless theme switching with `next-themes`.
- **Lucide Icons**: Beautiful, open-source icon set.
- **Blog & Projects**: Dynamic routing for blog posts and project pages, including view tracking and analytics.
- **SEO Optimized**: Advanced SEO configuration for better discoverability.
- **Open Graph Images**: Dynamic OG image generation for social sharing.
- **Analytics**: Google Analytics integration and custom blog analytics.
- **Automatic Import & Tailwind Class Sorting**: Prettier plugins for consistent code style.
- **BaseHub Integration**: Content management powered by [BaseHub](https://basehub.com/) for managing blog posts and projects directly from a headless CMS, enabling real-time content updates without redeploying the site.

## 🛠️ Tech Stack

- [Next.js 13](https://nextjs.org/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Drizzle ORM](https://orm.drizzle.team/) (for database access)
- [BaseHub](https://basehub.com/) (headless CMS for content management)
- [TypeScript](https://www.typescriptlang.org/)
- [pnpm](https://pnpm.io/) (package manager)

## 📁 Folder Structure

```
app/            # Application routes and pages
components/     # Reusable UI components
lib/            # Utility functions and helpers
hooks/          # Custom React hooks
db/             # Database schema and access
public/         # Static assets (images, icons, etc.)
```

## ⚡ Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/whoisjayd/personal-portfolio.git
   cd personal-portfolio
   ```
2. **Install dependencies:**
   ```bash
   pnpm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in the required values (database, analytics, etc.).
   - **BaseHub Setup:**
     - Create a project on [BaseHub](https://basehub.com/) and define your content models (e.g., Blog, Projects).
     - Obtain your BaseHub API key and project ID.
     - Add `BASEHUB_API_KEY` and `BASEHUB_PROJECT_ID` to your `.env` file.
4. **Run the development server:**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📝 Usage

- **Home**: Introduction, featured projects, and latest blog posts.
- **Blog**: Technical articles, tutorials, and personal thoughts. Blog content is managed via BaseHub and updates in real time.
- **Projects**: Portfolio of selected projects with details and links, also managed via BaseHub.
- **View Tracking**: Blog and project views are tracked and displayed.
- **SEO & Social Sharing**: Optimized metadata and OG images for sharing.
- **Content Management**: Update blog posts and projects from BaseHub without redeploying the site.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or suggestions.

## 📄 License

This project is licensed under the [MIT License](https://github.com/whoisjayd/personal-portfolio/blob/main/LICENSE).

---

> Built and maintained by [whoisjayd](https://github.com/whoisjayd)
