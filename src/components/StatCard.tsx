import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatCardProps {
    label: string;
    value: ReactNode;
    icon: LucideIcon;
    color?: 'primary' | 'success' | 'warning' | 'error';
    change?: string;
    changeColor?: string;
}

export function StatCard({
    label,
    value,
    icon: Icon,
    color = 'primary',
    change,
    changeColor = 'var(--md-success)'
}: StatCardProps) {
    return (
        <div className="stat-card">
            <div className={clsx("stat-icon", color)}>
                <Icon size={24} />
            </div>
            <div className="stat-label">{label}</div>
            <div className="stat-value">{value}</div>
            {change && (
                <div style={{ fontSize: '12px', color: changeColor }}>
                    {change}
                </div>
            )}
        </div>
    );
}
