import { useState, useEffect } from 'react';
import { useLabVIEW } from '../hooks/useLabVIEW';
import { Activity, Radio, AlertTriangle } from 'lucide-react';
import { WaveformChart } from '../components/WaveformChart';

export default function Monitoring() {
    const [speed, _] = useLabVIEW<number>('Motor_A_Speed', 0);
    const [rfSignal, __] = useLabVIEW<number[]>('Drone_RF_Signal', [0, 0, 0, 0, 0]);
    const [history, setHistory] = useState<number[]>(new Array(50).fill(0));
    const [history2, setHistory2] = useState<number[]>(new Array(50).fill(0));

    useEffect(() => {
        const interval = setInterval(() => {
            setHistory((prev) => [...prev.slice(1), speed + (Math.random() - 0.5) * 5]);
            setHistory2((prev) => [...prev.slice(1), speed * 0.8 + (Math.random() - 0.5) * 3]);
        }, 100);
        return () => clearInterval(interval);
    }, [speed]);

    const logData = [
        { timestamp: '2026-01-31 20:41:23', tag: 'Motor_A_Speed', value: '75.2', unit: '%', status: 'normal' },
        { timestamp: '2026-01-31 20:41:22', tag: 'Power_Main', value: 'true', unit: '', status: 'normal' },
        { timestamp: '2026-01-31 20:41:21', tag: 'Temperature', value: '32.1', unit: '°C', status: 'warning' },
        { timestamp: '2026-01-31 20:41:20', tag: 'Pressure', value: '105.3', unit: 'kPa', status: 'normal' },
        { timestamp: '2026-01-31 20:41:19', tag: 'Motor_A_Speed', value: '68.5', unit: '%', status: 'normal' },
        { timestamp: '2026-01-31 20:41:18', tag: 'Tank_Level', value: '45.0', unit: '%', status: 'normal' },
        { timestamp: '2026-01-31 20:41:17', tag: 'PID_P', value: '70.0', unit: '', status: 'normal' },
        { timestamp: '2026-01-31 20:41:16', tag: 'Relay_1', value: 'true', unit: '', status: 'normal' },
    ];

    const alerts = [
        { time: '20:40:15', severity: 'warning', message: 'Temperature approaching threshold (32.1°C)' },
        { time: '20:38:42', severity: 'info', message: 'Motor speed adjusted to 75%' },
        { time: '20:35:10', severity: 'warning', message: 'High load detected on Motor A' },
    ];

    return (
        <div>
            {/* Waveform Charts */}
            <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="material-card">
                    <div className="material-card-header">
                        <h3 className="material-card-title">
                            <Activity size={20} />
                            Real-time Telemetry - Channel 1
                        </h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <span className="chip primary">BUFFER: 50pts</span>
                            <span className="chip success">AUTO-SCALE: ON</span>
                        </div>
                    </div>
                    <div className="material-card-content">
                        <WaveformChart
                            data={history}
                            min={-10}
                            max={110}
                            label="Output Power Factor"
                            color="var(--md-primary)"
                            size={{ width: '100%', height: 200 }}
                        />
                    </div>
                </div>

                <div className="material-card">
                    <div className="material-card-header">
                        <h3 className="material-card-title">
                            <Activity size={20} />
                            Real-time Telemetry - Channel 2
                        </h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <span className="chip primary">BUFFER: 50pts</span>
                            <span className="chip success">AUTO-SCALE: ON</span>
                        </div>
                    </div>
                    <div className="material-card-content">
                        <WaveformChart
                            data={history2}
                            min={-10}
                            max={110}
                            label="Secondary Output"
                            color="var(--md-accent)"
                            size={{ width: '100%', height: 200 }}
                        />
                    </div>
                </div>
            </div>

            {/* Spectrum Analysis */}
            <div className="material-card mb-6">
                <div className="material-card-header">
                    <h3 className="material-card-title">
                        <Radio size={20} />
                        Spectrum Analysis
                    </h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <span className="chip warning">Channel 4</span>
                        <span className="chip warning">2.4GHz</span>
                    </div>
                </div>
                <div className="material-card-content">
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '200px', background: 'rgba(0,0,0,0.1)', padding: '16px', borderRadius: 'var(--md-radius-sm)' }}>
                        {rfSignal.map((val, i) => (
                            <div
                                key={i}
                                style={{
                                    flex: 1,
                                    height: `${val * 100}%`,
                                    background: val > 0.8 ? 'var(--md-error)' : val > 0.5 ? 'var(--md-warning)' : 'var(--md-accent)',
                                    borderRadius: '2px 2px 0 0',
                                    transition: 'height 0.1s ease',
                                }}
                            />
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: 'var(--md-text-secondary)', fontFamily: 'var(--md-font-mono)' }}>
                        <span>0Hz</span>
                        <span>10kHz</span>
                        <span>20kHz</span>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-2 gap-6">
                {/* Data Log */}
                <div className="material-card">
                    <div className="material-card-header">
                        <h3 className="material-card-title">Data Log</h3>
                        <button
                            style={{
                                padding: '6px 12px',
                                background: 'var(--md-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--md-radius-sm)',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 500,
                            }}
                        >
                            Export CSV
                        </button>
                    </div>
                    <div className="material-card-content" style={{ padding: 0 }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Tag</th>
                                    <th>Value</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logData.map((row, index) => (
                                    <tr key={index}>
                                        <td style={{ fontFamily: 'var(--md-font-mono)', fontSize: '12px' }}>{row.timestamp}</td>
                                        <td style={{ fontWeight: 500 }}>{row.tag}</td>
                                        <td style={{ fontFamily: 'var(--md-font-mono)' }}>
                                            {row.value} {row.unit}
                                        </td>
                                        <td>
                                            <span className={`chip ${row.status === 'warning' ? 'warning' : 'success'}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Alerts */}
                <div className="material-card">
                    <div className="material-card-header">
                        <h3 className="material-card-title">
                            <AlertTriangle size={20} />
                            System Alerts
                        </h3>
                    </div>
                    <div className="material-card-content">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {alerts.map((alert, index) => (
                                <div
                                    key={index}
                                    style={{
                                        padding: '12px',
                                        background: alert.severity === 'warning' ? 'rgba(255, 152, 0, 0.1)' : 'rgba(33, 150, 243, 0.1)',
                                        border: `1px solid ${alert.severity === 'warning' ? 'var(--md-warning)' : 'var(--md-info)'}`,
                                        borderRadius: 'var(--md-radius-sm)',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <AlertTriangle size={16} color={alert.severity === 'warning' ? 'var(--md-warning)' : 'var(--md-info)'} />
                                        <span style={{ fontSize: '12px', fontFamily: 'var(--md-font-mono)', color: 'var(--md-text-secondary)' }}>
                                            {alert.time}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '14px' }}>{alert.message}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
