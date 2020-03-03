#!/usr/bin/env bash

read -p "Deploying the backend? Y/N" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]];
then
    if [ -f "bot_conciergeCroccante.zip" ]
    then
        rm -r backendWebApp_conciergeCroccante.zip
    fi
    zip -r backendWebApp_conciergeCroccante.zip . -x ".idea"
    # Per eliminare l'oggetto dal bucket
    # aws s3api delete-object --bucket amazon-s3-pellanda --key <name>.zip

    # Per caricare l'oggetto nel bucket
    aws s3api put-object --bucket amazon-s3-pellanda --key backendWebApp_conciergeCroccante.zip --body backendWebApp_conciergeCroccante.zip
    # Per linkare l'oggetto deploy alla lambda
    aws lambda update-function-code --function-name ConciergeCroccanteWebApp --s3-bucket amazon-s3-pellanda --s3-key backendWebApp_conciergeCroccante.zip
    rm -r backendWebApp_conciergeCroccante.zip
else
    echo "Project not deploy."
fi