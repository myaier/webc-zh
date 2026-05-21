#!/usr/bin/env bash

set -e
DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR/../com
set -x

if [ -z "$1" ]; then
  echo "$0 <PROJECT>"
  exit 1
fi

PROJECT=$1

if [ ! -d "$PROJECT" ]; then
  rsync -av $DIR/example/com/ $PROJECT
  cd $PROJECT
  cp Demo.svelte $PROJECT.svelte
fi
