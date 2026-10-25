#!/bin/sh
set -e

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "running prisma migrate deploy..."
  (cd /app/packages/db && ./node_modules/.bin/prisma migrate deploy)
fi

exec "$@"
