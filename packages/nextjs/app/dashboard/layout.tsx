import React from "react";
import "../../styles/globals.css";
import ProtectedLayout from "./_components/protected-layout";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
