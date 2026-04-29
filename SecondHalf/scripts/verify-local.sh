#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE_BIN="${NODE_BIN:-$(command -v node || true)}"
NVM_BIN="/Users/calvinberndt/.nvm/versions/node/v22.14.0/bin"
NVM_NODE="$NVM_BIN/node"

if [ -x "$NVM_NODE" ]; then
  NODE_BIN="$NVM_NODE"
  export PATH="$NVM_BIN:$PATH"
elif [ -z "$NODE_BIN" ] && [ -x /Applications/Codex.app/Contents/Resources/node ]; then
  NODE_BIN="/Applications/Codex.app/Contents/Resources/node"
fi

if [ -z "$NODE_BIN" ]; then
  echo "node not found" >&2
  exit 127
fi

cd "$ROOT"
"$NODE_BIN" --experimental-strip-types --test tests/*.test.ts
"$NODE_BIN" node_modules/next/dist/bin/next build
mkdir -p .canvas-sync
cat > .canvas-sync/tsconfig.verify.json <<'JSON'
{
  "extends": "../tsconfig.json",
  "include": [
    "../next-env.d.ts",
    "../**/*.ts",
    "../**/*.tsx",
    "../.next/types/**/*.ts"
  ],
  "exclude": [
    "../node_modules"
  ]
}
JSON
"$NODE_BIN" node_modules/typescript/bin/tsc --project .canvas-sync/tsconfig.verify.json --noEmit
