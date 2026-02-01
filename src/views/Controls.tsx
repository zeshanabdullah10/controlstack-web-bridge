import { useState } from 'react';
import { ContentCard } from '../components/ContentCard';
import { useLabVIEW } from '../hooks/useLabVIEW';
import { Cpu, Settings, Power, Thermometer as ThermometerIcon } from 'lucide-react';
import { BooleanToggle } from '../components/BooleanToggle';
import { BooleanLED } from '../components/BooleanLED';
import { NumericKnob } from '../components/NumericKnob';
import { NumericSlider } from '../components/NumericSlider';
import { NumericGauge } from '../components/NumericGauge';
import { NumericDigital } from '../components/NumericDigital';
import { Tank } from '../components/Tank';
import { Thermometer } from '../components/Thermometer';

export default function Controls() {
    const [speed, setSpeed] = useLabVIEW<number>('Motor_A_Speed', 0);
    const [powerState, setPowerState] = useLabVIEW<boolean>('Power_Main', true);

    const [pid, setPid] = useState({ p: 70, i: 30, d: 10 });
    const [relays, setRelays] = useState({ r1: true, r2: false, r3: false, r4: true });
    const [tankLevel, setTankLevel] = useState(45);
    const [temperature, setTemperature] = useState(24.5);

    // Advanced Settings State
    const [sampleRate, setSampleRate] = useState('50 Hz');
    const [controlMode, setControlMode] = useState('PID');
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleApply = () => {
        showToast(`Settings applied: ${controlMode} mode at ${sampleRate}`);
    };

    const handleReset = () => {
        setSampleRate('50 Hz');
        setControlMode('PID');
        showToast('Settings reset to defaults');
    };

    return (
        <div className="relative">
            {toastMessage && (
                <div className="fixed top-24 right-6 bg-[var(--md-surface)] border border-[var(--md-success)] text-[var(--md-success)] px-4 py-3 rounded shadow-lg z-50 flex items-center gap-2 animate-bounce-in">
                    <span className="text-sm font-medium">{toastMessage}</span>
                </div>
            )}
            <div className="grid grid-cols-3 gap-6">
                {/* Motor Control */}
                <ContentCard
                    title={<><Cpu size={20} /> Motor Drive A</>}
                    action={<BooleanLED value={speed > 0} label="RUNNING" size="sm" color="var(--md-success)" />}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '24px' }}>
                        <NumericKnob
                            label="Set Point"
                            value={speed}
                            onChange={setSpeed}
                            min={0}
                            max={100}
                            unit="%"
                            size={100}
                        />
                        <NumericGauge
                            label="Actual RPM"
                            value={speed * 45}
                            min={0}
                            max={4500}
                            unit="RPM"
                            size={140}
                            thresholds={{ 3500: 'var(--md-warning)', 4200: 'var(--md-error)' }}
                        />
                    </div>
                    <div style={{ borderTop: '1px solid var(--md-border)', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <BooleanToggle
                            label="Master Power"
                            value={powerState}
                            onChange={setPowerState}
                            variant="switch"
                        />
                        <div style={{ flex: 1 }} />
                        <NumericDigital label="CURR" value={speed * 0.12} unit="A" digits={3} />
                    </div>
                </ContentCard>

                {/* PID Tuner */}
                <ContentCard title={<><Settings size={20} /> PID Tuner</>}>
                    <div style={{ display: 'flex', gap: '24px', height: '280px', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <NumericSlider
                            label="P"
                            value={pid.p}
                            onChange={(v) => setPid((p) => ({ ...p, p: v }))}
                            vertical
                            unit=" "
                        />
                        <NumericSlider
                            label="I"
                            value={pid.i}
                            onChange={(v) => setPid((p) => ({ ...p, i: v }))}
                            vertical
                            unit=" "
                        />
                        <NumericSlider
                            label="D"
                            value={pid.d}
                            onChange={(v) => setPid((p) => ({ ...p, d: v }))}
                            vertical
                            unit=" "
                        />
                    </div>
                    <div style={{ marginTop: '16px', padding: '12px', background: 'var(--md-surface-hover)', borderRadius: 'var(--md-radius-sm)' }}>
                        <div style={{ fontSize: '12px', color: 'var(--md-text-secondary)', marginBottom: '8px' }}>
                            Current Values
                        </div>
                        <div style={{ fontFamily: 'var(--md-font-mono)', fontSize: '14px' }}>
                            P={pid.p.toFixed(1)} | I={pid.i.toFixed(1)} | D={pid.d.toFixed(1)}
                        </div>
                    </div>
                </ContentCard>

                {/* Logic IO */}
                <ContentCard title={<><Power size={20} /> Logic IO</>}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {Object.entries(relays).map(([key, value], index) => (
                            <div
                                key={key}
                                style={{
                                    background: 'var(--md-surface-hover)',
                                    padding: '16px',
                                    borderRadius: 'var(--md-radius-sm)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '12px',
                                }}
                            >
                                <span style={{ fontSize: '12px', color: 'var(--md-text-secondary)', fontWeight: 500 }}>
                                    RELAY {index + 1}
                                </span>
                                <BooleanToggle
                                    value={value}
                                    onChange={(v) => setRelays((r) => ({ ...r, [key]: v }))}
                                    variant="rocker"
                                />
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-around', padding: '16px', background: 'var(--md-surface-hover)', borderRadius: 'var(--md-radius-sm)' }}>
                        <BooleanLED value={relays.r1} label="PWR" color="var(--md-success)" />
                        <BooleanLED value={relays.r2} label="WARN" color="var(--md-warning)" />
                        <BooleanLED value={relays.r3} label="ERR" color="var(--md-error)" shape="square" />
                        <BooleanLED value={relays.r4} label="AUX" color="var(--md-primary)" />
                    </div>
                </ContentCard>

                {/* Tank & Levels */}
                <ContentCard title={<><ThermometerIcon size={20} /> Reservoir A-1</>}>
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                        <Tank label="Fuel Level" value={tankLevel} color="var(--md-primary)" />
                        <Thermometer label="Outlet" value={temperature + speed * 0.15} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <NumericDigital label="TEMP" value={temperature + speed * 0.1} unit="°C" precision={1} />
                            <NumericDigital label="PRESS" value={101.3 + speed * 0.05} unit="kPa" precision={1} />
                            <BooleanLED value={tankLevel > 80} label="HIGH" color="var(--md-error)" size="sm" />
                            <BooleanLED value={tankLevel < 20} label="LOW" color="var(--md-warning)" size="sm" />
                        </div>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                        <label style={{ fontSize: '12px', color: 'var(--md-text-secondary)', display: 'block', marginBottom: '8px' }}>
                            Tank Level Control
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={tankLevel}
                            onChange={(e) => setTankLevel(Number(e.target.value))}
                            style={{ width: '100%' }}
                        />
                    </div>
                </ContentCard>

                {/* Temperature Control */}
                <ContentCard title="Temperature Control">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px', display: 'block' }}>
                                Setpoint: {temperature.toFixed(1)}°C
                            </label>
                            <NumericSlider
                                label="Temperature"
                                value={temperature}
                                onChange={setTemperature}
                                min={15}
                                max={35}
                                unit="°C"
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div style={{ padding: '12px', background: 'var(--md-surface-hover)', borderRadius: 'var(--md-radius-sm)', textAlign: 'center' }}>
                                <div style={{ fontSize: '12px', color: 'var(--md-text-secondary)' }}>Current</div>
                                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--md-primary)' }}>
                                    {(temperature + speed * 0.1).toFixed(1)}°C
                                </div>
                            </div>
                            <div style={{ padding: '12px', background: 'var(--md-surface-hover)', borderRadius: 'var(--md-radius-sm)', textAlign: 'center' }}>
                                <div style={{ fontSize: '12px', color: 'var(--md-text-secondary)' }}>Error</div>
                                <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--md-error)' }}>
                                    {(speed * 0.1).toFixed(1)}°C
                                </div>
                            </div>
                        </div>
                    </div>
                </ContentCard>

                {/* Advanced Settings */}
                <ContentCard title="Advanced Settings">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                                Sample Rate (Hz)
                            </label>
                            <select
                                value={sampleRate}
                                onChange={(e) => setSampleRate(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid var(--md-border)',
                                    borderRadius: 'var(--md-radius-sm)',
                                    background: 'var(--md-surface)',
                                    color: 'var(--md-text-primary)',
                                    fontSize: '14px',
                                }}
                            >
                                <option>10 Hz</option>
                                <option>20 Hz</option>
                                <option>50 Hz</option>
                                <option>100 Hz</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                                Control Mode
                            </label>
                            <select
                                value={controlMode}
                                onChange={(e) => setControlMode(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid var(--md-border)',
                                    borderRadius: 'var(--md-radius-sm)',
                                    background: 'var(--md-surface)',
                                    color: 'var(--md-text-primary)',
                                    fontSize: '14px',
                                }}
                            >
                                <option>Manual</option>
                                <option>Automatic</option>
                                <option>PID</option>
                                <option>Cascade</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                            <button
                                onClick={handleApply}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    background: 'var(--md-primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--md-radius-sm)',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                }}
                            >
                                Apply
                            </button>
                            <button
                                onClick={handleReset}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    background: 'transparent',
                                    color: 'var(--md-text-primary)',
                                    border: '1px solid var(--md-border)',
                                    borderRadius: 'var(--md-radius-sm)',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                }}
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </ContentCard>
            </div>
        </div>
    );
}
