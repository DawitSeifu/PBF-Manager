#!/usr/bin/env bash
gnome-terminal --tab --title "blsq-report-components" -- bash -c "cd ../blsq-report-components && yarn start"
code .
code ../blsq-report-components
BROWSER=chromium yarn start