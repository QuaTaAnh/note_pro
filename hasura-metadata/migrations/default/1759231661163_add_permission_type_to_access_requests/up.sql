-- Add permission_type column to access_requests
ALTER TABLE access_requests 
ADD COLUMN permission_type TEXT DEFAULT 'read';

-- Add check constraint
ALTER TABLE access_requests
ADD CONSTRAINT permission_type_check CHECK (permission_type IN ('read', 'write'));

-- Update existing records to 'read'
UPDATE access_requests SET permission_type = 'read' WHERE permission_type IS NULL; 