
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface NumericGaugeProps {
    label?: string;
    value: number;
    min?: number;
    max?: number;
    unit?: string;
    size?: number;
    className?: string;
    thresholds?: { [key: number]: string };
}

export function NumericGauge({
    label,
    value,
    min = 0,
    max = 100,
    unit,
    size = 120,
    className,
    thresholds
}: NumericGaugeProps) {
    // Normalize
    const clamped = Math.min(max, Math.max(min, value));
    const range = max - min;
    const percentage = (clamped - min) / range;

    // SVG Geometry
    const strokeWidth = size * 0.1;
    const radius = (size - strokeWidth) / 2;
    const circumference = Math.PI * radius;
    const center = size / 2;

    // Determine color based on thresholds
    let color = 'var(--md-primary)';
    if (thresholds) {
        const levels = Object.keys(thresholds).map(Number).sort((a, b) => a - b);
        for (const level of levels) {
            if (clamped >= level) {
                color = thresholds[level];
            }
        }
    }

    // Value Display
    return (
        <div className={clsx("gauge-container", className)} style={{ width: size }}>
            {/* Gauge SVG */}
            <div className="relative overflow-hidden" style={{ height: size / 2 + strokeWidth, width: size }}>
                <svg
                    width={size}
                    height={size / 2 + strokeWidth}
                    viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}
                >
                    {/* Defs for Glow */}
                    <defs>
                        <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Background Arch */}
                    <path
                        d={`M ${strokeWidth / 2} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${center}`}
                        fill="none"
                        stroke="var(--md-surface-hover)"
                        strokeWidth={strokeWidth}
                        strokeLinecap="butt"
                    />

                    {/* Value Arch */}
                    <motion.path
                        d={`M ${strokeWidth / 2} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${center}`}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="butt"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - percentage)}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: circumference * (1 - percentage), stroke: color }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        style={{ filter: `drop-shadow(0 0 5px ${color})` }}
                    />
                </svg>

                {/* Value Indicator */}
                <div className="gauge-value-group">
                    <span className="gauge-number" style={{ color }}>
                        {Math.round(clamped)}
                    </span>
                    {unit && <span className="text-xs text-[var(--md-text-secondary)] font-mono">{unit}</span>}
                </div>
            </div>

            {label && (
                <span className="text-xs font-mono text-[var(--md-text-disabled)] uppercase tracking-wider mt-2">
                    {label}
                </span>
            )}
        </div>
    );
}
