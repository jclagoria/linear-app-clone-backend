-- Migration V3: Create organization_members table

CREATE TABLE organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role varchar(50) NOT NULL DEFAULT 'member',
  created_at timestamp NOT NULL DEFAULT NOW(),
  deleted_at timestamp
);

-- Create indexes
CREATE INDEX idx_org_members_organization_id ON organization_members(organization_id);
CREATE INDEX idx_org_members_user_id ON organization_members(user_id);
CREATE INDEX idx_org_members_deleted_at ON organization_members(deleted_at);

-- Add foreign key constraints
ALTER TABLE organization_members ADD CONSTRAINT fk_org_members_organization 
  FOREIGN KEY (organization_id) REFERENCES organizations(id);
ALTER TABLE organization_members ADD CONSTRAINT fk_org_members_user 
  FOREIGN KEY (user_id) REFERENCES users(id);
