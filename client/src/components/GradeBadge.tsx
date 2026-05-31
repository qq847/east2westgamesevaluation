interface GradeBadgeProps {
  grade: string;
  size?: "sm" | "md" | "lg";
}

export default function GradeBadge({ grade, size = "md" }: GradeBadgeProps) {
  const g = (grade || "D").toUpperCase();
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-xl",
    lg: "w-16 h-16 text-3xl",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-lg border-2 flex items-center justify-center font-black tracking-tight grade-${g.toLowerCase()}`}
    >
      {g}
    </div>
  );
}
