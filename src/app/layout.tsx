import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import StyledComponentsRegistry from "./StyledComponentsRegistry";
import "./globals.css";

export const metadata: Metadata = {
  title: "Construction Pro | Management System",
  description: "ระบบบริหารงานก่อสร้าง",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body>
        <AntdRegistry>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </AntdRegistry>
      </body>
    </html>
  );
}
