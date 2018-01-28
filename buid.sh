#!/bin/bash
cd ui
npm run build
cd ..
rm -rf dist
mkdir dist
cp -r ui/dist dist/static

cp wallappy-api -r dist
cp run-wallappy.sh dist
cp config -r dist

cd dist
find . -name *.pyc -exec rm {} \;

virtualenv venv  
pip install flask
    


