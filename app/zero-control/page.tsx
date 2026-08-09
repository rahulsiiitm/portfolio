import type { Metadata } from "next";

import ControlRoomEditorial from "./ControlRoomEditorial";
import "./zero-control-v2.css";

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
    <div className="zero-control-v2">
      <div className="zero-rhombus zero-rhombus-a" />
      <div className="zero-rhombus zero-rhombus-b" />
      <div className="zero-rhombus zero-rhombus-c" />
      <ControlRoomEditorial />
    </div>
  );
}
