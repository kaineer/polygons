#!/bin/bash

NODE_VERSION=${1:-12}
DIR=polygon-${NODE_VERSION}

mkdir $DIR
cd $DIR

fnm use $NODE_VERSION

rm -rf package.json
rm -rf node_modules
npm init -y

npm i -DE png-img
npm i -DE sharp
if [[ "$NODE_VERSION" == "12" ]]; then
  npm i -DE puppeteer@8
else
  npm i -DE puppeteer
fi

cat package.json | jq .devDependencies

cd ..
