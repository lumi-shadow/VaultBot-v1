"use client";

import Link from "next/link";
import { Activity, Github } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Navigation() {
  return (
    <div className="flex justify-center pt-6">
      <nav className="mx-6 rounded-full border border-border bg-panel px-6 py-3 shadow-sm">
        <div className="flex items-center justify-between gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-ink" strokeWidth={2} />
            <h1 className="text-sm font-medium">
              VaultBot
            </h1>
          </Link>
          <div className="hidden items-center gap-6 text-sm text-muted md:flex">
            <Link href="/" className="transition-colors hover:text-ink">
              Home
            </Link>
            <Link href="/dashboard" className="transition-colors hover:text-ink">
              Dashboard
            </Link>
            <Link href="/docs" className="transition-colors hover:text-ink">
              Docs
            </Link>
            <Link href="/waitlist" className="transition-colors hover:text-ink">
              Waitlist
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="https://github.com/lumi-shadow/binius-gpu"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-canvas transition-opacity hover:opacity-90"
            >
              <Github className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}
