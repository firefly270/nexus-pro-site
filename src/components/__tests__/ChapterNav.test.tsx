import { render, screen, waitFor } from '@testing-library/react';
import ChapterNav from '../ChapterNav';
import { vi } from 'vitest';
import { VendorProvider, useVendor } from '../../context/VendorContext';
import { nvidiaChapters } from '../../constants/vendors';
import { useEffect, type ReactNode } from 'react';
import type { Vendor } from '../../types';

const chapterIds = nvidiaChapters.map(c => c.id);
let mockOffsets: Record<string, number> = {};

function VendorSetup({ vendor, children }: { vendor: Vendor; children: ReactNode }) {
  const { setVendor } = useVendor();
  useEffect(() => { setVendor(vendor); }, [setVendor, vendor]);
  return <>{children}</>;
}

beforeEach(() => {
  mockOffsets = {};
  chapterIds.forEach((id, i) => { mockOffsets[id] = i * 500; });
  vi.spyOn(document, 'getElementById').mockImplementation((id: string) => {
    if (mockOffsets[id] !== undefined) {
      return { offsetTop: mockOffsets[id] } as HTMLElement;
    }
    return null;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

function scrollTo(y: number) {
  window.scrollY = y;
  window.dispatchEvent(new Event('scroll', { bubbles: true }));
}

it('does not render when no vendor selected', async () => {
  render(
    <VendorProvider>
      <ChapterNav />
    </VendorProvider>
  );
  expect(screen.queryByLabelText(/next chapter/i)).not.toBeInTheDocument();
});

it('renders next chapter button when nvidia selected', async () => {
  render(
    <VendorProvider>
      <VendorSetup vendor="nvidia">
        <ChapterNav />
      </VendorSetup>
    </VendorProvider>
  );
  await waitFor(() => {
    expect(screen.getByLabelText(/next chapter/i)).toBeInTheDocument();
  });
});

it('does not render previous button at first chapter', async () => {
  render(
    <VendorProvider>
      <VendorSetup vendor="nvidia">
        <ChapterNav />
      </VendorSetup>
    </VendorProvider>
  );
  await waitFor(() => {
    expect(screen.getByLabelText(/next chapter/i)).toBeInTheDocument();
  });
  expect(screen.queryByLabelText(/previous chapter/i)).not.toBeInTheDocument();
});

it('renders previous button when scrolled past first chapter', async () => {
  render(
    <VendorProvider>
      <VendorSetup vendor="nvidia">
        <ChapterNav />
      </VendorSetup>
    </VendorProvider>
  );
  await waitFor(() => {
    expect(screen.getByLabelText(/next chapter/i)).toBeInTheDocument();
  });
  scrollTo(500);
  await waitFor(() => {
    expect(screen.getByLabelText(/previous chapter/i)).toBeInTheDocument();
  });
});
