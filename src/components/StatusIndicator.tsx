
import { useEffect, useState } from 'react';
import bridge from '../lib/bridge';
import { Wifi, WifiOff } from 'lucide-react';

export default function StatusIndicator() {
    const [refnum, setRefnum] = useState<number | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setRefnum(bridge.getRefnum());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const isConnected = refnum !== null;

    return (
        <div className={`status-pill ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span className="status-text">
                {isConnected ? `Linked: Ref #${refnum}` : 'No Signal'}
            </span>
        </div>
    );
}
