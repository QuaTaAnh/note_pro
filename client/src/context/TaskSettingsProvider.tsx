"use client";

import { createContext, useContext, useState } from "react";

export interface TaskSettings {
  showScheduledTasks: boolean;
}

const DEFAULT_SETTINGS: TaskSettings = {
  showScheduledTasks: true,
};

interface TaskSettingsContextType {
  settings: TaskSettings;
  updateSetting: (key: keyof TaskSettings, value: boolean) => void;
  resetSettings: () => void;
}

const TaskSettingsContext = createContext<TaskSettingsContextType | undefined>(
  undefined
);

export function TaskSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<TaskSettings>(DEFAULT_SETTINGS);

  const updateSetting = (key: keyof TaskSettings, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const value: TaskSettingsContextType = {
    settings,
    updateSetting,
    resetSettings,
  };

  return (
    <TaskSettingsContext.Provider value={value}>
      {children}
    </TaskSettingsContext.Provider>
  );
}

export function useTaskSettings() {
  const context = useContext(TaskSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useTaskSettings must be used within a TaskSettingsProvider"
    );
  }
  return context;
}
