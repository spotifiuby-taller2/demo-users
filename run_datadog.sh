#!/bin/bash

echo "api_key: $DD_API_KEY" > /etc/datadog-agent/datadog.yaml

datadog-agent run &
/opt/datadog-agent/embedded/bin/trace-agent --config=/etc/datadog-agent/datadog.yaml &
/opt/datadog-agent/embedded/bin/process-agent --config=/etc/datadog-agent/datadog.yaml &
