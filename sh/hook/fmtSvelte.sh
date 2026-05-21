#!/usr/bin/env bash
set -ex
exec bun x fmt_svelte -w "$@"
