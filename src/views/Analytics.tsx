import { BarChart3, TrendingUp, Clock, Zap } from 'lucide-react';

export default function Analytics() {
    const performanceData = [
        { label: 'Uptime', value: '99.8%', change: '+0.2%', trend: 'up' },
        { label: 'Avg Response Time', value: '12ms', change: '-3ms', trend: 'up' },
        { label: 'Total Operations', value: '1,234,567', change: '+15%', trend: 'up' },
        { label: 'Error Rate', value: '0.02%', change: '-0.01%', trend: 'up' },
    ];

    const hourlyData = [
        { hour: '00:00', value: 45 },
        { hour: '04:00', value: 38 },
        { hour: '08:00', value: 72 },
        { hour: '12:00', value: 85 },
        { hour: '16:00', value: 68 },
        { hour: '20:00', value: 55 },
    ];

    const tagStats = [
        { tag: 'Motor_A_Speed', reads: 45234, writes: 1234, avgValue: '67.5%', lastUpdate: '2s ago' },
        { tag: 'Power_Main', reads: 12456, writes: 456, avgValue: 'true', lastUpdate: '5s ago' },
        { tag: 'Temperature', reads: 34567, writes: 234, avgValue: '28.3°C', lastUpdate: '1s ago' },
        { tag: 'Pressure', reads: 23456, writes: 123, avgValue: '102.1kPa', lastUpdate: '3s ago' },
        { tag: 'Tank_Level', reads: 18765, writes: 345, avgValue: '45.2%', lastUpdate: '4s ago' },
    ];

    return (
        <div>
            {/* Performance Metrics */}
            <div className="grid grid-cols-4 gap-6 mb-6">
                {performanceData.map((metric, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-label">{metric.label}</div>
                        <div className="stat-value">{metric.value}</div>
                        <div style={{ fontSize: '12px', color: 'var(--md-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <TrendingUp size={14} />
                            {metric.change}
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Hourly Activity */}
                <div className="material-card">
                    <div className="material-card-header">
                        <h3 className="material-card-title">
                            <BarChart3 size={20} />
                            Hourly Activity
                        </h3>
                    </div>
                    <div className="material-card-content">
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '200px' }}>
                            {hourlyData.map((data, index) => (
                                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                    <div
                                        style={{
                                            width: '100%',
                                            height: `${data.value}%`,
                                            background: 'var(--md-primary)',
                                            borderRadius: 'var(--md-radius-sm) var(--md-radius-sm) 0 0',
                                            transition: 'height 0.3s ease',
                                        }}
                                    />
                                    <span style={{ fontSize: '10px', color: 'var(--md-text-secondary)', fontFamily: 'var(--md-font-mono)' }}>
                                        {data.hour}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* System Load */}
                <div className="material-card">
                    <div className="material-card-header">
                        <h3 className="material-card-title">
                            <Zap size={20} />
                            System Load Distribution
                        </h3>
                    </div>
                    <div className="material-card-content">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { label: 'CPU Usage', value: 45, color: 'var(--md-primary)' },
                                { label: 'Memory', value: 62, color: 'var(--md-accent)' },
                                { label: 'Network I/O', value: 28, color: 'var(--md-success)' },
                                { label: 'Disk I/O', value: 15, color: 'var(--md-warning)' },
                            ].map((item, index) => (
                                <div key={index}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                                        <span>{item.label}</span>
                                        <span style={{ fontWeight: 700 }}>{item.value}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: 'var(--md-surface-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div
                                            style={{
                                                width: `${item.value}%`,
                                                height: '100%',
                                                background: item.color,
                                                transition: 'width 0.3s ease',
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tag Statistics */}
            <div className="material-card">
                <div className="material-card-header">
                    <h3 className="material-card-title">
                        <Clock size={20} />
                        Tag Statistics
                    </h3>
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
                        Export Report
                    </button>
                </div>
                <div className="material-card-content" style={{ padding: 0 }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Tag Name</th>
                                <th>Reads</th>
                                <th>Writes</th>
                                <th>Avg Value</th>
                                <th>Last Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tagStats.map((stat, index) => (
                                <tr key={index}>
                                    <td style={{ fontWeight: 500, fontFamily: 'var(--md-font-mono)' }}>{stat.tag}</td>
                                    <td style={{ fontFamily: 'var(--md-font-mono)' }}>{stat.reads.toLocaleString()}</td>
                                    <td style={{ fontFamily: 'var(--md-font-mono)' }}>{stat.writes.toLocaleString()}</td>
                                    <td style={{ fontFamily: 'var(--md-font-mono)' }}>{stat.avgValue}</td>
                                    <td style={{ fontSize: '12px', color: 'var(--md-text-secondary)' }}>{stat.lastUpdate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-6" style={{ marginTop: '24px' }}>
                <div className="material-card">
                    <div className="material-card-content">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '14px', color: 'var(--md-text-secondary)', marginBottom: '8px' }}>
                                Total Data Points
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--md-primary)' }}>
                                2.4M
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--md-success)', marginTop: '4px' }}>
                                +18% from last week
                            </div>
                        </div>
                    </div>
                </div>

                <div className="material-card">
                    <div className="material-card-content">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '14px', color: 'var(--md-text-secondary)', marginBottom: '8px' }}>
                                Avg Update Rate
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--md-accent)' }}>
                                20 Hz
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--md-success)', marginTop: '4px' }}>
                                Optimal performance
                            </div>
                        </div>
                    </div>
                </div>

                <div className="material-card">
                    <div className="material-card-content">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '14px', color: 'var(--md-text-secondary)', marginBottom: '8px' }}>
                                Active Tags
                            </div>
                            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--md-success)' }}>
                                24
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--md-text-secondary)', marginTop: '4px' }}>
                                All systems operational
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
