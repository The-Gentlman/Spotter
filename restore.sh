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


# trap 'error_handler' ERR
echo -e "${BLUE}${BOLD}[INFO]${RESET} Starting database restore process..."

# error_handler() {  
#     echo -e "${RED}${BOLD}[ERROR]${RESET} An error occurred. Cleaning up temporary files..."  
#     rm -rf "$EXTRACTED_BACKUP_DIR"
#     rm -f "$ZIP_FILE"
#     echo -e "${GREEN}${BOLD}[SUCCESS]${RESET} Cleanup completed!"
#     exit 1
# }  


# 4. Terminate active DB connections
echo -e "${BLUE}${BOLD}[INFO]${RESET} Terminating active database connections..."
docker exec -u postgres "$DB_CONTAINER" psql -c "
    SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.datname = '$DB_NAME' AND pid <> pg_backend_pid();
" > /dev/null 2>&1

# 5. Drop and recreate database
echo -e "${BLUE}${BOLD}[INFO]${RESET} Dropping existing database..."
docker exec "$DB_CONTAINER" dropdb -U "$DB_USER" "$DB_NAME"

echo -e "${GREEN}${BOLD}[SUCCESS]${RESET} Database dropped successfully!"

echo -e "${BLUE}${BOLD}[INFO]${RESET} Creating new database..."
docker exec "$DB_CONTAINER" createdb -U "$DB_USER" "$DB_NAME"

echo -e "${GREEN}${BOLD}[SUCCESS]${RESET} Database created successfully!"

# 6. Restore database
echo -e "${BLUE}${BOLD}[INFO]${RESET} Restoring test database from backup..."
docker exec -i "$DB_CONTAINER" pg_restore -U "$DB_USER" -d "$DB_NAME" --clean --if-exists < "$BACKUP_FILE"

echo -e "${GREEN}${BOLD}[SUCCESS]${RESET} Database restored successfully!"


echo -e "${GREEN}${BOLD}[SUCCESS]${RESET} Backup restore process completed!"