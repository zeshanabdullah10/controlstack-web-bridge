
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface BooleanToggleProps {
    label?: string;
    value: boolean;
    onChange?: (newValue: boolean) => void;
    variant?: 'switch' | 'rocker';
    disabled?: boolean;
    className?: string;
}

export function BooleanToggle({
    label,
    value,
    onChange,
    variant = 'switch',
    disabled = false,
    className
}: BooleanToggleProps) {

    const handleClick = () => {
        if (!disabled && onChange) {
            onChange(!value);
        }
    };

    return (
        <div className={clsx("toggle-container", className)}>
            {label && (
                <span className="toggle-label">
                    {label}
                </span>
            )}

            {variant === 'switch' ? (
                // TOGGLE SWITCH VARIANT
                <div
                    onClick={handleClick}
                    className={clsx(
                        "toggle-switch",
                        value && "on",
                        disabled && "disabled"
                    )}
                >
                    <motion.div
                        initial={false}
                        animate={{ x: value ? 24 : 2 }} // 24px is end position (48 width - 20 thumb - 4 margin approx)
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="toggle-thumb"
                    />
                </div>
            ) : (
                // ROCKER SWITCH VARIANT
                <div
                    onClick={handleClick}
                    className={clsx("toggle-rocker", disabled && "opacity-50")}
                >
                    {/* High side (ON) */}
                    <div className={clsx("rocker-half", value ? "on" : "off")}>
                        <div className="rocker-indicator" />
                    </div>

                    {/* Low side (OFF) */}
                    <div className={clsx("rocker-half", !value ? "on" : "off")}>
                        <div className="rocker-indicator dot" />
                    </div>
                </div>
            )}
        </div>
    );
}
