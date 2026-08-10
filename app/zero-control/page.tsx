import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import ControlRoomEditorial from "./ControlRoomEditorial";
import "./zero-control-v2.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ZERO Control",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function ZeroControlPage() {
  return (
    <div className={`${manrope.variable} zero-control-v2`}>
      <ControlRoomEditorial />
    </div>
  );
}
