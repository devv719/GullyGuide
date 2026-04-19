"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChatIndexPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the default/mock chat view
    router.replace("/dashboard/chat/g1");
  }, [router]);

  return <div className="p-8 text-zinc-500 font-medium">Loading messages...</div>;
}
