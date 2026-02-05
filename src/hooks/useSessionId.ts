"use client";

import { useEffect, useState } from "react";
import { getSessionId } from "@/lib/session";

export function useSessionId() {
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  return sessionId;
}
