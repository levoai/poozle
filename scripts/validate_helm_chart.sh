#!/usr/bin/env bash

set -e

echo "Validating helm chart"
helm lint --strict ./helm/ || exit 1
helm template ./helm/ || exit 1
