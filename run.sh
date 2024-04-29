#!/bin/bash

CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
DARKGREY='\033[1;30m'
DEF='\033[0;39m'
BOLD='\033[1m'
INVERSE='\033[7m'
NORMAL='\033[0m'
WHITE_BACKGROUND='\033[47m'
RED_BRIGHT='\033[0;91m'
RED_BACKGROUND='\033[41m'
RED_BACKGROUND_BRIGHT='\033[0;101m'

function app_run() {
  echo -e "\n${YELLOW}Stopping app containier ...${NORMAL}\n"
  docker-compose -f docker/docker-compose.yml down
  echo -e "\n${YELLOW}Clearing volumes ...${NORMAL}\n"
  docker system prune -a --volumes -f
  echo -e "\n${YELLOW}Starting app containier ...${NORMAL}\n"
  docker-compose -f docker/docker-compose.yml up -d --build
}

function app_restart() {
  echo -e "\n\n${YELLOW}Restarting app ...${NORMAL}\n"
  docker restart app
}

function app_logs() {
  echo -e "\n\n${YELLOW}Loading app log panel ...${NORMAL}\n"
  docker logs --tail 1000 -f app
}

while getopts c:t: flag
do
  case "${flag}" in
    c) choice=${OPTARG};;
    t) test=${OPTARG};;
  esac
done

#or take first argument
if [ ! $choice ]  && [ $1 ]
then
  echo ">>>>$1"
  choice=$1
fi


if [ -z $choice ]
then
  echo -e "${YELLOW}${BOLD}${INVERSE}"
  echo -e "  ----------------------------------------------------------------------  "
  echo -e "  -                        Deployment Menu                             -  "
  echo -e "  ----------------------------------------------------------------------  "
  echo -e "${GREEN}"
  echo -e "    ------ App -------------------------------------------------------"
  echo -e "${DEF}"
  echo -e "         1 - Run"
  echo -e "         2 - Restart"
  echo -e "         3 - Logs"
  echo -e "${YELLOW}${BOLD}${INVERSE}"
  echo -e "  ----------------------------------------------------------------------  "
  # echo -e "\n${RED_BACKGROUND_BRIGHT}  Don't forget to login in specific docker account(look at project docs)  ${NORMAL}"
  echo -e "${NORMAL}"
  echo -en "${CYAN}Input action number > ${NORMAL} "

  read -p "" choice
  case "$choice" in
    1 ) app_run;app_logs;;
    2 ) app_restart;app_logs;;
    3 ) app_logs;;
    * ) echo -e "\n${RED}Invalid action number${NORMAL}\n";;
  esac
else
  echo -e "${CYAN}Action:${GREEN} $choice${NORMAL}"
  $choice
fi
