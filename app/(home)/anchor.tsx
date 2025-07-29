import { HTMLProps, PropsWithChildren } from "react"

import { cn } from "@/lib/utils"

type Props = PropsWithChildren & HTMLProps<HTMLAnchorElement>

export default function Anchor({ children, ...props }: Props) {
  return (
    <a
      className={cn(
        "text-foreground/80 underline decoration-foreground/50 decoration-[0.5px] underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground/80",
        props.className
      )}
      {...props}
    >
      {children}
    </a>
  )
}
