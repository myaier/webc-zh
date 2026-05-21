#!/usr/bin/env bash

if [ ! -d "conf" ]; then
  ln -s sh/example/conf .
fi

if [ ! -d "node_modules" ]; then
  bun i
fi
