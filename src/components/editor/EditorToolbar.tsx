import React from 'react';
import Button from '@/components/ui/Button';

export interface EditorToolbarProps {
  theme: string;
  onThemeChange: (theme: string) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

export default function EditorToolbar({
  theme,
  onThemeChange,
  fontSize,
  onFontSizeChange,
}: EditorToolbarProps) {
  const themes = [
    { label: 'Dark', value: 'vs-dark' },
    { label: 'Light', value: 'vs-light' },
  ];

  const fontSizes = [12, 14, 16, 18, 20];

  return (
    <div className="flex items-center justify-between p-2 bg-surface-light rounded-t-md">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="theme" className="text-sm font-medium">
            Theme:
          </label>
          <select
            id="theme"
            value={theme}
            onChange={(e) => onThemeChange(e.target.value)}
            className="text-sm border rounded-md px-2 py-1"
          >
            {themes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="fontSize" className="text-sm font-medium">
            Font Size:
          </label>
          <select
            id="fontSize"
            value={fontSize}
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
            className="text-sm border rounded-md px-2 py-1"
          >
            {fontSizes.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
