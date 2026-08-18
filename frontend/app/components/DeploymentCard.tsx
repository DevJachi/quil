"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { DeploymentInfo } from "../page";

interface Props {
  deployment: DeploymentInfo | null;
}

export default function DeploymentCard({ deployment }: Props) {
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const es = new EventSource("http://localhost:3001/api/logs/stream");

    es.onopen = () => {
      console.log("SSE connected");
    };

    es.onmessage = (event) => {
      console.log("Received log:", event.data);

      setLogs((prev) => [...prev, event.data]);
    };

    es.onerror = (error) => {
      console.log("SSE error:", error);
    };

    return () => {
      es.close();
    };
  }, []);

  // Scroll to the newest log
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [logs]);

  const hasLogs = logs.length > 0;

  return (
    <div className="w-full max-w-4xl px-12">
      <div
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: "#0d0d0d",
          border: "1px solid #1e1e1e",
        }}
      >
        {/* Card header */}
        <div className="px-8 pt-7 pb-0">
          <h2 className="text-xl font-semibold text-[#ccc] mb-2.5 tracking-[-0.02em]">
            Deployment
          </h2>

          <p className="text-sm text-[#555]">
            {deployment
              ? `Deploying ${deployment.name}...`
              : "Once you're ready, start deploying to see the progress here..."}
          </p>
        </div>

        {/* Logs */}
        {hasLogs ? (
          <div
            className="mx-8 mt-5 mb-6 rounded-lg p-4 font-mono text-xs text-[#aaa] overflow-y-auto max-h-[280px]"
            style={{
              backgroundColor: "#0a0a0a",
              border: "1px solid #1a1a1a",
            }}
          >
            {logs.map((log, i) => (
              <pre
                key={i}
                className="leading-5 whitespace-pre-wrap break-all"
              >
                {log}
              </pre>
            ))}

            <div ref={logsEndRef} />
          </div>
        ) : (
          <div className="relative w-full h-[280px] mt-4">
            <Image
              src="/assets/world.png"
              alt="World wireframe"
              fill
              className="object-cover object-top opacity-60 invert"
            />
          </div>
        )}
      </div>
    </div>
  );
}