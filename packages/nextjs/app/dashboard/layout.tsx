import React from "react";
import "../../styles/globals.css";
import ProtectedLayout from "./_components/protected-layout";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <ProtectedLayout>{children}</ProtectedLayout>
    </section>
  );
}
