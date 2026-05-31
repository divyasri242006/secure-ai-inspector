import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", {
  variants: {
    variant: {
      default: "bg-cyber-blue/15 text-cyber-blue",
      critical: "bg-red-500/20 text-red-300",
      high: "bg-orange-500/20 text-orange-300",
      medium: "bg-yellow-500/20 text-yellow-300",
      low: "bg-green-500/20 text-green-300",
      info: "bg-slate-700 text-slate-200"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
