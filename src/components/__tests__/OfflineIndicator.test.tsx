import { render, screen, act } from '@testing-library/react';
import OfflineIndicator from '../OfflineIndicator';

beforeEach(() => {
  Object.defineProperty(navigator, 'onLine', { value: true, writable: true, configurable: true });
});

it('does not render when online', () => {
  render(<OfflineIndicator />);
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

it('renders when going offline', () => {
  render(<OfflineIndicator />);
  act(() => { window.dispatchEvent(new Event('offline')); });
  expect(screen.getByRole('alert')).toBeInTheDocument();
  expect(screen.getByText(/offline/i)).toBeInTheDocument();
});

it('hides when coming back online', () => {
  render(<OfflineIndicator />);
  act(() => { window.dispatchEvent(new Event('offline')); });
  expect(screen.getByRole('alert')).toBeInTheDocument();
  act(() => { window.dispatchEvent(new Event('online')); });
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
