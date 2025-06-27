"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";

// Use dynamic import to avoid SSR issues with browser-only code
const VapiChat = dynamic(() => import("@/components/VapiChat"), {
  ssr: false,
});

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  return (
    <div
      className={
        "relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px]"
      }
    >
      <VapiChat />
    </div>
  );
}
