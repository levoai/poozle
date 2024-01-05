#!/usr/bin/env bash
#
# This script expects helm v3 to be installed and GOOGLE_APPLICATION_CREDENTIALS
# to be set in the environment.
#
# Usage:
#  build_and_push_helm_chart_to_gcs.sh <helm directory> <chart version> <helm gcs repo>
#

HELM_DIR=$1
CHART_VERSION=$2
HELM_GCS_REPOSITORY=$3

helm lint --strict "$HELM_DIR"
helm template "$HELM_DIR"
CHART_NAME=$(awk '/^name:/ {print $2}' "$HELM_DIR"/Chart.yaml)
echo CHART_VERSION="$CHART_VERSION"
echo CHART_NAME="$CHART_NAME"
echo GOOGLE_APPLICATION_CREDENTIALS="$GOOGLE_APPLICATION_CREDENTIALS"

# Update the version in helm chart since the upgrade uses Docker image version from the chart.
# sed command options are different across Mac and GNU and using "-i -e" will make it work on both Mac and GNU Linux.
sed -i -e "s/^version:.*$/version: ${CHART_VERSION}/" "$HELM_DIR"/Chart.yaml
helm package --version "${CHART_VERSION}" --app-version "${CHART_VERSION}" "$HELM_DIR"

helm plugin install https://github.com/hayorov/helm-gcs.git --version 0.4.1
helm repo add helm-gcs "${HELM_GCS_REPOSITORY}"
helm gcs push "${CHART_NAME}"-"${CHART_VERSION}".tgz helm-gcs --retry --force
