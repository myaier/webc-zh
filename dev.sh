#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -ex

. ./sh/pid.sh

PORT=5180

NODE_ENV=dev bun x vite &
PID=$!

while ! nc -z localhost $PORT; do
  sleep 1
done
open http://localhost:$PORT

wait $PID
