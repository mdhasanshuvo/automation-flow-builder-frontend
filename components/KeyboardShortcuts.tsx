'use client';

import { useEffect } from 'react';

export default function KeyboardShortcuts({ onSave }: { onSave: () => void }) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Cmd+S or Ctrl+S to save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        onSave();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onSave]);

  return null;
}
