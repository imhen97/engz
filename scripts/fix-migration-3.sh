#!/bin/bash
# Script to fix failed migration 3_add_current_routine_id
# This script marks the failed migration as resolved

echo "Attempting to resolve failed migration 3_add_current_routine_id..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL environment variable is not set"
  exit 1
fi

# Use psql to mark the migration as rolled back
psql "$DATABASE_URL" <<EOF
-- Mark the failed migration as rolled back
UPDATE "_prisma_migrations" 
SET rolled_back_at = NOW(),
    finished_at = NOW(),
    applied_steps_count = 0,
    logs = 'Migration rolled back: Routine table does not exist. Column currentRoutineId added separately.'
WHERE migration_name = '3_add_current_routine_id' 
AND finished_at IS NULL;

SELECT 'Migration 3 marked as rolled back' as status;
EOF

if [ $? -eq 0 ]; then
  echo "✅ Successfully resolved failed migration"
else
  echo "❌ Failed to resolve migration. Please run the SQL manually in your database console."
  exit 1
fi

