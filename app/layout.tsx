import type { Metadata } from "next";
import "./globals.css";
import AnomalyDetectionClient from "./api/anomaly-detection/AnomalyDetectionClient";

export const metadata: Metadata = {
  title: "Radar - AI Ad Campaign Anomaly Alert Dashboard",
  description: "AI-powered ad campaign anomaly detection and alerting",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <AnomalyDetectionClient />
      </body>
    </html>
  );
}

