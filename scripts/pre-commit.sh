#!/bin/sh
echo "Running TypeScript check..."
cd frontend && pnpm typecheck
if [ $? -ne 0 ]; then
  echo "TypeScript check failed!"
  exit 1
fi

echo "Running ESLint..."
cd frontend && pnpm lint
if [ $? -ne 0 ]; then
  echo "ESLint check failed!"
  exit 1
fi

echo "All checks passed!"
exit 0