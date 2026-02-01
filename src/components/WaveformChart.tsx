import { useMemo } from 'react';
import clsx from 'clsx';

interface WaveformChartProps {
    label?: string;
    data: number[];
    min?: number;
    max?: number;
    size?: { width: number | string; height: number };
    className?: string;
    color?: string;
    gridLines?: number;
}

export function WaveformChart({
    label,
    data,
    min = 0,
    max = 100,
    size = { width: '100%', height: 160 },
    className,
    color = 'var(--md-primary)',
    gridLines = 4
}: WaveformChartProps) {
    const range = max - min;

    // Generate Path Data
    const pathData = useMemo(() => {
        if (data.length < 2) return '';

        const width = 1000; // Normalized width
        const height = 100; // Normalized height
        const stepX = width / (data.length - 1);

        return data.map((val, i) => {
            const x = i * stepX;
            const y = height - ((val - min) / range) * height;
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');
    }, [data, min, max, range]);

    // Generate Grid Lines
    const grids = Array.from({ length: gridLines + 1 }, (_, i) => {
        const y = (i / gridLines) * 100;
        const val = max - (i / gridLines) * range;
        return { y, val: val.toFixed(1) };
    });

    return (
        <div className={clsx("waveform-container flex flex-col gap-2 p-2", className)}>
            {label && (
                <div className="text-xs font-mono text-[var(--color-text-dim)] uppercase tracking-wider">
                    {label}
                </div>
            )}

            <div
                className="relative border rounded overflow-hidden"
                style={{
                    width: size.width,
                    height: size.height,
                    background: 'var(--md-surface)',
                    borderColor: 'var(--md-border)'
                }}
            >
                {/* SVG Plot */}
                <svg
                    viewBox="0 0 1000 100"
                    preserveAspectRatio="none"
                    className="w-full h-full"
                >
                    {/* Horizontal Grid */}
                    {grids.map((g, i) => (
                        <line
                            key={i}
                            x1="0" y1={g.y} x2="1000" y2={g.y}
                            stroke="var(--md-border)"
                            strokeWidth="0.5"
                            strokeDasharray="2,4"
                            opacity="0.3"
                        />
                    ))}

                    {/* The Waveform Line */}
                    <path
                        d={pathData}
                        fill="none"
                        stroke={color}
                        strokeWidth="1.5"
                        vectorEffect="non-scaling-stroke"
                        className="transition-all duration-100 ease-linear"
                        style={{
                            filter: `drop-shadow(0 0 4px ${color}66)`
                        }}
                    />
                </svg>

                {/* Y-Axis Labels */}
                <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-between pointer-events-none opacity-50">
                    {grids.map((g, i) => (
                        <span key={i} className="text-[10px] font-mono text-white leading-none">
                            {g.val}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
