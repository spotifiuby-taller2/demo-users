#!/bin/bash

echo "api_key: $DD_API_KEY" > /etc/datadog-agent/datadog.yaml

datadog-agent run >/dev/null &
/opt/datadog-agent/embedded/bin/trace-agent --config=/etc/datadog-agent/datadog.yaml >/dev/null &
/opt/datadog-agent/embedded/bin/process-agent --config=/etc/datadog-agent/datadog.yaml >/dev/null &
