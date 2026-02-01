import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';

interface NumericKnobProps {
    label?: string;
    value: number;
    min?: number;
    max?: number;
    onChange?: (val: number) => void;
    size?: number;
    unit?: string;
    className?: string;
    step?: number;
}

export function NumericKnob({
    label,
    value,
    min = 0,
    max = 100,
    onChange,
    size = 64,
    unit,
    className,
    step = 1
}: NumericKnobProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value.toString());
    const inputRef = useRef<HTMLInputElement>(null);
    const knobRef = useRef<HTMLDivElement>(null);

    // Calculate angle: 0 to 1 -> -135deg to +135deg (270deg range)
    const range = max - min;
    const normalized = Math.min(1, Math.max(0, (value - min) / range));
    const angle = normalized * 270 - 135;

    // SVG Layout
    const center = size / 2;
    const strokeWidth = size * 0.1;
    const radius = size / 2 - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const arcLength = circumference * 0.75; // 270 degrees

    // Correction: strokeDashoffset works better if we rotate the circle correctly
    // Full circumference is C. 75% is arcLength. 
    // DashArray: [arcLength, C]
    // We want the arc to start at 135deg.
    // SVG circles start at 3 o'clock (0deg).
    // rotate(135, center, center) puts start at bottom-right.
    // This is correct for the background track.

    // For the filled part:
    // strokeDashoffset = arcLength * (1 - normalized) + (Circumference - arcLength) ? No.
    // If DashArray is [arcLength, Circumference], offset 0 means full arc is drawn.
    // Offset increases means arc shrinks from the END.
    // So offset = arcLength * (1 - normalized).

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!onChange || isEditing) return;
        setIsDragging(true);
        document.body.style.cursor = 'crosshair';

        // Use relative movement or absolute angle? 
        // For "round" movement, we calculate the angle from the center.
        updateValueFromMouse(e.clientX, e.clientY);
    };

    const updateValueFromMouse = (mx: number, my: number) => {
        if (!knobRef.current || !onChange) return;

        const rect = knobRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        // Calculate angle from center (in radians)
        // atan2(dy, dx) -> 0 is right, positive is clockwise
        let angleRad = Math.atan2(my - cy, mx - cx);
        let angleDeg = (angleRad * 180) / Math.PI;

        // Shift angle so that -135 (bottom-left) to 135 (bottom-right) maps to 0..1
        // Standard atan2: Right=0, Down=90, Left=180/-180, Up=-90
        // Our knob: Bottom-Left is -135 relative to TOP=0.
        // Let's normalize so Top is 0.
        let normAngle = angleDeg + 90;
        if (normAngle < 0) normAngle += 360;
        if (normAngle > 360) normAngle -= 360;

        // Now: Top=0, Right=90, Bottom=180, Left=270
        // Our active range is 225 (-135) to 135 (+135).
        // Wait, if Top is 0:
        // Start (0%) is at 225 degrees.
        // End (100%) is at 135 degrees.
        // Gap is from 135 to 225 (90 degrees).

        let valuePerc = 0;
        if (normAngle >= 225) {
            valuePerc = (normAngle - 225) / 270;
        } else if (normAngle <= 135) {
            valuePerc = (normAngle + (360 - 225)) / 270;
        } else {
            // In the dead zone. Snap to nearest end.
            valuePerc = normAngle > 180 ? 0 : 1;
        }

        const newValue = min + valuePerc * range;
        const rounded = Math.round(newValue / step) * step;
        onChange(Number(Math.max(min, Math.min(max, rounded)).toFixed(2)));
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !onChange) return;
            updateValueFromMouse(e.clientX, e.clientY);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.body.style.cursor = '';
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, min, max, onChange, range, step]);

    // Handle Input Editing
    const handleValueClick = () => {
        if (!onChange) return;
        setIsEditing(true);
        setInputValue(value.toString());
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleInputBlur = () => {
        submitInput();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') submitInput();
        if (e.key === 'Escape') {
            setIsEditing(false);
            setInputValue(value.toString());
        }
    };

    const submitInput = () => {
        setIsEditing(false);
        if (!onChange) return;
        let p = parseFloat(inputValue);
        if (isNaN(p)) return;
        p = Math.max(min, Math.min(max, p));
        onChange(Number(p.toFixed(2)));
    };

    return (
        <div className={clsx("knob-container flex flex-col items-center gap-2", className)} ref={knobRef}>
            <div
                className={clsx(
                    "relative select-none touch-none",
                    onChange ? "cursor-ns-resize" : "cursor-default",
                    isDragging && "scale-[1.02]"
                )}
                style={{ width: size, height: size }}
                onMouseDown={handleMouseDown}
            >
                {/* SVG Ring Background */}
                <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className="overflow-visible rotate-90"
                >
                    {/* Background Track */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke="var(--md-surface-hover)"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={`${arcLength} ${circumference}`}
                        transform={`rotate(135 ${center} ${center})`}
                    />
                    {/* Active Value Arc */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke="var(--md-primary)"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={`${arcLength} ${circumference}`}
                        strokeDashoffset={arcLength * (1 - normalized)}
                        transform={`rotate(135 ${center} ${center})`}
                        className="transition-[stroke-dashoffset] duration-75"
                    />
                </svg>

                {/* Knob Cap (The grabbable part) */}
                <div
                    className="absolute inset-0 rounded-full flex items-center justify-center shadow-lg transition-transform duration-75"
                    style={{
                        margin: strokeWidth * 2, // Shrink to fit inside ring
                        background: 'var(--md-surface)',
                        border: '1px solid var(--md-border)',
                        transform: `rotate(${angle}deg)`
                    }}
                >
                    {/* Marker Dot */}
                    <div className="absolute top-[10%] w-1.5 h-1.5 rounded-full bg-[var(--md-primary)] shadow-[0_0_8px_var(--md-primary)]" />
                </div>
            </div>

            {/* Label & Value */}
            <div className="text-center">
                {label && (
                    <div className="text-xs font-mono text-[var(--md-text-disabled)] uppercase tracking-wider mb-1">
                        {label}
                    </div>
                )}

                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        className="w-16 bg-[var(--md-surface-hover)] border border-[var(--md-primary)] text-center text-sm font-mono rounded px-1 py-0.5 outline-none text-[var(--md-text-primary)]"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onBlur={handleInputBlur}
                        onKeyDown={handleKeyDown}
                    />
                ) : (
                    <div
                        className="font-mono text-sm font-bold text-[var(--md-text-primary)] cursor-text hover:text-[var(--md-primary)] transition-colors"
                        onClick={handleValueClick}
                        title="Click to edit value"
                    >
                        {value}{unit && <span className="text-xs text-[var(--md-text-disabled)] ml-0.5">{unit}</span>}
                    </div>
                )}
            </div>
        </div>
    );
}
