#!/bin/bash
# ==============================================================================
# DUKAAN Automated Database Backup Script
# Performs compressed PostgreSQL dumps with timestamping and 14-day retention.
# ==============================================================================

set -e

BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/dukaan_backup_${TIMESTAMP}.sql.gz"

DB_HOST=${DB_HOST:-"postgres"}
DB_PORT=${DB_PORT:-"5432"}
DB_USER=${DB_USER:-"postgres"}
DB_NAME=${DB_NAME:-"dukaan_db"}

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting automated database backup for: ${DB_NAME} on ${DB_HOST}:${DB_PORT}..."

# Execute pg_dump directly piping to gzip
PGPASSWORD="${DB_PASSWORD}" pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" --clean --if-exists | gzip > "$BACKUP_FILE"

echo "[$(date)] Backup complete successfully: ${BACKUP_FILE}"
echo "[$(date)] Backup size: $(du -h "${BACKUP_FILE}" | cut -f1)"

# Retain backups for 14 days, delete older archives
echo "[$(date)] Cleaning up archives older than 14 days..."
find "$BACKUP_DIR" -type f -name "dukaan_backup_*.sql.gz" -mtime +14 -delete

echo "[$(date)] Database backup routine finalized."
