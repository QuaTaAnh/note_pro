-- Remove permission_type column
ALTER TABLE access_requests DROP COLUMN IF EXISTS permission_type; 