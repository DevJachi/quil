"use client";

import { useState } from "react";
import axios from "axios";
import type { DeploymentInfo } from "../page";

interface Props {
  onDeploy: (info: DeploymentInfo) => void;
}

export default function DeployForm({ onDeploy }: Props) {
  const [githubUrl, setGithubUrl] = useState("");
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeploy = async () => {
    if (!githubUrl || !projectName) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post("http://localhost:3001/api/deploy", {
        projectName,
        githubUrl,
      });
      onDeploy({ name: data.name, port: data.port });
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.msg
          ? err.response.data.msg
          : "Deployment failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-4xl px-12">
      <div className="flex flex-wrap gap-3">
        <input
          type="url"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          placeholder="https://github.com/yourname/yourproject"
          className="flex-1 min-w-[260px] rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors duration-150"
          style={{ backgroundColor: "#0a0a0a", border: "1px solid #222" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#444")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#222")}
        />
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="your-project-name"
          className="min-w-[180px] max-w-[240px] rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors duration-150"
          style={{ backgroundColor: "#0a0a0a", border: "1px solid #222" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#444")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#222")}
        />
        <button
          onClick={handleDeploy}
          disabled={loading}
          className="bg-white text-black rounded-lg px-6 py-3 text-sm font-medium cursor-pointer whitespace-nowrap hover:bg-neutral-200 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Deploying..." : "Deploy"}
        </button>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}
