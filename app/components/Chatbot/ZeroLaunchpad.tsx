"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Compass,
  LockKeyhole,
  ScanSearch,
} from "lucide-react";

type LaunchpadProps = {
  disabled: boolean;
  onExplore: () => void;
  onIntent: (prompt: string) => void;
  onProject: (project: string) => void;
};

const projects = [
  { name: "SUTRA", className: "zero-node--sutra" },
  { name: "VIDCHAIN", className: "zero-node--vidchain" },
  { name: "AGRIHIVE", className: "zero-node--agrihive" },
  { name: "VYOMA", className: "zero-node--vyoma" },
];

const routes = [
  {
    index: "01",
    signal: "ROLE MATCH",
    action: "Brief",
    title: "Hire Rahul",
    description: "Build an evidence-backed role fit.",
    icon: BriefcaseBusiness,
    prompt: "Could Rahul be a fit for my team? Start by asking what role I am hiring for.",
  },
  {
    index: "02",
    signal: "CASE FILES",
    action: "Inspect",
    title: "Inspect his work",
    description: "Open the engineering behind his best systems.",
    icon: ScanSearch,
    prompt: "Show me the engineering behind Rahul's strongest projects and let me choose one to inspect.",
  },
  {
    index: "03",
    signal: "LIVE TRIAL",
    action: "Challenge",
    title: "Challenge Zero",
    description: "Give Rahul a real technical problem.",
    icon: Code2,
    prompt: "I want to give Rahul a technical challenge. Ask me for the problem and then evaluate his approach using evidence from his work.",
  },
];

export default function ZeroLaunchpad({ disabled, onExplore, onIntent, onProject }: LaunchpadProps) {
  return (
    <motion.section
      className="zero-launchpad"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28 }}
      aria-label="Zero portfolio intelligence launchpad"
    >
      <div className="zero-launchpad__status">
        <span><i /> Portfolio intelligence</span>
        <span>12 projects indexed</span>
      </div>

      <div className="zero-launchpad__graph" aria-label="Featured project map">
        <span className="zero-graph-ring zero-graph-ring--outer" aria-hidden="true" />
        <span className="zero-graph-ring zero-graph-ring--inner" aria-hidden="true" />
        <span className="zero-graph-line zero-graph-line--nw" aria-hidden="true" />
        <span className="zero-graph-line zero-graph-line--ne" aria-hidden="true" />
        <span className="zero-graph-line zero-graph-line--sw" aria-hidden="true" />
        <span className="zero-graph-line zero-graph-line--se" aria-hidden="true" />

        <motion.div
          className="zero-core"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.42 }}
        >
          <span className="zero-core__scan" aria-hidden="true" />
          <Image src="/mask-circle.png" alt="Zero" width={82} height={82} priority />
          <small>ZERO</small>
        </motion.div>

        {projects.map((project, index) => (
          <motion.button
            key={project.name}
            type="button"
            className={`zero-project-node ${project.className}`}
            onClick={() => onProject(project.name)}
            disabled={disabled}
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.08, duration: 0.24 }}
          >
            <i aria-hidden="true" />
            <span>{project.name}</span>
          </motion.button>
        ))}
      </div>

      <div className="zero-launchpad__intro">
        <span className="zero-launchpad__eyebrow">ZERO / Rahul&apos;s portfolio intelligence</span>
        <h2>I know Rahul&apos;s work.</h2>
        <p>Pick a route—or put him to the test.</p>
      </div>

      <div className="zero-route-select" aria-hidden="true">
        <span>Choose an operation</span>
        <span>04 routes available</span>
      </div>

      <div className="zero-launchpad__routes">
        {routes.map((route, index) => {
          const Icon = route.icon;
          return (
            <motion.button
              key={route.title}
              type="button"
              onClick={() => onIntent(route.prompt)}
              disabled={disabled}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52 + index * 0.07, duration: 0.24 }}
            >
              <span className="zero-route__index"><b>{route.index}</b><small>{route.signal}</small></span>
              <span className="zero-route__icon"><Icon size={15} /></span>
              <span className="zero-route__copy"><strong>{route.title}</strong><small>{route.description}</small></span>
              <span className="zero-route__action"><small>{route.action}</small><ArrowUpRight size={14} className="zero-route__arrow" /></span>
            </motion.button>
          );
        })}

        <motion.button
          type="button"
          className="zero-route--free"
          onClick={onExplore}
          disabled={disabled}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.73, duration: 0.24 }}
        >
          <span className="zero-route__index"><b>04</b><small>OPEN CHANNEL</small></span>
          <span className="zero-route__icon"><Compass size={15} /></span>
          <span className="zero-route__copy"><strong>Explore freely</strong><small>Ask anything in your own words.</small></span>
          <span className="zero-route__action"><small>Ask Zero</small><ArrowUpRight size={14} className="zero-route__arrow" /></span>
        </motion.button>
      </div>

      <div className="zero-launchpad__foot">
        <span><LockKeyhole size={10} /> Private 24-hour session</span>
        <span>System ready</span>
      </div>
    </motion.section>
  );
}
