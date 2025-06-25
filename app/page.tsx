import dynamic from "next/dynamic";

// Use dynamic import to avoid SSR issues with browser-only code
const VapiChat = dynamic(() => import("@/components/VapiChat"), {
  ssr: false,
});

export default function Page() {
  return (
    <div className={"grow flex flex-col h-[calc(100vh-4rem)]"}>
      <VapiChat />
    </div>
  );
}
