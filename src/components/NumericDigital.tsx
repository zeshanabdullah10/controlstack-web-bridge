import clsx from 'clsx';

interface NumericDigitalProps {
    label?: string;
    value: number;
    precision?: number;
    digits?: number;
    unit?: string;
    className?: string;
}

export function NumericDigital({
    label,
    value,
    precision = 2,
    digits = 5,
    unit,
    className
}: NumericDigitalProps) {
    const formatted = value.toFixed(precision).padStart(digits + (precision > 0 ? 1 : 0), '0');

    return (
        <div className={clsx("digital-display-container flex flex-col gap-1", className)}>
            {label && (
                <div className="text-[10px] font-mono text-[var(--color-text-dim)] uppercase tracking-tighter">
                    {label}
                </div>
            )}
            <div className="flex items-baseline bg-black border border-[var(--border)] px-2 py-1 rounded shadow-inner">
                {/* Background "Ghost" digits for that classic LCD look */}
                <div className="relative font-mono font-bold text-xl leading-none">
                    <span className="opacity-10 text-[var(--color-primary)] absolute inset-0">
                        {'8'.repeat(digits + (precision > 0 ? 1 : 0))}
                    </span>
                    <span className="relative text-[var(--color-primary)] drop-shadow-[0_0_8px_var(--color-primary-dim)]">
                        {formatted}
                    </span>
                </div>
                {unit && (
                    <span className="ml-1 text-[10px] font-mono text-[var(--color-primary)] opacity-60">
                        {unit}
                    </span>
                )}
            </div>
        </div>
    );
}
