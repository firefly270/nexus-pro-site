import { render, screen, fireEvent, act } from '@testing-library/react';
import ShareButton from '../ShareButton';

beforeEach(() => {
  vi.clearAllMocks();
  document.title = 'Test Title';
  const meta = document.querySelector('meta[name="description"]') || document.createElement('meta');
  meta.setAttribute('name', 'description');
  meta.setAttribute('content', 'Test description');
  document.head.appendChild(meta);
  Object.defineProperty(navigator, 'share', { value: undefined, writable: true, configurable: true });
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    writable: true, configurable: true,
  });
});

it('renders share button', () => {
  render(<ShareButton />);
  expect(screen.getByLabelText('Share this page')).toBeInTheDocument();
});

it('copies link to clipboard when Web Share API unavailable', async () => {
  render(<ShareButton />);
  await act(async () => {
    await fireEvent.click(screen.getByLabelText('Share this page'));
  });
  await vi.waitFor(() => {
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(window.location.href);
  });
});

it('shows copied state after clipboard copy', async () => {
  render(<ShareButton />);
  await act(async () => {
    await fireEvent.click(screen.getByLabelText('Share this page'));
  });
  expect(await screen.findByText('Copied')).toBeInTheDocument();
});

it('uses Web Share API when available', async () => {
  const shareFn = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'share', { value: shareFn, writable: true, configurable: true });
  render(<ShareButton />);
  await act(async () => {
    await fireEvent.click(screen.getByLabelText('Share this page'));
  });
  expect(shareFn).toHaveBeenCalledWith({
    title: 'Test Title',
    text: 'Test description',
    url: window.location.href,
  });
});
