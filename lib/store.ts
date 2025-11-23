import { create } from 'zustand';

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO' | 'OK';
export type AlertStatus = 'ACTIVE' | 'RESOLVED' | 'DISMISSED';

export interface Alert {
  id: string;
  campaignId: string;
  metricName: string;
  severity: AlertSeverity;
  expected: number;
  actual: number;
  timestamp: Date;
  status: AlertStatus;
}

export interface Campaign {
  id: string;
  name: string;
  healthScore: number;
  alertStatus: AlertSeverity;
}

interface AppState {
  campaigns: Campaign[];
  alerts: Alert[];
  setCampaigns: (campaigns: Campaign[]) => void;
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Alert) => void;
  resolveAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  campaigns: [],
  alerts: [],
  setCampaigns: (campaigns) => set({ campaigns }),
  setAlerts: (alerts) => set({ alerts }),
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
  resolveAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id ? { ...a, status: 'RESOLVED' as AlertStatus } : a
      ),
    })),
  dismissAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id ? { ...a, status: 'DISMISSED' as AlertStatus } : a
      ),
    })),
}));

