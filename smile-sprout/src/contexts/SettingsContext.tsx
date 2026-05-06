import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AppSettings {
  volume: number;
  language: 'vi' | 'en';
  reducedMotion: boolean;   // Chế độ Bình Tĩnh — tắt animation
  autoReadAloud: boolean;   // Tự động đọc câu hỏi bằng giọng nói
}

const DEFAULT_SETTINGS: AppSettings = {
  volume: 80,
  language: 'vi',
  reducedMotion: false,
  autoReadAloud: false,
};

const STORAGE_KEY = 'smile-sprout-settings';

interface SettingsContextValue {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
});

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Apply data-calm attribute to body for CSS overrides
  useEffect(() => {
    document.body.setAttribute('data-calm', String(settings.reducedMotion));
  }, [settings.reducedMotion]);

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
