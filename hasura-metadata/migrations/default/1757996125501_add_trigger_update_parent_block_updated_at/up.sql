-- Create function to update parent block's updated_at when sub block is modified
CREATE OR REPLACE FUNCTION update_parent_block_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  -- If this block has a page_id (meaning it's a sub block), update the parent page's updated_at
  IF NEW.page_id IS NOT NULL THEN
    UPDATE blocks 
    SET updated_at = NOW() 
    WHERE id = NEW.page_id;
  END IF;
  
  -- If this block has a parent_id (meaning it's a child block), update the parent block's updated_at
  IF NEW.parent_id IS NOT NULL THEN
    UPDATE blocks 
    SET updated_at = NOW() 
    WHERE id = NEW.parent_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT operations
CREATE TRIGGER trigger_update_parent_block_on_insert
  AFTER INSERT ON blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_parent_block_updated_at();

-- Create trigger for UPDATE operations
CREATE TRIGGER trigger_update_parent_block_on_update
  AFTER UPDATE ON blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_parent_block_updated_at();
