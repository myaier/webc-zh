#!/usr/bin/env bash
set -ex
exec bun x stylus-supremacy format -p supremacy.yml -r "$@"
