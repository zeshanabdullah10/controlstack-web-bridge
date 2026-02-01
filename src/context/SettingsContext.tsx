import React, { createContext, useContext, useEffect, useState } from 'react';

interface SettingsContextType {
    labviewRefnum: number;
    setLabviewRefnum: (val: number) => void;
    connectionTimeout: number;
    setConnectionTimeout: (val: number) => void;
    autoReconnect: boolean;
    setAutoReconnect: (val: boolean) => void;
    notifications: {
        connection: boolean;
        warnings: boolean;
        errors: boolean;
        sound: boolean;
    };
    toggleNotification: (key: keyof SettingsContextType['notifications']) => void;
    tags: string[];
    addTag: (tag: string) => void;
    removeTag: (tag: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [labviewRefnum, setLabviewRefnum] = useState<number>(() => {
        return Number(localStorage.getItem('labviewRefnum')) || 8080;
    });

    const [connectionTimeout, setConnectionTimeout] = useState<number>(() => {
        return Number(localStorage.getItem('connectionTimeout')) || 5000;
    });

    const [autoReconnect, setAutoReconnect] = useState<boolean>(() => {
        const stored = localStorage.getItem('autoReconnect');
        return stored === null ? true : stored === 'true';
    });

    const [notifications, setNotifications] = useState(() => {
        const stored = localStorage.getItem('notifications');
        return stored ? JSON.parse(stored) : {
            connection: true,
            warnings: true,
            errors: true,
            sound: false
        };
    });

    const [tags, setTags] = useState<string[]>(() => {
        const stored = localStorage.getItem('userTags');
        return stored ? JSON.parse(stored) : ['Motor_A_Speed', 'Power_Main', 'Drone_RF_Signal', 'Temperature', 'Pressure'];
    });

    useEffect(() => {
        localStorage.setItem('labviewRefnum', String(labviewRefnum));
    }, [labviewRefnum]);

    useEffect(() => {
        localStorage.setItem('connectionTimeout', String(connectionTimeout));
    }, [connectionTimeout]);

    useEffect(() => {
        localStorage.setItem('autoReconnect', String(autoReconnect));
    }, [autoReconnect]);

    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    useEffect(() => {
        localStorage.setItem('userTags', JSON.stringify(tags));
    }, [tags]);

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications((prev: any) => ({ ...prev, [key]: !prev[key] }));
    };

    const addTag = (tag: string) => {
        if (!tags.includes(tag)) {
            setTags([...tags, tag]);
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    return (
        <SettingsContext.Provider value={{
            labviewRefnum, setLabviewRefnum,
            connectionTimeout, setConnectionTimeout,
            autoReconnect, setAutoReconnect,
            notifications, toggleNotification,
            tags, addTag, removeTag
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
