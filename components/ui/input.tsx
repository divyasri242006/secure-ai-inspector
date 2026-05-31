import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md border border-borderSubtle bg-panelSoft px-3 py-2 text-sm text-slate-100 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
