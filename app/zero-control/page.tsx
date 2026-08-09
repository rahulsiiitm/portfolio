import type { Metadata } from "next";

import ControlRoomEditorial from "./ControlRoomEditorial";

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
  return <ControlRoomEditorial />;
}
