-- Add access_id column to commands table
ALTER TABLE commands ADD COLUMN IF NOT EXISTS access_id TEXT;

-- Create index for faster lookup
CREATE INDEX IF NOT EXISTS idx_commands_access_id ON commands(access_id);

-- Add access_id to mcp_configs table (already exists but ensure it's there)
-- This stores which access_id belongs to which user

-- Update existing commands to have access_id (one-time migration)
UPDATE commands 
SET access_id = '9dddfe970174516512ff372c368909b6fe4faa793154a163476bd0ee97fce136'
WHERE user_id = 'tuya_ai' AND access_id IS NULL;

-- Now commands need both user_id AND access_id
-- Commands table structure:
-- - command_id: unique command ID
-- - user_id: the actual user who owns this command (from Google login)
-- - access_id: the Tuya Access ID that sent this command
-- - command: the actual command text
-- - status: pending/processing/completed
