import { useMemo } from "react";

interface RadarChartProps {
  scores: {
    label: string;
    value: number; // 0-100
    color?: string;
  }[];
  size?: number;
}

export default function RadarChart({ scores, size = 280 }: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.38;
  const levels = 5;

  const points = useMemo(() => {
    const n = scores.length;
    return scores.map((s, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const r = (s.value / 100) * radius;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
        labelX: center + (radius + 24) * Math.cos(angle),
        labelY: center + (radius + 24) * Math.sin(angle),
        ...s,
      };
    });
  }, [scores, center, radius]);

  const polygon = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* Grid levels */}
      {Array.from({ length: levels }, (_, i) => {
        const r = (radius * (i + 1)) / levels;
        const n = scores.length;
        const gridPoints = Array.from({ length: n }, (_, j) => {
          const angle = (Math.PI * 2 * j) / n - Math.PI / 2;
          return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
        }).join(" ");
        return (
          <polygon
            key={i}
            points={gridPoints}
            fill="none"
            stroke="oklch(0.30 0.01 270)"
            strokeWidth={i === levels - 1 ? 1 : 0.5}
            opacity={0.6}
          />
        );
      })}

      {/* Axis lines */}
      {scores.map((_, i) => {
        const angle = (Math.PI * 2 * i) / scores.length - Math.PI / 2;
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + radius * Math.cos(angle)}
            y2={center + radius * Math.sin(angle)}
            stroke="oklch(0.30 0.01 270)"
            strokeWidth={0.5}
            opacity={0.6}
          />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={polygon}
        fill="oklch(0.65 0.19 250 / 0.15)"
        stroke="oklch(0.65 0.19 250)"
        strokeWidth={2}
      />

      {/* Data points */}
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={4}
          fill="oklch(0.65 0.19 250)"
          stroke="oklch(0.145 0 0)"
          strokeWidth={2}
        />
      ))}

      {/* Labels */}
      {points.map((p, i) => (
        <text
          key={i}
          x={p.labelX}
          y={p.labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[10px] fill-muted-foreground font-medium"
        >
          <tspan x={p.labelX} dy="-0.4em">{p.label}</tspan>
          <tspan x={p.labelX} dy="1.2em" className="fill-foreground text-[11px] font-bold">{p.value}</tspan>
        </text>
      ))}
    </svg>
  );
}
