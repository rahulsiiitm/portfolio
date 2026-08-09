import type { Metadata } from "next";

import ControlRoom from "./ControlRoom";

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
  return <ControlRoom />;
}
