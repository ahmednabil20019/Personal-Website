import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
    activeProjectId: string | null;
    activeCertId: string | null;
    openProject: (id: string) => void;
    closeProject: () => void;
    openCert: (id: string) => void;
    closeCert: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [activeCertId, setActiveCertId] = useState<string | null>(null);

    const openProject = (id: string) => {
        setActiveProjectId(id);
        // Close others
        setActiveCertId(null);
    };

    const closeProject = () => setActiveProjectId(null);

    const openCert = (id: string) => {
        setActiveCertId(id);
        // Close others
        setActiveProjectId(null);
    };

    const closeCert = () => setActiveCertId(null);

    return (
        <ModalContext.Provider value={{
            activeProjectId,
            activeCertId,
            openProject,
            closeProject,
            openCert,
            closeCert
        }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
