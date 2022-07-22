#!/bin/sh

if [ "$NODE_ENV" = "dev" ]; then
    npm install --from-lock-file
    npm run dev
else
    npm start
fi
 