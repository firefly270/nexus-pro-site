import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../ErrorBoundary';

const Buggy = () => { throw new Error('test error'); };

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(<ErrorBoundary><div data-testid="child">ok</div></ErrorBoundary>);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('catches error and shows fallback', () => {
    render(<ErrorBoundary><Buggy /></ErrorBoundary>);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('resets on try again click', () => {
    render(<ErrorBoundary><Buggy /></ErrorBoundary>);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/try again/i));
    expect(screen.getByText(/try again/i)).toBeInTheDocument();
  });
});
