#!/bin/sh -x

ROOT=`pwd`

git stash

git pull origin master

git stash pop

YARN=0
YARN_INSTALL=0
while [ "$#" -gt "0" ]
do
    key="$1"
    case $key in
        -y|--yarn)
        YARN=1
        shift
        ;;
        -i|--install)
        YARN=1
        YARN_INSTALL=1
        shift
        ;;
        --default)
        YARN=0
        shift
        ;;
        *)
        shift
        ;;
    esac
done

# Client side code update
if [ "$YARN" -eq "1" ]
then
    cd "$ROOT/client"
    # Client side dependencies install
    if [ "$YARN_INSTALL" -eq 1 ]
    then
        yarn install
    fi
    yarn build
fi

# Restart nginx
# sudo service nginx restart
