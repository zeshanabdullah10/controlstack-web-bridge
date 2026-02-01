
import React, { useRef, useState, useEffect } from 'react';
import clsx from 'clsx';

interface NumericSliderProps {
    label?: string;
    value: number;
    min?: number;
    max?: number;
    onChange?: (val: number) => void;
    vertical?: boolean;
    unit?: string;
    className?: string;
    fillColor?: string;
}

export function NumericSlider({
    label,
    value,
    min = 0,
    max = 100,
    onChange,
    vertical = false,
    unit,
    className,
    fillColor
}: NumericSliderProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Normalize value to 0-1
    const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

    const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
        if (!onChange) return;
        setIsDragging(true);
        updateValue(e);
    };

    const updateValue = (e: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent) => {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as MouseEvent).clientX;
            clientY = (e as MouseEvent).clientY;
        }

        let percent;
        if (vertical) {
            percent = (rect.bottom - clientY) / rect.height;
        } else {
            percent = (clientX - rect.left) / rect.width;
        }

        percent = Math.min(1, Math.max(0, percent));
        const newValue = min + percent * (max - min);
        onChange && onChange(Math.round(newValue));
    };

    useEffect(() => {
        const handlePointerMove = (e: MouseEvent | TouchEvent) => {
            if (!isDragging) return;
            e.preventDefault();
            updateValue(e);
        };

        const handlePointerUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handlePointerMove);
            window.addEventListener('touchmove', handlePointerMove, { passive: false });
            window.addEventListener('mouseup', handlePointerUp);
            window.addEventListener('touchend', handlePointerUp);
        }

        return () => {
            window.removeEventListener('mousemove', handlePointerMove);
            window.removeEventListener('touchmove', handlePointerMove);
            window.removeEventListener('mouseup', handlePointerUp);
            window.removeEventListener('touchend', handlePointerUp);
        };
    }, [isDragging, min, max, onChange, vertical]);

    return (
        <div className={clsx(
            "slider-container",
            vertical ? "vertical" : "horizontal",
            className
        )}>

            {/* Track Area */}
            <div
                ref={trackRef}
                onMouseDown={handlePointerDown}
                onTouchStart={handlePointerDown}
                className={clsx(
                    "slider-track",
                    !onChange && "opacity-80 cursor-default"
                )}
            >
                {/* Fill */}
                <div
                    className="slider-fill transition-all duration-75 ease-out"
                    style={{
                        backgroundColor: fillColor,
                        width: vertical ? '100%' : `${percentage}%`,
                        height: vertical ? `${percentage}%` : '100%',
                        bottom: vertical ? 0 : undefined,
                        left: 0,
                        boxShadow: fillColor ? `0 0 10px ${fillColor}` : undefined
                    }}
                />

                {onChange && (
                    <div
                        className="slider-thumb"
                        style={{
                            width: vertical ? '12px' : '6px',
                            height: vertical ? '6px' : '12px',
                            left: vertical ? '50%' : `${percentage}%`,
                            bottom: vertical ? `${percentage}%` : '50%',
                            transform: 'translate(-50%, 50%)',
                        }}
                    />
                )}
            </div>

            {/* Label & Value */}
            <div className="slider-label-group">
                {label && <span className="text-[var(--color-text-dim)] uppercase tracking-wider">{label}</span>}
                <span className="text-[var(--color-text-main)] font-bold">
                    {Math.round(value)}{unit && <span className="text-[var(--color-text-muted)] scale-75 inline-block">{unit}</span>}
                </span>
            </div>

        </div>
    );
}
