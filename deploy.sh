#!/usr/bin/env bash
cd ..

aws s3 cp concierge.croccante.webApp/ s3://concierge-croccante-webapp --recursive --exclude "backend-lambda/*" --exclude ".idea/*" --exclude ".git/*" --exclude ".DS_Store"