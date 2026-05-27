import { render } from '@testing-library/react';
import WebVitals from '../WebVitals';

beforeEach(() => {
  vi.clearAllMocks();
  import.meta.env.DEV = true;
});

it('renders nothing', () => {
  const { container } = render(<WebVitals />);
  expect(container.firstChild).toBeNull();
});

it('calls sendBeacon in production', () => {
  import.meta.env.DEV = false;
  render(<WebVitals />);
  expect(navigator.sendBeacon).not.toHaveBeenCalled();
});
