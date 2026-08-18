"use client";

import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import DeployForm from "./components/DeployForm";
import DeploymentCard from "./components/DeploymentCard";

export interface DeploymentInfo {
  name: string;
  port: number;
}

export default function Home() {
  const [deployment, setDeployment] = useState<DeploymentInfo | null>(null);

  return (
    <main className="min-h-screen bg-black flex flex-col items-start pt-32 pb-20 gap-10">
      <Header />
      <Hero />
      <DeployForm onDeploy={setDeployment} />
      <DeploymentCard deployment={deployment} />
    </main>
  );
}
