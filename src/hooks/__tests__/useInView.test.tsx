import { render, screen } from '@testing-library/react';
import { useInView } from '../useInView';

function TestComponent({ threshold, oneShot }: { threshold?: number; oneShot?: boolean }) {
  const { ref, vis } = useInView(threshold, oneShot);
  return <section ref={ref} data-testid="target">{vis ? 'visible' : 'hidden'}</section>;
}

describe('useInView', () => {
  it('renders with ref attached', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('target')).toBeInTheDocument();
  });

  it('accepts custom threshold', () => {
    render(<TestComponent threshold={0.5} />);
    expect(screen.getByTestId('target')).toBeInTheDocument();
  });

  it('accepts oneShot parameter', () => {
    render(<TestComponent oneShot={false} />);
    expect(screen.getByTestId('target')).toBeInTheDocument();
  });
});
