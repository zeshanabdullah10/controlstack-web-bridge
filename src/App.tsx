
import { useState, useEffect } from 'react';
import bridge from './lib/bridge';
import { useLabVIEW } from './hooks/useLabVIEW';
import StatusIndicator from './components/StatusIndicator';
import { BooleanToggle } from './components/BooleanToggle';
import { BooleanLED } from './components/BooleanLED';
import { NumericKnob } from './components/NumericKnob';
import { NumericSlider } from './components/NumericSlider';
import { NumericGauge } from './components/NumericGauge';
import { WaveformChart } from './components/WaveformChart';
import { Tank } from './components/Tank';
import { NumericDigital } from './components/NumericDigital';
import { Thermometer } from './components/Thermometer';


import { Activity, Radio, Cpu, Settings, Power, Palette } from 'lucide-react';
import { Button } from "@/components/ui/button"

type Theme = 'cyberpunk' | 'industrial' | 'modern';

function App() {
  // Use hooks for specific tags
  const [speed, setSpeed] = useLabVIEW<number>('Motor_A_Speed', 0);
  const [rfSignal, _] = useLabVIEW<number[]>('Drone_RF_Signal', [0, 0, 0, 0, 0]); // Read only
  const [powerState, setPowerState] = useLabVIEW<boolean>('Power_Main', true);

  // Local Settings State (Mocking LabVIEW tags for demo)
  const [pid, setPid] = useState({ p: 70, i: 30, d: 10 });
  const [relays, setRelays] = useState({ r1: true, r2: false });
  const [history, setHistory] = useState<number[]>(new Array(50).fill(0));
  const [tankLevel, setTankLevel] = useState(45);

  // App State
  const [simulating, setSimulating] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>('cyberpunk');

  useEffect(() => {
    if (!simulating) return;

    // Simulate Handshake
    bridge.setRefnum(8080);

    const interval = setInterval(() => {
      const t = Date.now() / 1000;
      // ... existing simulation code ...
      // Simulate RF Signal (Random Array)
      const newSignal = Array.from({ length: 20 }, (_, i) =>
        Math.min(1, Math.max(0, 0.5 + 0.5 * Math.sin(t * 2 + i * 0.5) + (Math.random() - 0.5) * 0.2))
      );
      bridge.updateState({ tag: 'Drone_RF_Signal', value: newSignal });

      // Update History for Chart
      setHistory(prev => [...prev.slice(1), speed + (Math.random() - 0.5) * 5]);

      // Update Tank Level (slow drift)
      setTankLevel(prev => {
        const target = speed;
        return prev + (target - prev) * 0.1;
      });
    }, 50); // 20Hz update

    return () => clearInterval(interval);
  }, [simulating]);

  return (
    <div className="app-container" data-theme={currentTheme}>
      {/* Header */}
      <header className="app-header">
        <div className="container header-content">
          <div className="brand-section">
            <div className="logo-box">
              <Activity className="text-black" size={20} color="#000" />
            </div>
            <h1 className="app-title">CS-WebBridge<span>.v2</span></h1>
          </div>
          <div className="controls-section">

            {/* Theme Switcher */}
            <div className="flex items-center gap-2 mr-4 bg-[var(--color-surface)] p-1 rounded-full border border-[var(--color-border)]">
              <Palette size={14} className="ml-2 text-[var(--color-text-dim)]" />
              {['cyberpunk', 'industrial', 'modern'].map((theme) => (
                <button
                  key={theme}
                  onClick={() => setCurrentTheme(theme as Theme)}
                  className={`px-3 py-1 rounded-full text-xs font-mono uppercase transition-all ${currentTheme === theme ? 'bg-[var(--color-primary)] text-black font-bold' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'}`}
                >
                  {theme}
                </button>
              ))}
            </div>

            <Button
              onClick={() => setSimulating(!simulating)}
              variant={simulating ? "destructive" : "default"}
            >
              {simulating ? 'STOP SIMULATION' : 'START SIMULATION'}
            </Button>
            <StatusIndicator />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">

        {/* TOP ROW: Motor Control */}
        <div className="dashboard-grid mb-8">

          {/* Card 1: Motor A Control */}
          <div className="card glow">
            <div className="card-header">
              <span className="card-title"><Cpu size={16} /> Motor Drive A</span>
              <BooleanLED value={speed > 0} label="RUNNING" size="sm" color="var(--color-success)" />
            </div>

            <div className="flex items-center justify-around py-4">
              {/* Knob for Input */}
              <NumericKnob
                label="Set Point"
                value={speed}
                onChange={setSpeed}
                min={0}
                max={100}
                unit="%"
                size={100}
              />

              {/* Gauge for Feedback (same var for now) */}
              <NumericGauge
                label="Actual RPM"
                value={speed * 45} // Fake RPM scaling
                min={0}
                max={4500}
                unit="RPM"
                size={140}
                thresholds={{ 3500: 'var(--color-warning)', 4200: 'var(--color-error)' }}
              />
            </div>

            <div className="mode-controls mt-auto">
              <BooleanToggle
                label="Master Power"
                value={powerState}
                onChange={setPowerState}
                variant="switch"
              />
              <div className="flex-1"></div>
              <NumericDigital label="CURR" value={speed * 0.12} unit="A" digits={3} />
            </div>
          </div>

          {/* New Card: Tank & Levels */}
          <div className="card">
            <div className="card-header">
              <span className="card-title text-blue-400">Reservoir A-1</span>
            </div>
            <div className="flex justify-around items-center h-full">
              <Tank label="Fuel Level" value={tankLevel} color="var(--color-primary)" />
              <Thermometer label="Outlet" value={24.5 + speed * 0.15} />
              <div className="flex flex-col gap-4">
                <NumericDigital label="TEMP" value={24.5 + speed * 0.1} unit="°C" precision={1} />
                <NumericDigital label="PRESS" value={101.3 + speed * 0.05} unit="kPa" precision={1} />
                <BooleanLED value={tankLevel > 80} label="HIGH" color="var(--color-error)" size="sm" />
                <BooleanLED value={tankLevel < 20} label="LOW" color="var(--color-warning)" size="sm" />
              </div>
            </div>
          </div>

          {/* Card 2: Sliders & Settings */}
          <div className="card">
            <div className="card-header">
              <span className="card-title"><Settings size={16} /> PID Tuner</span>
            </div>
            <div className="flex gap-4 h-full items-end justify-center pb-4">
              <NumericSlider
                label="P"
                value={pid.p}
                onChange={(v) => setPid(p => ({ ...p, p: v }))}
                vertical
                unit=" "
              />
              <NumericSlider
                label="I"
                value={pid.i}
                onChange={(v) => setPid(p => ({ ...p, i: v }))}
                vertical
                unit=" "
              />
              <NumericSlider
                label="D"
                value={pid.d}
                onChange={(v) => setPid(p => ({ ...p, d: v }))}
                vertical
                unit=" "
              />
            </div>
          </div>

          {/* Card 3: Logic Gates / Boolean Test */}
          <div className="card">
            <div className="card-header">
              <span className="card-title"><Power size={16} /> Logic IO</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-[var(--color-surface-hover)] p-3 rounded flex flex-col items-center gap-2">
                <span className="text-xs text-[var(--color-text-dim)]">RELAY 1</span>
                <BooleanToggle
                  value={relays.r1}
                  onChange={(v) => setRelays(r => ({ ...r, r1: v }))}
                  variant="rocker"
                />
              </div>
              <div className="bg-[var(--color-surface-hover)] p-3 rounded flex flex-col items-center gap-2">
                <span className="text-xs text-[var(--color-text-dim)]">RELAY 2</span>
                <BooleanToggle
                  value={relays.r2}
                  onChange={(v) => setRelays(r => ({ ...r, r2: v }))}
                  variant="rocker"
                />
              </div>

              <div className="col-span-2 flex justify-around mt-4">
                <BooleanLED value={relays.r1} label="PWR" color="var(--color-success)" />
                <BooleanLED value={relays.r2} label="WARN" color="var(--color-warning)" />
                <BooleanLED value={relays.r1 && relays.r2} label="ERR" color="var(--color-error)" shape="square" />
              </div>
            </div>
          </div>

          {/* FULL WIDTH: Waveform Chart */}
          <div className="card col-span-1 lg:col-span-3">
            <div className="card-header">
              <span className="card-title"><Activity size={16} /> Real-time Telemetry</span>
              <div className="flex gap-2">
                <span className="text-[10px] font-mono text-[var(--color-text-dim)]">BUFFER: 50pts</span>
                <span className="text-[10px] font-mono text-[var(--color-text-dim)]">AUTO-SCALE: ON</span>
              </div>
            </div>
            <WaveformChart
              data={history}
              min={-10}
              max={110}
              label="Output Power Factor"
              color="var(--color-primary)"
              size={{ width: '100%', height: 200 }}
            />
          </div>

        </div>

        {/* BOTTOM ROW: Spectrum */}
        <div className="card w-full">
          <div className="card-header">
            <span className="card-title"><Radio size={16} /> Spectrum Analysis</span>
            <div className="flex gap-2">
              <span className="badge badge-amber">Channel 4</span>
              <span className="badge badge-amber">2.4GHz</span>
            </div>
          </div>

          <div className="spectrum-grid">
            {rfSignal.map((val, i) => (
              <div
                key={i}
                className="spectrum-bar"
                style={{
                  height: `${val * 100}%`,
                  backgroundColor: val > 0.8 ? 'var(--color-error)' : val > 0.5 ? 'var(--color-warning)' : 'var(--color-secondary)'
                }}
              />
            ))}
          </div>
          <div className="spectrum-labels">
            <span>0Hz</span>
            <span>10kHz</span>
            <span>20kHz</span>
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
