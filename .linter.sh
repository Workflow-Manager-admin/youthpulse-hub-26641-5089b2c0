#!/bin/bash
cd /home/kavia/workspace/code-generation/youthpulse-hub-26641-5089b2c0/youthpulse_hub
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

