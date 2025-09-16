-- Drop triggers
DROP TRIGGER IF EXISTS trigger_update_parent_block_on_update ON blocks;
DROP TRIGGER IF EXISTS trigger_update_parent_block_on_insert ON blocks;

-- Drop function
DROP FUNCTION IF EXISTS update_parent_block_updated_at();
