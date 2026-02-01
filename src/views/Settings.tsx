import { useState } from 'react';
import { Settings as SettingsIcon, Wifi, Database, Palette, Bell } from 'lucide-react';
import { ContentCard } from '../components/ContentCard';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';

export default function Settings() {
    const {
        theme, setTheme,
        primaryColor, setPrimaryColor,
        compactMode, setCompactMode
    } = useTheme();

    const {
        labviewRefnum, setLabviewRefnum,
        connectionTimeout, setConnectionTimeout,
        autoReconnect, setAutoReconnect,
        notifications, toggleNotification,
        tags, addTag, removeTag
    } = useSettings();

    const [newTag, setNewTag] = useState('');
    const [isTestingConnection, setIsTestingConnection] = useState(false);
    const [connectionResult, setConnectionResult] = useState<'success' | 'failure' | null>(null);

    const handleAddTag = () => {
        if (newTag.trim()) {
            addTag(newTag.trim());
            setNewTag('');
        }
    };

    const handleTestConnection = () => {
        setIsTestingConnection(true);
        setConnectionResult(null);
        // Simulate connection test
        setTimeout(() => {
            const success = Math.random() > 0.2; // 80% success chance for simulation
            setConnectionResult(success ? 'success' : 'failure');
            setIsTestingConnection(false);

            // Auto hide result after 3 seconds
            setTimeout(() => setConnectionResult(null), 3000);
        }, 1500);
    };

    return (
        <div>
            <div className="grid grid-cols-2 gap-6">
                {/* Connection Settings */}
                {/* Connection Settings */}
                <ContentCard title={<><Wifi size={20} /> Connection Settings</>}>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                LabVIEW Refnum
                            </label>
                            <input
                                type="number"
                                value={labviewRefnum}
                                onChange={(e) => setLabviewRefnum(Number(e.target.value))}
                                placeholder="8080"
                                className="w-full px-3 py-2 border rounded border-[var(--md-border)] bg-[var(--md-surface)] text-[var(--md-text-primary)]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Connection Timeout (ms)
                            </label>
                            <input
                                type="number"
                                value={connectionTimeout}
                                onChange={(e) => setConnectionTimeout(Number(e.target.value))}
                                placeholder="5000"
                                className="w-full px-3 py-2 border rounded border-[var(--md-border)] bg-[var(--md-surface)] text-[var(--md-text-primary)]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Auto-Reconnect
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={autoReconnect}
                                    onChange={(e) => setAutoReconnect(e.target.checked)}
                                />
                                <span style={{ fontSize: '14px', color: 'var(--md-text-secondary)' }}>
                                    Automatically reconnect on connection loss
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleTestConnection}
                                disabled={isTestingConnection}
                                style={{
                                    padding: '10px 16px',
                                    background: isTestingConnection ? 'var(--md-text-disabled)' : 'var(--md-primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--md-radius-sm)',
                                    cursor: isTestingConnection ? 'wait' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    marginTop: '8px',
                                }}
                            >
                                {isTestingConnection ? 'Testing...' : 'Test Connection'}
                            </button>

                            {connectionResult && (
                                <span className={`text-sm font-medium mt-2 ${connectionResult === 'success' ? 'text-[var(--md-success)]' : 'text-[var(--md-error)]'
                                    }`}>
                                    {connectionResult === 'success' ? 'Connection Successful!' : 'Connection Failed'}
                                </span>
                            )}
                        </div>
                    </div>
                </ContentCard>

                {/* Tag Management */}
                {/* Tag Management */}
                <ContentCard title={<><Database size={20} /> Tag Management</>}>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Add New Tag
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                    placeholder="Tag name..."
                                    className="flex-1 px-3 py-2 border rounded border-[var(--md-border)] bg-[var(--md-surface)] text-[var(--md-text-primary)]"
                                />
                                <button
                                    onClick={handleAddTag}
                                    style={{
                                        padding: '10px 20px',
                                        background: 'var(--md-primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 'var(--md-radius-sm)',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                    }}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Active Tags
                            </label>
                            <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-1">
                                {tags.length === 0 ? (
                                    <div className="text-sm text-[var(--md-text-secondary)] italic p-2 text-center">
                                        No tags configured
                                    </div>
                                ) : tags.map((tag) => (
                                    <div
                                        key={tag}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '8px 12px',
                                            background: 'var(--md-surface-hover)',
                                            borderRadius: 'var(--md-radius-sm)',
                                        }}
                                    >
                                        <span style={{ fontFamily: 'var(--md-font-mono)', fontSize: '14px' }}>{tag}</span>
                                        <button
                                            onClick={() => removeTag(tag)}
                                            style={{
                                                padding: '4px 8px',
                                                background: 'transparent',
                                                color: 'var(--md-error)',
                                                border: '1px solid var(--md-error)',
                                                borderRadius: 'var(--md-radius-sm)',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ContentCard>

                {/* Theme Settings */}
                {/* Theme Settings */}
                <ContentCard title={<><Palette size={20} /> Appearance</>}>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Theme
                            </label>
                            <select
                                value={theme}
                                onChange={(e) => setTheme(e.target.value as any)}
                                className="w-full px-3 py-2 border rounded border-[var(--md-border)] bg-[var(--md-surface)] text-[var(--md-text-primary)]"
                            >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="auto">Auto (System)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Primary Color
                            </label>
                            <div className="grid grid-cols-5 gap-2">
                                {['#2196F3', '#4CAF50', '#FF9800', '#F44336', '#9C27B0'].map((color) => (
                                    <div
                                        key={color}
                                        onClick={() => setPrimaryColor(color as any)}
                                        style={{
                                            width: '100%',
                                            aspectRatio: '1',
                                            background: color,
                                            borderRadius: 'var(--md-radius-sm)',
                                            cursor: 'pointer',
                                            border: primaryColor === color ? '3px solid var(--md-text-primary)' : '2px solid transparent',
                                            transform: primaryColor === color ? 'scale(1.1)' : 'scale(1)',
                                            transition: 'all 0.2s ease'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Compact Mode
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={compactMode}
                                    onChange={(e) => setCompactMode(e.target.checked)}
                                />
                                <span style={{ fontSize: '14px', color: 'var(--md-text-secondary)' }}>
                                    Reduce spacing and padding
                                </span>
                            </div>
                        </div>
                    </div>
                </ContentCard>

                {/* Notifications */}
                {/* Notifications */}
                <ContentCard title={<><Bell size={20} /> Notifications</>}>
                    <div className="flex flex-col gap-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Connection Alerts</span>
                                <input
                                    type="checkbox"
                                    checked={notifications.connection}
                                    onChange={() => toggleNotification('connection')}
                                />
                            </div>
                            <p className="text-xs text-[var(--md-text-secondary)] m-0">
                                Notify when connection is lost or restored
                            </p>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">System Warnings</span>
                                <input
                                    type="checkbox"
                                    checked={notifications.warnings}
                                    onChange={() => toggleNotification('warnings')}
                                />
                            </div>
                            <p className="text-xs text-[var(--md-text-secondary)] m-0">
                                Show warnings for threshold violations
                            </p>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Error Messages</span>
                                <input
                                    type="checkbox"
                                    checked={notifications.errors}
                                    onChange={() => toggleNotification('errors')}
                                />
                            </div>
                            <p className="text-xs text-[var(--md-text-secondary)] m-0">
                                Display error notifications
                            </p>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Sound Effects</span>
                                <input
                                    type="checkbox"
                                    checked={notifications.sound}
                                    onChange={() => toggleNotification('sound')}
                                />
                            </div>
                            <p className="text-xs text-[var(--md-text-secondary)] m-0">
                                Play sound for notifications
                            </p>
                        </div>
                    </div>
                </ContentCard>
            </div>

            {/* System Info */}
            <ContentCard title={<><SettingsIcon size={20} /> System Information</>} className="mt-6">
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <div className="text-xs text-[var(--md-text-secondary)] mb-1">
                            Version
                        </div>
                        <div className="text-base font-medium font-mono">
                            v2.0.0
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-[var(--md-text-secondary)] mb-1">
                            Build Date
                        </div>
                        <div className="text-base font-medium font-mono">
                            2026-01-31
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-[var(--md-text-secondary)] mb-1">
                            License
                        </div>
                        <div className="text-base font-medium">
                            MIT
                        </div>
                    </div>
                </div>
            </ContentCard>
        </div>
    );
}
