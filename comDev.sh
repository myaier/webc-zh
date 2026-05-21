#!/usr/bin/env bash

set -e
DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
. sh/pid.sh
PORT=5182
(
  for i in {1..30}; do
    if nc -z 127.0.0.1 $PORT; then
      open "http://127.0.0.1:$PORT/"
      break
    fi
    sleep 0.1
  done
) &

set -x
exec ./vite/com/dev.js $@ --port $PORT
