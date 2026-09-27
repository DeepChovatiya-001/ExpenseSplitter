import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-btn ${className}`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle theme"
    >
      <div className="theme-toggle-icon-wrapper">
        {isDark ? (
          <Sun size={18} className="theme-icon sun-icon text-amber-400" />
        ) : (
          <Moon size={18} className="theme-icon moon-icon text-indigo-600" />
        )}
      </div>
      {showLabel && (
        <span className="theme-toggle-label ms-2 small fw-semibold">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
