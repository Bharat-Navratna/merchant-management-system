import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  density?: "compact" | "default" | "spacious";
};

export function Card({
  className,
  density = "default",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-lg text-card-foreground shadow-[0_18px_60px_rgba(0,0,0,0.18)]",
        density === "compact" && "[--card-pad:1rem]",
        density === "default" && "[--card-pad:1.5rem]",
        density === "spacious" && "[--card-pad:1.5rem]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1.5 p-[var(--card-pad,1.5rem)]", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-semibold tracking-tight", className)} {...props} />;
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-[var(--card-pad,1.5rem)] pt-0", className)} {...props} />;
}

