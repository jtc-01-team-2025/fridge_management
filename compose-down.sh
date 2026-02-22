#!/usr/bin/env bash

set -euo pipefail

echo "=== Stop all running containers ==="
podman stop -a

echo "=== Remove all containers ==="
podman rm -a

echo "=== Done ==="