import { useState, useEffect } from 'react';
import { useLabVIEW } from '../hooks/useLabVIEW';
import { Activity, Zap, Gauge, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { NumericGauge } from '../components/NumericGauge';
import { WaveformChart } from '../components/WaveformChart';
import { BooleanLED } from '../components/BooleanLED';
import { StatCard } from '../components/StatCard';
import { ContentCard } from '../components/ContentCard';

export default function Overview() {
    const [speed, _] = useLabVIEW<number>('Motor_A_Speed', 0);
    const [powerState, __] = useLabVIEW<boolean>('Power_Main', true);
    // New: Hook for sending commands
    const [___, setSystemCommand] = useLabVIEW<string>('System_Command', '');

    const [history, setHistory] = useState<number[]>(new Array(50).fill(0));

    useEffect(() => {
        const interval = setInterval(() => {
            setHistory((prev) => [...prev.slice(1), speed + (Math.random() - 0.5) * 5]);
        }, 100);
        return () => clearInterval(interval);
    }, [speed]);

    const stats = [
        {
            label: 'System Status',
            value: powerState ? 'Online' : 'Offline',
            icon: Activity,
            color: 'primary',
            change: powerState ? '+100%' : '0%',
        },
        {
            label: 'Motor Speed',
            value: `${speed.toFixed(0)}%`,
            icon: Gauge,
            color: 'success',
            change: '+12%',
        },
        {
            label: 'Power Consumption',
            value: `${(speed * 0.12).toFixed(2)} kW`,
            icon: Zap,
            color: 'warning',
            change: '+8%',
        },
        {
            label: 'Efficiency',
            value: '94.2%',
            icon: TrendingUp,
            color: 'success',
            change: '+2.1%',
        },
    ];

    const recentActivity = [
        { time: '2 min ago', event: 'Motor A started', status: 'success' },
        { time: '5 min ago', event: 'PID parameters updated', status: 'info' },
        { time: '12 min ago', event: 'System calibration completed', status: 'success' },
        { time: '18 min ago', event: 'Temperature threshold adjusted', status: 'warning' },
        { time: '25 min ago', event: 'Connection established', status: 'success' },
    ];

    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const handleAction = (action: string) => {
        // Send to LabVIEW
        setSystemCommand(action);

        // Show feedback
        setToastMessage(`${action} command sent`);
        setTimeout(() => setToastMessage(null), 3000);
    };

    return (
        <div className="relative">
            {toastMessage && (
                <div className="fixed top-24 right-6 bg-[var(--md-surface)] border border-[var(--md-success)] text-[var(--md-success)] px-4 py-3 rounded shadow-lg z-50 flex items-center gap-2 animate-bounce-in">
                    <CheckCircle size={18} />
                    <span className="text-sm font-medium">{toastMessage}</span>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-4 mb-6">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color as any}
                        change={stat.change}
                    />
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-3 gap-6">
                {/* Real-time Gauges */}
                <ContentCard title="Motor Performance">
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                        <NumericGauge
                            label="Speed"
                            value={speed}
                            min={0}
                            max={100}
                            unit="%"
                            size={140}
                            thresholds={{ 70: 'var(--md-warning)', 90: 'var(--md-error)' }}
                        />
                        <NumericGauge
                            label="RPM"
                            value={speed * 45}
                            min={0}
                            max={4500}
                            unit="RPM"
                            size={140}
                            thresholds={{ 3500: 'var(--md-warning)', 4200: 'var(--md-error)' }}
                        />
                    </div>
                </ContentCard>

                {/* System Status */}
                <ContentCard title="System Status">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <BooleanLED value={powerState} label="Power" color="var(--md-success)" size="lg" />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <BooleanLED value={speed > 0} label="Running" color="var(--md-primary)" size="lg" />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <BooleanLED value={speed > 70} label="High Load" color="var(--md-warning)" size="lg" />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <BooleanLED value={false} label="Error" color="var(--md-error)" size="lg" />
                        </div>
                    </div>
                </ContentCard>

                {/* Quick Actions */}
                <ContentCard title="Quick Actions">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button
                            onClick={() => handleAction('Start All Motors')}
                            style={{
                                padding: '12px 16px',
                                background: 'var(--md-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--md-radius-sm)',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 500,
                                transition: 'all var(--md-transition-fast)',
                            }}
                        >
                            Start All Motors
                        </button>
                        <button
                            onClick={() => handleAction('Emergency Stop')}
                            style={{
                                padding: '12px 16px',
                                background: 'transparent',
                                color: 'var(--md-error)',
                                border: '1px solid var(--md-error)',
                                borderRadius: 'var(--md-radius-sm)',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 500,
                            }}
                        >
                            Emergency Stop
                        </button>
                        <button
                            onClick={() => handleAction('Reset System')}
                            style={{
                                padding: '12px 16px',
                                background: 'transparent',
                                color: 'var(--md-text-primary)',
                                border: '1px solid var(--md-border)',
                                borderRadius: 'var(--md-radius-sm)',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 500,
                            }}
                        >
                            Reset System
                        </button>
                        <button
                            onClick={() => handleAction('Run Diagnostics')}
                            style={{
                                padding: '12px 16px',
                                background: 'transparent',
                                color: 'var(--md-text-primary)',
                                border: '1px solid var(--md-border)',
                                borderRadius: 'var(--md-radius-sm)',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 500,
                            }}
                        >
                            Run Diagnostics
                        </button>
                    </div>
                </ContentCard>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-2 gap-6" style={{ marginTop: '24px' }}>
                {/* Waveform Chart */}
                <ContentCard title="Real-time Telemetry">
                    <WaveformChart
                        data={history}
                        min={-10}
                        max={110}
                        label="Motor Speed"
                        color="var(--md-primary)"
                        size={{ width: '100%', height: 200 }}
                    />
                </ContentCard>

                {/* Recent Activity */}
                <ContentCard title="Recent Activity">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {recentActivity.map((activity, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px',
                                    background: 'var(--md-surface-hover)',
                                    borderRadius: 'var(--md-radius-sm)',
                                }}
                            >
                                {activity.status === 'success' ? (
                                    <CheckCircle size={16} color="var(--md-success)" />
                                ) : (
                                    <AlertCircle size={16} color="var(--md-warning)" />
                                )}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{activity.event}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--md-text-secondary)' }}>
                                        {activity.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ContentCard>
            </div>
        </div>
    );
}
