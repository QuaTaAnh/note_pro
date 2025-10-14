-- Drop indexes
DROP INDEX IF EXISTS idx_blocks_type_workspace_search;
DROP INDEX IF EXISTS idx_blocks_search_text_trgm;
DROP INDEX IF EXISTS idx_tasks_workspace;
DROP INDEX IF EXISTS idx_blocks_workspace_type;
DROP INDEX IF EXISTS idx_folders_workspace_name;
DROP INDEX IF EXISTS idx_folders_description_trgm;
DROP INDEX IF EXISTS idx_folders_name_trgm;
DROP INDEX IF EXISTS idx_blocks_content_gin;

-- Drop the search_text column
ALTER TABLE blocks DROP COLUMN IF EXISTS search_text;

-- Drop the function
DROP FUNCTION IF EXISTS extract_text_from_content(JSONB);

-- Note: We don't drop the pg_trgm extension as it might be used elsewhere

