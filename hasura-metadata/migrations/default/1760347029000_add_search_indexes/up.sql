-- Enable pg_trgm extension for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add GIN indexes for faster JSONB content search in blocks
CREATE INDEX IF NOT EXISTS idx_blocks_content_gin ON blocks USING GIN (content);

-- Add indexes for folder search
CREATE INDEX IF NOT EXISTS idx_folders_name_trgm ON folders USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_folders_description_trgm ON folders USING GIN (description gin_trgm_ops);

-- Add composite index for workspace filtering
CREATE INDEX IF NOT EXISTS idx_folders_workspace_name ON folders(workspace_id, name);
CREATE INDEX IF NOT EXISTS idx_blocks_workspace_type ON blocks(workspace_id, type) WHERE deleted_at IS NULL;

-- Add index for task search via block content
CREATE INDEX IF NOT EXISTS idx_tasks_workspace ON tasks(block_id);

-- Create a function to extract text from JSONB content for full-text search
CREATE OR REPLACE FUNCTION extract_text_from_content(content JSONB)
RETURNS TEXT AS $$
BEGIN
  -- Extract 'text' field from content if it exists
  -- Content structure is typically: {"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "..."}]}]}
  RETURN COALESCE(
    (SELECT string_agg(item->>'text', ' ')
     FROM jsonb_array_elements(
       CASE 
         WHEN jsonb_typeof(content->'content') = 'array' 
         THEN content->'content'
         ELSE '[]'::jsonb
       END
     ) AS top_level,
     jsonb_array_elements(
       CASE 
         WHEN jsonb_typeof(top_level->'content') = 'array'
         THEN top_level->'content'
         ELSE '[]'::jsonb
       END
     ) AS item
     WHERE item->>'text' IS NOT NULL
    ), 
    ''
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add a generated column for searchable text (optional, for better performance)
-- This will store extracted text from content JSONB
ALTER TABLE blocks ADD COLUMN IF NOT EXISTS search_text TEXT GENERATED ALWAYS AS (
  CASE 
    WHEN content IS NOT NULL THEN extract_text_from_content(content)
    ELSE ''
  END
) STORED;

-- Create GIN index on the search_text column for full-text search
CREATE INDEX IF NOT EXISTS idx_blocks_search_text_trgm ON blocks USING GIN (search_text gin_trgm_ops);

-- Create index for faster filtering by type and workspace
CREATE INDEX IF NOT EXISTS idx_blocks_type_workspace_search ON blocks(type, workspace_id, deleted_at) 
WHERE deleted_at IS NULL;

