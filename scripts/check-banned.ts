#!/usr/bin/env tsx
/**
 * Fails the build if banned patterns appear in tracked text files.
 * Patterns: TODO, FIXME, lorem ipsum, em dash, dummy keys, coming soon, stub markers.
 */

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const BANNED: Array<{ name: string; pattern: RegExp }> = [
  { name: "TODO", pattern: /\bTODO\b/ },
  { name: "FIXME", pattern: /\bFIXME\b/ },
  { name: "lorem ipsum", pattern: /lorem\s+ipsum/i },
  { name: "em dash", pattern: /\u2014/ },
  { name: "coming soon", pattern: /coming\s+soon/i },
  { name: "dummy api key", pattern: /dummy[_\s-]?api[_\s-]?key/i },
  { name: "sk_test placeholder", pattern: /sk_test_[a-zA-Z0-9]{10,}/ },
];

const EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".yml",
  ".yaml",
  ".css",
  ".html",
]);

function listTrackedFiles(): string[] {
  const out = execSync("git ls-files", { encoding: "utf8" });
  return out
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((p) => {
      const lower = p.toLowerCase();
      if (lower.includes("node_modules") || lower.includes("dist/")) return false;
      const ext = p.includes(".") ? p.slice(p.lastIndexOf(".")) : "";
      return EXTENSIONS.has(ext);
    });
}

function main(): void {
  const files = listTrackedFiles();
  const violations: Array<{ file: string; name: string; line: number; text: string }> = [];

  for (const file of files) {
    let content: string;
    try {
      content = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] ?? "";
      for (const ban of BANNED) {
        if (ban.pattern.test(line)) {
          violations.push({
            file,
            name: ban.name,
            line: i + 1,
            text: line.trim().slice(0, 120),
          });
        }
      }
    }
  }

  if (violations.length > 0) {
    console.error("Banned pattern check failed:\n");
    for (const v of violations) {
      console.error(`  [${v.name}] ${v.file}:${v.line}  ${v.text}`);
    }
    console.error(`\n${violations.length} violation(s). Remove them before committing.`);
    process.exit(1);
  }

  console.log(`check-banned: ok (${files.length} files scanned)`);
}

main();
