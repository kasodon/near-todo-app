#!/bin/sh

echo ">> Building contract"

near-sdk-js build src/index.js build/contract.wasm