import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        neutral: "border-transparent bg-muted text-muted-foreground",
        success: "border-transparent bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
        warning: "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        destructive: "border-transparent bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
        info: "border-transparent bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
