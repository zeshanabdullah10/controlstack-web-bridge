import type { ReactNode } from 'react';
import clsx from 'clsx';

interface ContentCardProps {
    title: ReactNode;
    children: ReactNode;
    className?: string;
    action?: ReactNode;
}

export function ContentCard({ title, children, className, action }: ContentCardProps) {
    return (
        <div className={clsx("material-card", className)}>
            <div className="material-card-header flex justify-between items-center">
                <h3 className="material-card-title">{title}</h3>
                {action && <div>{action}</div>}
            </div>
            <div className="material-card-content">
                {children}
            </div>
        </div>
    );
}
