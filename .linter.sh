#!/bin/bash
cd /home/kavia/workspace/code-generation/cinestream-16392-d475c539/cine_stream
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

