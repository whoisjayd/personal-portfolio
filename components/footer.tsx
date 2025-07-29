'use client';
import Anchor from '@/app/(home)/anchor';

export default function Footer() {
  return (
    <footer className="mt-auto">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="bg-background/95 px-4 py-4 border-t border-border/10">
        <div className="mx-auto max-w-5xl">
                    <div className="flex flex-col items-center justify-center text-sm text-muted-foreground gap-4">
            {/* Social links */}
            <div className="flex items-center flex-wrap justify-center gap-2">
              <Anchor
                href="https://x.com/JaydeepS14216"
                target="_blank"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                𝕏
              </Anchor>
              <span>·</span>

              <Anchor
                href="https://github.com/whoisjayd"
                target="_blank"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                GitHub
              </Anchor>
              <span>·</span>
              <Anchor
                href="https://linkedin.com/in/solanki-jaydeep"
                target="_blank"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                LinkedIn
              </Anchor>
              <span>·</span>
              <Anchor
                href="https://peerlist.io/jaydeepsolanki"
                target="_blank"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Peerlist
              </Anchor>
              <span>·</span>
              <Anchor
                href="mailto:hello@jaydeepsolanki.me"
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                hello@jaydeepsolanki.me
              </Anchor>
            </div>

            {/* Calendly and copyright
            <div className="flex items-center justify-center gap-2">
              <OpenToOpportunities variant="footer" />
              <span>·</span>
              <span>© {new Date().getFullYear()}</span>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}