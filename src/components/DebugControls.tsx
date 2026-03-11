import React, { useState, useEffect } from 'react';

interface DebugControlsProps {
    values: { [key: string]: number };
    onChange: (key: string, value: number) => void;
}

export const DebugControls: React.FC<DebugControlsProps> = ({ values, onChange }) => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-4 right-4 z-[9999] bg-red-600 text-white px-4 py-2 rounded shadow-lg"
            >
                Show Debug
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 z-[9999] bg-black/80 text-white p-4 rounded-lg shadow-xl w-80 border border-white/20 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-red-400">Debug Controls</h3>
                <button onClick={() => setIsVisible(false)} className="text-xs text-gray-400 hover:text-white">Hide</button>
            </div>

            <div className="space-y-4">
                {Object.entries(values).map(([key, value]) => (
                    <div key={key}>
                        <div className="flex justify-between text-xs mb-1">
                            <label>{key}</label>
                            <span className="font-mono text-cyan-400">{value.toFixed(2)}</span>
                        </div>
                        <input
                            type="range"
                            min={key.includes('Scale') ? 0.1 : 0}
                            max={key.includes('Scale') ? 5 : 20}
                            step={0.1}
                            value={value}
                            onChange={(e) => onChange(key, parseFloat(e.target.value))}
                            className="w-full accent-red-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
