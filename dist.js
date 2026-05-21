#!/usr/bin/env bun
import read from "@3-/read";
import { join } from "node:path";
import { $, cd } from "zx";

$.verbose = true;

const root = import.meta.dirname;
cd(root);

// 1. Build
await $`NODE_ENV=production ./build.sh`;
// 2. Parse git config to get target remote URL
const config_path = join(root, ".git/config"),
  config_content = read(config_path);

const lines = config_content.split(/\r?\n/),
  remotes = {};
let current_remote = null;

for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const match = trimmed.match(/^\[remote\s+"([^"]+)"\]/);
    current_remote = match ? match[1] : null;
  } else if (current_remote) {
    const match = trimmed.match(/^url\s*=\s*(.+)$/);
    if (match) {
      (remotes[current_remote] ||= []).push(match[1].trim());
    }
  }
}

const remotes_list = Object.keys(remotes),
  findUrl = (urls) => urls.find((u) => u.includes("github.com")) || urls[0];
let target_remote = "origin",
  remote_url = "";

const arg_remote = process.argv[2];
if (arg_remote) {
  if (remotes[arg_remote]) {
    target_remote = arg_remote;
    remote_url = findUrl(remotes[target_remote]);
  } else {
    console.error("❌ Remote '" + arg_remote + "' does not exist.");
    process.exit(1);
  }
} else {
  // Auto-detect GitHub remote first
  for (const remote of remotes_list) {
    const github_url = remotes[remote].find((u) => u.includes("github.com"));
    if (github_url) {
      target_remote = remote;
      remote_url = github_url;
      break;
    }
  }
  // Fallback to origin
  if (!remote_url && remotes.origin) {
    target_remote = "origin";
    remote_url = findUrl(remotes.origin);
  }
  // Fallback to first remote
  if (!remote_url && remotes_list.length > 0) {
    target_remote = remotes_list[0];
    remote_url = findUrl(remotes[target_remote]);
  }
}

if (!remote_url) {
  console.error("❌ No git remote found.");
  process.exit(1);
}

console.log("Selected remote '" + target_remote + "': " + remote_url);

// 3. Deploy
cd(join(root, "dist"));
await $`git init`;
await $`git add -A`;
await $`git commit -m ${"deploy: " + new Date().toISOString()}`;
await $`git branch -M gh-pages`;
await $`git push -f ${remote_url} gh-pages`;
await $`rm -rf .git`;

console.log("🎉 Deployment complete!");

const clean_url = remote_url.replace(/\.git$/, ""),
  host_match = remote_url.match(/(?:git@|https?:\/\/)([^:/]+)/);

if (host_match) {
  const path_parts = clean_url.split(/[:/]/),
    repo = path_parts.pop(),
    owner = path_parts.pop(),
    host = host_match[1];
  let page_url = "";
  if (host.includes("github.com")) {
    page_url = "https://" + owner + ".github.io/" + repo + "/";
  } else if (host.includes("gitcode.com")) {
    page_url = "https://" + owner + ".gitcode.host/" + repo + "/";
  } else {
    page_url = "https://" + owner + "." + host + "/" + repo + "/";
  }
  console.log("网页地址: " + page_url);
}
