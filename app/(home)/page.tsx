import Link from "next/link"

import BlogList from "@/components/blog/blog-list"
import LocationTime from "@/components/location-time"
import OpenToOpportunities from "@/components/open-to-opportunities"
import ProjectList from "@/components/projects/project-list"
import TechStack from "@/components/techstack"
import Anchor from "@/app/(home)/anchor"

export const revalidate = 30

export default function Home() {
  return (
    <main className="mb-4 text-muted-foreground/90">
      <h1 className='text-sm font-medium text-foreground slide-in-from-top-2 [font-feature-setting:"kern","calt","case"] motion-safe:fade-in'>
        Jaydeep Solanki
      </h1>
      <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
        <LocationTime />
        <OpenToOpportunities variant="inline" />
      </div>

      <section className="mt-6">
        <p>
          I&apos;m a final year student persuing ece from{" "}
          <Anchor href="https://nirmauni.ac.in/" target="_blank">
            nirma universtiy
          </Anchor>{" "}
          passionate about backend engineering, developer tooling, and scalable systems. I enjoy
          building fast, reliable APIs and integrating AI into real-world applications.
        </p>
        <p className="mt-4">
          I&apos;m currently looking for full-time opportunities in backend engineering or developer
          tooling. If you&apos;re interested in collaborating or have an opportunity, feel free to{" "}
          <Anchor href="mailto:contactjaydeepsolanki@gmail.com">reach out via email</Anchor> or{" "}
          <Anchor
            href="https://drive.google.com/file/d/108nUGvWXJ92D4yhXbDyhxdgSqm9iOftB/view"
            target="_blank"
          >
            view my resume
          </Anchor>
          .
        </p>
      </section>

      <section className="mt-12">
        <h2 className="mt-12 text-foreground">about me</h2>
        <p className="mt-2">
          I started coding at 16, curious about how things work behind the scenes. Python was my
          first real introduction to programming, and building my first backend with flask during
          school made me realize how much I enjoy designing systems that actually solve problems.
        </p>
        <p className="mt-4">
          Since then, I&apos;ve been focused on backend development — crafting clean APIs,
          optimizing performance, and making applications reliable and scalable. There&apos;s
          something satisfying about building the invisible backbone of a product that just works,
          no matter the load.
        </p>
      </section>

      <section className="mt-12">
        <Link href="/projects">
          <h2 className="text-foreground">projects</h2>
        </Link>
        <p className="mt-2">
          A few projects I&apos;ve built, contributed to, or am still working on (sometimes
          procrastinating).
        </p>
        <div className="py-4">
          <ProjectList length={3} compact />
        </div>
        <Anchor href="/projects">all projects →</Anchor>
      </section>

      <section className="mt-12">
        <Link href="/blog">
          <h2 className="text-foreground">blogs</h2>
        </Link>
        <p className="mt-2">
          I write about things I&apos;m learning, my experiences and thoughts on design and
          technology.
        </p>
        <div className="py-4">
          <BlogList length={3} compact />
        </div>
        <Anchor href="/blog">all blogs →</Anchor>
      </section>

      <section className="mt-12">
        <h2 className="text-foreground mb-1">tech stack</h2>
        <p className="text-xs mb-2">Here are some of the technologies I work with regularly.</p>
        <TechStack />
      </section>
    </main>
  )
}
