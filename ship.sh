#!/usr/bin/env bash
set -e
set -o pipefail
if [[ $# -eq 0 ]] ; then
    echo 'password required'
    exit 0
fi
export DHIS2HOST=https://dhis-pbf.moh.gov.et
export DHIS2PASSWORD=$1
export DHIS2USER=hesabu_pbf
export APP=report-pbf-ethiopia-fmoh

yarn build --production
rm -f $APP.zip || true
cd ./build && rm ./static/js/*.js.map && zip -r ../$APP.zip . && cd ..
echo "${DHIS2USER}" $DHIS2HOST/api/apps

curl --fail -H "Accept: application/json" -X POST -u  "${DHIS2USER}":"${DHIS2PASSWORD}"  --compressed -F file=@$APP.zip "${DHIS2HOST}"/api/apps
echo deployed zip
curl -X GET -u  "${DHIS2USER}":"${DHIS2PASSWORD}" -H "Accept: application/json" "${DHIS2HOST}"/api/apps | jq .
echo trigger refresh of apps
curl -X PUT -u  "${DHIS2USER}":"${DHIS2PASSWORD}" -H "Accept: application/json" "${DHIS2HOST}"/api/apps | jq .
curl -X GET -u  "${DHIS2USER}":"${DHIS2PASSWORD}" -H "Accept: application/json" "${DHIS2HOST}"/api/apps | jq .
