-- Migration V2: Create organizations table

CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL UNIQUE,
  owner_id uuid NOT NULL,
  created_at timestamp NOT NULL DEFAULT NOW(),
  updated_at timestamp NOT NULL DEFAULT NOW(),
  deleted_at timestamp
);

-- Create indexes
CREATE INDEX idx_organizations_owner_id ON organizations(owner_id);
CREATE INDEX idx_organizations_deleted_at ON organizations(deleted_at);

-- Add foreign key constraint
ALTER TABLE organizations ADD CONSTRAINT fk_organizations_owner 
  FOREIGN KEY (owner_id) REFERENCES users(id);
