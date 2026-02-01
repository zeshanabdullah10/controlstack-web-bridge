import clsx from 'clsx';

interface ThermometerProps {
    label?: string;
    value: number;
    min?: number;
    max?: number;
    height?: number;
    color?: string;
    unit?: string;
    className?: string;
}

export function Thermometer({
    label,
    value,
    min = 0,
    max = 100,
    height = 180,
    color = '#ff3b3b',
    unit = '°C',
    className
}: ThermometerProps) {
    const range = max - min;
    const percentage = Math.min(1, Math.max(0, (value - min) / range));
    const fillHeight = percentage * 100;
    const bulbSize = 24;
    const stemWidth = 12;

    return (
        <div className={clsx("thermometer-container flex flex-col items-center gap-2", className)}>
            {label && (
                <div className="text-[10px] font-mono text-[var(--md-text-disabled)] uppercase tracking-wider">
                    {label}
                </div>
            )}

            <div className="relative" style={{ height: height + bulbSize, width: bulbSize }}>
                {/* Stem Background */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 bg-black/40 border border-[var(--md-border)] rounded-t-full"
                    style={{ height, width: stemWidth }}
                >
                    {/* Fill */}
                    <div
                        className="absolute bottom-0 w-full transition-all duration-300"
                        style={{
                            height: `${fillHeight}%`,
                            backgroundColor: color,
                            boxShadow: `0 0 10px ${color}66`
                        }}
                    >
                        {/* Highlight */}
                        <div className="absolute top-0 right-0 w-[2px] h-full bg-white/20" />
                    </div>
                </div>

                {/* Bulb */}
                <div
                    className="absolute bottom-0 left-0 rounded-full border border-[var(--md-border)]"
                    style={{
                        width: bulbSize,
                        height: bulbSize,
                        backgroundColor: color,
                        boxShadow: `0 0 15px ${color}44`
                    }}
                >
                    {/* Bulb Highlight */}
                    <div className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-white/40 rounded-full" />
                </div>
            </div>

            <div className="font-mono text-xs font-bold text-[var(--md-text-primary)]">
                {value.toFixed(1)}{unit}
            </div>
        </div>
    );
}
