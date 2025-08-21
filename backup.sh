#!/bin/bash

DB_USER="psql"
DB_NAME="psql"
DB_CONTAINER="database"
BACKUP_FILE="./database.sql"

BLUE="\033[34m"
GREEN="\033[32m"
RED="\033[31m"
BOLD="\033[1m"
RESET="\033[0m"

error_handler() {
    echo -e "${RED}${BOLD}[ERROR]${RESET} Backup process failed!"
    exit 1
}

trap 'error_handler' ERR
echo -e "${BLUE}${BOLD}[INFO]${RESET} Start backup process..."

echo -e "${BLUE}${BOLD}[INFO]${RESET} Database dump started..."
docker exec "$DB_CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" -Fc > "$BACKUP_FILE"

echo -e "${GREEN}${BOLD}[SUCCESS]${RESET} Database dumped successfully to $BACKUP_FILE"
