#!/usr/bin/env bash

set -euo pipefail

COMPOSE_FILE="docker-compose.yml"
PROJECT_NAME="fridge_management"

echo "=== Podman Compose Build ==="
podman-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" build

echo "=== Podman Compose Up ==="
podman-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" up -d

echo "=== Status ==="
podman-compose -p "$PROJECT_NAME" ps