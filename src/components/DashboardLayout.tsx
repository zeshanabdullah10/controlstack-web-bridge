import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Sliders,
    Activity,
    BarChart3,
    Settings as SettingsIcon,
    Menu,
    X,
    Wifi,
    WifiOff,
} from 'lucide-react';
import bridge from '../lib/bridge';

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [connected, setConnected] = useState(bridge.getRefnum() !== null);
    const location = useLocation();

    // Update connection status periodically
    useEffect(() => {
        const interval = setInterval(() => {
            setConnected(bridge.getRefnum() !== null);
        }, 1000);
        return () => clearInterval(interval);
    }, []);


    const navigation = [
        { name: 'Overview', path: '/', icon: LayoutDashboard },
        { name: 'Controls', path: '/controls', icon: Sliders },
        { name: 'Monitoring', path: '/monitoring', icon: Activity },
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
        { name: 'Settings', path: '/settings', icon: SettingsIcon },
    ];

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className={`dashboard-sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
                {/* Logo */}
                <div style={{ padding: '24px', borderBottom: `1px solid var(--md-border)` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                background: 'var(--md-primary)',
                                borderRadius: 'var(--md-radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Activity size={24} color="white" />
                        </div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>ControlStack</h1>
                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--md-text-secondary)' }}>
                                Web Bridge v1.0
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '16px 0' }}>
                    <ul className="nav-list">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.path} className="nav-item">
                                    <Link
                                        to={item.path}
                                        className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                                    >
                                        <Icon size={20} />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Connection Status */}
                <div style={{ padding: '16px', borderTop: `1px solid var(--md-border)` }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            background: connected
                                ? 'rgba(76, 175, 80, 0.1)'
                                : 'rgba(244, 67, 54, 0.1)',
                            borderRadius: 'var(--md-radius-sm)',
                            border: `1px solid ${connected ? 'var(--md-success)' : 'var(--md-error)'}`,
                        }}
                    >
                        {connected ? (
                            <Wifi size={16} color="var(--md-success)" />
                        ) : (
                            <WifiOff size={16} color="var(--md-error)" />
                        )}
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '12px', fontWeight: 500 }}>
                                {connected ? 'Connected' : 'Disconnected'}
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--md-text-secondary)' }}>
                                {connected ? `Refnum: ${bridge.getRefnum()}` : 'No LabVIEW connection'}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`dashboard-main ${!sidebarOpen ? 'expanded' : ''}`}>
                {/* App Bar */}
                <header className="dashboard-appbar">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px',
                            marginRight: '16px',
                            color: 'var(--md-text-primary)',
                        }}
                    >
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <div style={{ flex: 1 }}>
                        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 500 }}>
                            {navigation.find((item) => isActive(item.path))?.name || 'Dashboard'}
                        </h2>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '14px', color: 'var(--md-text-secondary)' }}>
                            {new Date().toLocaleTimeString()}
                        </span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="dashboard-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
