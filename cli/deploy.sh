#!/bin/sh


# https://console.scaleway.com
# @51.15.127.9 -- https://SOFORT.jetzt
# docker login rg.fr-par.scw.cloud/sofort -u nologin -p $SCW_SECRET_TOKEN

# config
serverPath="/home/ubuntu/SOFORT.jetzt"
rsyncDest="root@ssh.SEPA.digital:$serverPath"

echo ""
echo " 🆕 init env  ✱ ✱ ✱  ✔️"
echo ""

rm -rf ./dist && mkdir -p ./dist
cp -r ./{DDoS,HackTheCrisis,investieren,spenden,pay,sofort.pay.js} ./dist

# pip3 freeze > requirements.freezed.txt
pip3 install -r ./requirements.freezed.txt


echo ""
echo ""
echo " 🤖 deploy SOFORT.jetzt @ SEPA.digital ..."
echo ""


echo ""
echo " 🚢 build docker container ..."
echo ""

docker build -t sofort/jetzt:latest .
docker tag sofort/jetzt:latest rg.fr-par.scw.cloud/sofort/jetzt:latest
docker push rg.fr-par.scw.cloud/sofort/jetzt:latest

rsync -a --progress ./dist $rsyncDest/public
rsync -a --progress ./deploy/nginx.conf $rsyncDest
rsync -a --progress ./docker-compose.yml $rsyncDest
rsync -a --progress ./dist/* root@ssh.SEPA.digital:/home/ubuntu/public/SEPA.digital/ #tmp

ssh root@ssh.SEPA.digital "cd $serverPath && docker login && docker pull rg.fr-par.scw.cloud/sofort/jetzt:latest && docker-compose down && docker-compose up -d"


echo ""
echo " 👀 docker status @ server ..."
echo ""

ssh root@ssh.SEPA.digital 'docker ps'

echo ""
echo " 🛫 "
sleep 1
echo "   🛫 "
sleep 1
echo "     🛫 "
sleep 1
echo "         🛫 "
sleep 2
echo "                  🛫 "
sleep 2
echo "                            🛫 "
sleep 4
echo ""
echo "   🛬 "
echo ""

ssh root@ssh.SEPA.digital 'docker ps'

echo ""
echo " ✅ "
echo ""