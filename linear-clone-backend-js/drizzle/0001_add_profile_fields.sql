-- Migration V1: Add profile fields to users table
-- Add name, avatar_url, updated_at, deleted_at columns

ALTER TABLE users ADD COLUMN name varchar(255) NOT NULL DEFAULT 'User';
ALTER TABLE users ADD COLUMN avatar_url varchar(2048);
ALTER TABLE users ADD COLUMN updated_at timestamp NOT NULL DEFAULT NOW();
ALTER TABLE users ADD COLUMN deleted_at timestamp;

-- Create index for soft delete filtering
CREATE INDEX idx_users_deleted_at ON users(deleted_at);
