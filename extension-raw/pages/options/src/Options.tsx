import { useState, useEffect } from 'react';
import '@src/Options.css';
import { Button } from '@extension/ui';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { t } from '@extension/i18n';
import { FiSettings, FiCpu, FiShield, FiHome, FiZap, FiMoon, FiSun } from 'react-icons/fi';
import { GeneralSettings } from './components/GeneralSettings';
import { ModelSettings } from './components/ModelSettings';
import { FirewallSettings } from './components/FirewallSettings';
import { TuyaSettings } from './components/TuyaSettings';
import { LLMOptimizerSettings } from './components/LLMOptimizerSettings';

type TabTypes = 'general' | 'models' | 'firewall' | 'tuya' | 'optimizer';

const TABS: { id: TabTypes; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { id: 'general', icon: FiSettings, label: t('options_tabs_general') },
  { id: 'models', icon: FiCpu, label: t('options_tabs_models') },
  { id: 'firewall', icon: FiShield, label: t('options_tabs_firewall') },
  { id: 'tuya', icon: FiHome, label: 'Tuya Smart Home' },
  { id: 'optimizer', icon: FiZap, label: 'LLM Optimizer' },
];

const Options = () => {
  const [activeTab, setActiveTab] = useState<TabTypes>('models');
  // Default to Dark Mode if system prefers it
  const [isDarkMode, setIsDarkMode] = useState(() =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Monitor system preference changes
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener('change', handleChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleTabClick = (tabId: TabTypes) => {
    setActiveTab(tabId);
  };

  const renderTabContent = () => {
    // Props passed below for backward compatibility, but CSS vars handle most styling
    const props = { isDarkMode };
    switch (activeTab) {
      case 'general': return <GeneralSettings {...props} />;
      case 'models': return <ModelSettings {...props} />;
      case 'firewall': return <FirewallSettings {...props} />;
      case 'tuya': return <TuyaSettings {...props} />;
      case 'optimizer': return <LLMOptimizerSettings {...props} />;
      default: return null;
    }
  };

  return (
    <div className="app-container" data-theme={isDarkMode ? 'dark' : 'light'}>
      {/* Background with Gradient/Noise */}
      <div className="page-bg" />

      {/* Sidebar Navigation */}
      <nav className="z-20 w-72 glass-panel flex flex-col h-screen fixed left-0 top-0">
        <div className="p-8">
          <div className="mb-12 flex items-center gap-3">
            <div className="h-10 w-10 logo-box text-xl">R</div>
            <div>
              <h1 className="text-xl font-bold text-primary">
                Rankify
              </h1>
              <span className="text-xs font-medium text-muted uppercase tracking-wider">Assist AI</span>
            </div>
          </div>

          <ul className="space-y-2">
            {TABS.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full nav-item ${activeTab === item.id ? 'active' : ''}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto p-6 border-t border-color flex items-center justify-between">
          <div className="text-xs text-muted">
            v1.0.0
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-secondary"
            title="Toggle Theme"
          >
            {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 ml-72 relative z-10 min-h-screen">
        <div className="max-w-4xl mx-auto p-12 animate-fade-in">
          <header className="mb-10">
            <h2 className="text-3xl font-bold mb-2 text-display">{TABS.find(t => t.id === activeTab)?.label}</h2>
            <p className="text-body text-lg">Manage key settings for {TABS.find(t => t.id === activeTab)?.label.toLowerCase()}</p>
          </header>

          <div className="content-wrapper">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div>Loading...</div>), <div>Error Occurred</div>);
