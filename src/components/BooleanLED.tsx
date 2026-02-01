
import clsx from 'clsx';

interface BooleanLEDProps {
    label?: string;
    value: boolean;
    color?: string; // Hex color override
    shape?: 'circle' | 'square';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function BooleanLED({
    label,
    value,
    color,
    shape = 'circle',
    size = 'md',
    className
}: BooleanLEDProps) {

    // Dynamic style for the active color since it might be an override
    const activeStyle = value ? {
        backgroundColor: color || 'var(--md-primary)',
        boxShadow: `0 0 15px ${color || 'var(--md-primary)'}, 0 0 5px ${color || 'var(--md-primary)'} inset`,
        borderColor: 'transparent'
    } : {};

    return (
        <div className={clsx("led-container", className)}>
            <div
                className={clsx(
                    "led-bulb",
                    shape,
                    size,
                    value && "active"
                )}
                style={activeStyle}
            />
            {label && (
                <span className="led-label">
                    {label}
                </span>
            )}
        </div>
    );
}
