-- Updated schema with Google OAuth support

-- Users table (simplified with Google auth)
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  google_id TEXT UNIQUE,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commands table (unchanged)
CREATE TABLE commands (
  id BIGSERIAL PRIMARY KEY,
  command_id TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  command TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Results table (unchanged)
CREATE TABLE results (
  id BIGSERIAL PRIMARY KEY,
  command_id TEXT UNIQUE NOT NULL REFERENCES commands(command_id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  result TEXT,
  success BOOLEAN DEFAULT TRUE,
  execution_time INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- NEW: MCP Configurations table
CREATE TABLE mcp_configs (
  id BIGSERIAL PRIMARY KEY,
  config_id TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'browser' or 'device'
  endpoint TEXT,
  access_id TEXT,
  access_secret TEXT,
  extra_config JSONB, -- Additional config as JSON
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_commands_user_status ON commands(user_id, status, created_at);
CREATE INDEX idx_commands_command_id ON commands(command_id);
CREATE INDEX idx_results_command_id ON results(command_id);
CREATE INDEX idx_mcp_configs_user ON mcp_configs(user_id, enabled);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcp_configs ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access users" ON users FOR ALL USING (true);
CREATE POLICY "Service role full access commands" ON commands FOR ALL USING (true);
CREATE POLICY "Service role full access results" ON results FOR ALL USING (true);
CREATE POLICY "Service role full access mcp_configs" ON mcp_configs FOR ALL USING (true);

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commands_updated_at BEFORE UPDATE ON commands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mcp_configs_updated_at BEFORE UPDATE ON mcp_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- NEW: Request logs table (store ALL requests/responses)
CREATE TABLE request_logs (
  id BIGSERIAL PRIMARY KEY,
  request_id TEXT UNIQUE NOT NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  user_id TEXT,
  request_body JSONB,
  response_body JSONB,
  status_code INTEGER,
  ip_address TEXT,
  user_agent TEXT,
  duration_ms INTEGER,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for request logs
CREATE INDEX idx_request_logs_endpoint ON request_logs(endpoint, created_at DESC);
CREATE INDEX idx_request_logs_user ON request_logs(user_id, created_at DESC);
CREATE INDEX idx_request_logs_status ON request_logs(status_code, created_at DESC);
CREATE INDEX idx_request_logs_created ON request_logs(created_at DESC);

-- RLS for request_logs
ALTER TABLE request_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access request_logs" ON request_logs FOR ALL USING (true);

-- Cleanup function
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
  DELETE FROM commands WHERE created_at < NOW() - INTERVAL '7 days';
  DELETE FROM results WHERE completed_at < NOW() - INTERVAL '7 days';
  DELETE FROM request_logs WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;
