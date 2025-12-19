/**
 * Tuya Bridge Settings Component
 * 
 * Displays Tuya AI bridge server connection status and controls
 */

import { useState, useEffect } from 'react';

export default function TuyaBridgeSettings() {
  const [status, setStatus] = useState({
    connected: false,
    message: 'Testing connection...',
    isPolling: false,
    isPaused: false,
    bridgeUrl: 'http://localhost:3000',
    pollInterval: 2000,
  });

  const [testing, setTesting] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // Check connection on mount
  useEffect(() => {
    checkConnection();

    // Auto-refresh status every 5 seconds
    const interval = setInterval(refreshStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    setTesting(true);
    try {
      // Ask background script to test connection
      const result = await chrome.runtime.sendMessage({ type: 'bridge_test_connection' });
      const statusResult = await chrome.runtime.sendMessage({ type: 'bridge_get_status' });

      setStatus({
        ...statusResult,
        connected: result.connected,
        message: result.message,
      });

      setLastChecked(new Date());
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        connected: false,
        message: `Error: ${(error as Error).message}`,
      }));
    } finally {
      setTesting(false);
    }
  };

  const refreshStatus = async () => {
    try {
      const bridgeStatus = await chrome.runtime.sendMessage({ type: 'bridge_get_status' });
      setStatus(prev => ({
        ...prev,
        ...bridgeStatus,
      }));
    } catch (error) {
      console.error('Failed to refresh status:', error);
    }
  };

  const handleStartPolling = async () => {
    await chrome.runtime.sendMessage({ type: 'bridge_start_polling' });
    setTimeout(refreshStatus, 100);
  };

  const handleStopPolling = async () => {
    await chrome.runtime.sendMessage({ type: 'bridge_stop_polling' });
    setTimeout(refreshStatus, 100);
  };

  const handlePausePolling = async () => {
    await chrome.runtime.sendMessage({ type: 'bridge_pause_polling' });
    setTimeout(refreshStatus, 100);
  };

  const handleResumePolling = async () => {
    await chrome.runtime.sendMessage({ type: 'bridge_resume_polling' });
    setTimeout(refreshStatus, 100);
  };

  return (
    <div className="tuya-bridge-settings">
      <h2>🌉 Tuya AI Bridge Connection</h2>

      <div className="bridge-info">
        <p>
          The Tuya AI Bridge connects this extension to your Tuya AI Workflow,
          enabling voice-controlled browser automation via the SmartLife app.
        </p>
      </div>

      {/* Connection Status */}
      <div className={`status-card ${status.connected ? 'connected' : 'disconnected'}`}>
        <div className="status-header">
          <span className={`status-indicator ${status.connected ? 'green' : 'red'}`}>
            {status.connected ? '✓' : '✗'}
          </span>
          <h3>{status.connected ? 'Connected' : 'Disconnected'}</h3>
        </div>

        <div className="status-details">
          <div className="status-row">
            <strong>Status:</strong>
            <span>{status.message}</span>
          </div>

          <div className="status-row">
            <strong>Bridge URL:</strong>
            <input
              type="url"
              className="bridge-url-input"
              value={status.bridgeUrl}
              onChange={(e) => {
                setStatus(prev => ({ ...prev, bridgeUrl: e.target.value }));
              }}
              onBlur={async () => {
                // Save to storage when user finishes editing
                await chrome.storage.local.set({ cloudBridgeUrl: status.bridgeUrl });
                // Update in background service
                chrome.runtime.sendMessage({
                  type: 'update_bridge_url',
                  url: status.bridgeUrl
                });
              }}
              placeholder="https://your-project.vercel.app"
            />
          </div>

          <div className="status-row">
            <strong>Polling:</strong>
            <span className={status.isPolling ? 'text-success' : 'text-muted'}>
              {status.isPolling ? (status.isPaused ? '⏸ Paused' : '▶ Active') : '⏹ Stopped'}
            </span>
          </div>

          <div className="status-row">
            <strong>Poll Interval:</strong>
            <span>{status.pollInterval}ms</span>
          </div>

          {lastChecked && (
            <div className="status-row">
              <strong>Last Checked:</strong>
              <span>{lastChecked.toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="bridge-controls">
        <button
          onClick={checkConnection}
          disabled={testing}
          className="btn btn-primary"
        >
          {testing ? 'Testing...' : '🔄 Test Connection'}
        </button>

        {!status.isPolling ? (
          <button
            onClick={handleStartPolling}
            className="btn btn-success"
          >
            ▶ Start Polling
          </button>
        ) : (
          <button
            onClick={handleStopPolling}
            className="btn btn-danger"
          >
            ⏹ Stop Polling
          </button>
        )}

        {status.isPolling && !status.isPaused && (
          <button
            onClick={handlePausePolling}
            className="btn btn-warning"
          >
            ⏸ Pause
          </button>
        )}

        {status.isPolling && status.isPaused && (
          <button
            onClick={handleResumePolling}
            className="btn btn-success"
          >
            ▶ Resume
          </button>
        )}
      </div>

      {/* Setup Instructions */}
      {!status.connected && (
        <div className="setup-instructions">
          <h4>📋 Setup Instructions</h4>
          <ol>
            <li>
              <strong>Install bridge server:</strong>
              <pre>cd c:\TUYA\RankifyAssist\bridge-server{'\n'}node server.js</pre>
            </li>
            <li>
              <strong>Start ngrok (optional, for Tuya MCP):</strong>
              <pre>ngrok http 3000</pre>
            </li>
            <li>
              Click "Test Connection" above
            </li>
            <li>
              If connected, click "Start Polling"
            </li>
          </ol>

          <p>
            <strong>Note:</strong> Bridge server is optional. Extension works normally without it.
            It's only needed for Tuya AI Workflow integration.
          </p>
        </div>
      )}

      {/* Connection Success */}
      {status.connected && status.isPolling && (
        <div className="success-message">
          <h4>✅ Ready for Tuya AI Commands</h4>
          <p>
            Your extension is now listening for commands from Tuya AI Workflow.
            Try saying "check my gmail" in the SmartLife app!
          </p>
        </div>
      )}

      {/* Troubleshooting */}
      <details className="troubleshooting">
        <summary>🔧 Troubleshooting</summary>

        <div className="troubleshooting-content">
          <h5>Bridge server not starting?</h5>
          <ul>
            <li>Check Node.js installed: <code>node --version</code></li>
            <li>Install dependencies: <code>npm install</code></li>
            <li>Check port 3000 not in use: <code>netstat -ano | findstr :3000</code></li>
          </ul>

          <h5>Connection test fails?</h5>
          <ul>
            <li>Verify bridge server running at http://localhost:3000/health</li>
            <li>Check Windows Firewall settings</li>
            <li>Try different port (edit tuyaBridge.ts)</li>
          </ul>

          <h5>Commands not executing?</h5>
          <ul>
            <li>Check polling is active (not paused)</li>
            <li>Verify MCP server running</li>
            <li>Check ngrok tunnel active</li>
            <li>Look at console logs for errors</li>
          </ul>
        </div>
      </details>

      <style>{`
        .tuya-bridge-settings {
          padding: 20px;
          max-width: 800px;
        }

        .bridge-info {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .status-card {
          border: 2px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .status-card.connected {
          border-color: #4caf50;
          background: #f1f8f4;
        }

        .status-card.disconnected {
          border-color: #f44336;
          background: #fff5f5;
        }

        .status-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .status-indicator {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
        }

        .status-indicator.green {
          background: #4caf50;
        }

        .status-indicator.red {
          background: #f44336;
        }

        .status-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .status-row {
          display: flex;
          gap: 10px;
        }

        .status-row strong {
          min-width: 120px;
        }

        .bridge-url-input {
          flex: 1;
          padding: 8px 12px;
          border: 2px solid #ddd;
          border-radius: 4px;
          font-size: 13px;
          font-family: 'Courier New', monospace;
          transition: border-color 0.2s;
        }

        .bridge-url-input:focus {
          outline: none;
          border-color: #2196f3;
        }

        .bridge-url-input:valid {
          border-color: #4caf50;
        }

        .bridge-url-input:invalid {
          border-color: #f44336;
        }

        .bridge-controls {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #2196f3;
          color: white;
        }

        .btn-success {
          background: #4caf50;
          color: white;
        }

        .btn-danger {
          background: #f44336;
          color: white;
        }

        .btn-warning {
          background: #ff9800;
          color: white;
        }

        .setup-instructions,
        .success-message {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .success-message {
          border-color: #4caf50;
          background: #f1f8f4;
        }

        .setup-instructions pre {
          background: #2d2d2d;
          color: #f8f8f2;
          padding: 10px;
          border-radius: 4px;
          overflow-x: auto;
          font-size: 13px;
        }

        .text-success {
          color: #4caf50;
        }

        .text-muted {
          color: #999;
        }

        .troubleshooting {
          margin-top: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
        }

        .troubleshooting summary {
          cursor: pointer;
          font-weight: bold;
          user-select: none;
        }

        .troubleshooting-content {
          margin-top: 15px;
        }

        .troubleshooting-content h5 {
          margin-top: 15px;
          color: #333;
        }

        .troubleshooting-content ul {
          padding-left: 20px;
        }

        .troubleshooting-content code {
          background: #f5f5f5;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
