import clsx from 'clsx';

interface TankProps {
    label?: string;
    value: number;
    min?: number;
    max?: number;
    height?: number;
    width?: number;
    unit?: string;
    color?: string;
    className?: string;
}

export function Tank({
    label,
    value,
    min = 0,
    max = 100,
    height = 160,
    width = 60,
    unit = '%',
    color = 'var(--md-primary)',
    className
}: TankProps) {
    const range = max - min;
    const percentage = Math.min(1, Math.max(0, (value - min) / range));
    const fillHeight = percentage * 100;

    return (
        <div className={clsx("tank-container flex flex-col items-center gap-2", className)}>
            {label && (
                <div className="text-xs font-mono text-[var(--md-text-disabled)] uppercase tracking-wider">
                    {label}
                </div>
            )}

            <div
                className="relative bg-black/40 border-2 border-[var(--md-border)] rounded-md overflow-hidden"
                style={{ height, width }}
            >
                {/* Tick Marks */}
                <div className="absolute inset-0 flex flex-col justify-between py-2 px-1 opacity-20 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-full border-t border-white" />
                    ))}
                </div>

                {/* Fluid Fill */}
                <div
                    className="absolute bottom-0 w-full transition-all duration-300 ease-out"
                    style={{
                        height: `${fillHeight}%`,
                        backgroundColor: color,
                        boxShadow: `inset -10px 0 20px rgba(0,0,0,0.2), 0 0 20px ${color}33`,
                        borderTop: '1px solid rgba(255,255,255,0.4)'
                    }}
                >
                    {/* Bubbles / Highlight effect */}
                    <div className="absolute top-0 right-2 w-1 h-full bg-white/10" />
                </div>
            </div>

            <div className="font-mono text-sm font-bold text-[var(--md-text-primary)]">
                {value.toFixed(1)}<span className="text-[10px] text-[var(--md-text-disabled)] ml-0.5">{unit}</span>
            </div>
        </div>
    );
}
