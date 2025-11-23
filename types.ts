export type AlertSeverity = 'OK' | 'WARNING' | 'CRITICAL' | 'INFO';

export interface Alert {
  severity: AlertSeverity;
  id?: string;
  campaignId?: string;
  metricName?: string;
  expected?: number;
  actual?: number;
  timestamp?: Date;
  status?: string;
}

export interface Campaign {
  id: string;
  name: string;
  healthScore: number;
  alerts: Alert[];
}

export interface CampaignWithAlertStatus {
  id: string;
  name: string;
  healthScore: number;
  alertStatus: AlertSeverity;
}

