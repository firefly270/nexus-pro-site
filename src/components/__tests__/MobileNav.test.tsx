import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MobileNav from '../MobileNav';
import { vi } from 'vitest';
import { VendorProvider, useVendor } from '../../context/VendorContext';
import { nvidiaChapters } from '../../constants/vendors';
import { useEffect, type ReactNode } from 'react';
import type { Vendor } from '../../types';

const chapterIds = nvidiaChapters.map(c => c.id);

function VendorSetup({ vendor, children }: { vendor: Vendor; children: ReactNode }) {
  const { setVendor } = useVendor();
  useEffect(() => { setVendor(vendor); }, [setVendor, vendor]);
  return <>{children}</>;
}

beforeEach(() => {
  document.body.innerHTML = chapterIds.map(id => `<div id="${id}"></div>`).join('');
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
    cb(performance.now());
    return 0;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('does not render when no vendor selected', () => {
  render(
    <VendorProvider>
      <MobileNav />
    </VendorProvider>
  );
  expect(screen.queryByLabelText(/open chapter menu/i)).not.toBeInTheDocument();
});

it('renders mobile nav bar when nvidia selected', () => {
  render(
    <VendorProvider>
      <VendorSetup vendor="nvidia">
        <MobileNav />
      </VendorSetup>
    </VendorProvider>
  );
  expect(screen.getByLabelText(/open chapter menu/i)).toBeInTheDocument();
});

it('opens chapter grid on click', async () => {
  render(
    <VendorProvider>
      <VendorSetup vendor="nvidia">
        <MobileNav />
      </VendorSetup>
    </VendorProvider>
  );
  fireEvent.click(screen.getByLabelText(/open chapter menu/i));
  await waitFor(() => {
    expect(screen.getByText(/The Beginning/i)).toBeInTheDocument();
  });
});

it('closes chapter grid on Escape', async () => {
  render(
    <VendorProvider>
      <VendorSetup vendor="nvidia">
        <MobileNav />
      </VendorSetup>
    </VendorProvider>
  );
  fireEvent.click(screen.getByLabelText(/open chapter menu/i));
  await waitFor(() => {
    expect(screen.getByText(/The Beginning/i)).toBeInTheDocument();
  });
  fireEvent.keyDown(document, { key: 'Escape' });
  await waitFor(() => {
    expect(screen.queryByText(/The Beginning/i)).not.toBeInTheDocument();
  });
});

it('closes chapter grid on outside click', async () => {
  render(
    <VendorProvider>
      <VendorSetup vendor="nvidia">
        <MobileNav />
      </VendorSetup>
    </VendorProvider>
  );
  fireEvent.click(screen.getByLabelText(/open chapter menu/i));
  await waitFor(() => {
    expect(screen.getByText(/The Beginning/i)).toBeInTheDocument();
  });
  fireEvent.mouseDown(document.body);
  await waitFor(() => {
    expect(screen.queryByText(/The Beginning/i)).not.toBeInTheDocument();
  });
});
