import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../ThemeToggle';

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  document.documentElement.removeAttribute('data-theme');
});

it('renders with default dark theme', () => {
  render(<ThemeToggle />);
  expect(screen.getByText('Light')).toBeInTheDocument();
});

it('toggles to light mode on click', () => {
  render(<ThemeToggle />);
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByText('Dark')).toBeInTheDocument();
  expect(document.documentElement.getAttribute('data-theme')).toBe('light');
});

it('persists theme choice to localStorage', () => {
  render(<ThemeToggle />);
  fireEvent.click(screen.getByRole('button'));
  expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
});
