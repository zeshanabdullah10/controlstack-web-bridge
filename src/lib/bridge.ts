
// src/lib/bridge.ts

type TagValue = number | string | boolean | number[] | object;

interface LabVIEWUpdatePayload {
    tag: string;
    value: TagValue;
    timestamp?: number;
}

interface WebToLabVIEWPayload {
    tag: string;
    data: any;
}

// Extend the Window interface to include LabVIEW and our Bridge
declare global {
    interface Window {
        // The Standard LabVIEW WebView Injection (mocked if missing)
        LabVIEW?: {
            FireUserEvent: (refnum: number, jsonString: string) => void;
        };
        // Our ControlStack Bridge
        labviewBridge: ControlStackBridge;
    }
}

class ControlStackBridge {
    private refnum: number | null = null;
    public store: Map<string, TagValue> = new Map();
    private subscribers: Map<string, Set<(value: TagValue) => void>> = new Map();

    constructor() {
        this.store = new Map();
        this.subscribers = new Map();
    }

    // --- Public API called by LabVIEW ---

    /**
     * ESTABLISH HANDSHAKE
     * Called by LabVIEW: window.labviewBridge.setRefnum(12345)
     */
    public setRefnum(args: number | string | { refnum: number }) {
        let extracted: number | null = null;

        try {
            if (typeof args === 'number') {
                extracted = args;
            } else if (typeof args === 'object' && args !== null && 'refnum' in args) {
                extracted = (args as any).refnum;
            } else if (typeof args === 'string') {
                // Try parsing as JSON first
                try {
                    const parsed = JSON.parse(args);
                    if (typeof parsed === 'object' && parsed !== null && 'refnum' in parsed) {
                        extracted = parsed.refnum;
                    } else if (typeof parsed === 'number') {
                        extracted = parsed;
                    }
                } catch {
                    // If not JSON, maybe just a raw number string "1234"
                    extracted = parseFloat(args);
                }
            }

            if (extracted !== null && !isNaN(extracted)) {
                console.log(`[CS-WebBridge] Handshake established. Refnum: ${extracted}`);
                this.refnum = extracted;
                return `Connected to Refnum: ${extracted}`;
            } else {
                console.error(`[CS-WebBridge] Invalid refnum received:`, args);
                return `Error: Invalid refnum ${JSON.stringify(args)}`;
            }
        } catch (e) {
            console.error(`[CS-WebBridge] Error processing setRefnum:`, e);
            return `Error: ${e}`;
        }
    }

    /**
     * RECEIVE DATA
     * Called by LabVIEW: window.labviewBridge.updateState(json_string)
     */
    public updateState(jsonString: string | LabVIEWUpdatePayload) {
        try {
            const payload: LabVIEWUpdatePayload = typeof jsonString === 'string'
                ? JSON.parse(jsonString)
                : jsonString;

            const { tag, value } = payload;

            // Update Store
            this.store.set(tag, value);

            // Notify Subscribers
            if (this.subscribers.has(tag)) {
                this.subscribers.get(tag)?.forEach((callback) => callback(value));
            }

            // console.debug(`[CS-WebBridge] Updated ${tag}:`, value);
        } catch (e) {
            console.error("[CS-WebBridge] Failed to parse updateState payload", e);
        }
    }

    // --- Internal API called by React Hooks ---

    public subscribe(tag: string, callback: (value: TagValue) => void) {
        if (!this.subscribers.has(tag)) {
            this.subscribers.set(tag, new Set());
        }
        this.subscribers.get(tag)?.add(callback);

        // If we already have a value, call immediately
        if (this.store.has(tag)) {
            callback(this.store.get(tag)!);
        }

        // Return unsubscribe function
        return () => {
            this.subscribers.get(tag)?.delete(callback);
        };
    }

    public sendToLabVIEW(tag: string, data: any) {
        if (this.refnum === null) {
            console.warn("[CS-WebBridge] Cannot send to LabVIEW: Handshake not established (Refnum missing).");
            return;
        }

        const payload: WebToLabVIEWPayload = { tag, data };
        const jsonString = JSON.stringify(payload);

        if (window.LabVIEW && window.LabVIEW.FireUserEvent) {
            window.LabVIEW.FireUserEvent(this.refnum, jsonString);
            console.log(`[CS-WebBridge] Sent to Ref ${this.refnum}:`, payload);
        } else {
            console.warn("[CS-WebBridge] window.LabVIEW.FireUserEvent is missing. Are we running in LabVIEW?");
        }
    }

    // Helper for simulation/debug
    public getRefnum() {
        return this.refnum;
    }
}

// Initialize the global bridge instance
const bridge = new ControlStackBridge();
window.labviewBridge = bridge;

export default bridge;
