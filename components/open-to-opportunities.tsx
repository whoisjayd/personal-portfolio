'use client';

interface OpenToOpportunitiesProps {
  variant?: 'default' | 'footer' | 'inline';
}

export default function OpenToOpportunities({
  variant = 'default'
}: OpenToOpportunitiesProps) {
  const openCalendly = () => {
    window.open('https://calendly.com/contactjaydeepsolanki/30min', '_blank');
  };

  if (variant === 'footer') {
    return (
      <button
        onClick={openCalendly}
        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent/5 hover:bg-accent/10 border border-border/50 hover:border-border/70 text-foreground/80 hover:text-foreground transition-colors cursor-pointer">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-xs font-medium">book a call</span>
      </button>
    );
  }

  if (variant === 'inline') {
    return (
      <button
        onClick={openCalendly}
        className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-xs font-medium underline decoration-dotted underline-offset-2 hover:decoration-solid">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        <span>open to opportunities</span>
      </button>
    );
  }

  return (
    <div className="mt-3">
      <button
        onClick={openCalendly}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/5 hover:bg-accent/10 border border-border/50 hover:border-border/70 text-foreground/80 hover:text-foreground transition-colors cursor-pointer">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium">book a call</span>
      </button>
    </div>
  );
}
