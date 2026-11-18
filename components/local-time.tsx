"use client";

import { useEffect, useState } from "react";

/** The current time at an office, updated every half minute. Empty until the page is live. */
export function LocalTime({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone, timeZoneName: "short" });
    const update = () => setTime(format.format(new Date()));
    const first = window.setTimeout(update, 0);
    const timer = window.setInterval(update, 30000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, [timeZone]);

  return <span suppressHydrationWarning>{time}</span>;
}
