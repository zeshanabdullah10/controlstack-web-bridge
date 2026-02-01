
import { useState, useEffect, useCallback } from 'react';
import bridge from '../lib/bridge';

/**
 * Hook to synchronize state with LabVIEW
 * @param tag The tag name (e.g., "Motor_Speed")
 * @param initialValue Default value before first update
 */
export function useLabVIEW<T = any>(tag: string, initialValue: T): [T, (data: T) => void] {
    // Initialize state from bridge store if available, else initialValue
    const [value, setValue] = useState<T>(() => {
        if (bridge.store.has(tag)) {
            return bridge.store.get(tag) as T;
        }
        return initialValue;
    });

    useEffect(() => {
        // Subscribe to bridge updates
        const unsubscribe = bridge.subscribe(tag, (newValue) => {
            setValue(newValue as T);
        });

        return () => {
            unsubscribe();
        };
    }, [tag]);

    // Setter function to send data back to LabVIEW
    const sendToLabVIEW = useCallback((data: T) => {
        // Optimistic update: Update local state immediately for UI responsiveness
        setValue(data);

        // Dispatch to LabVIEW
        bridge.sendToLabVIEW(tag, data);
    }, [tag]);

    return [value, sendToLabVIEW];
}
