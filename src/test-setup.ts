import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, 'IntersectionObserver', {
  value: MockIntersectionObserver,
  writable: true,
});

Object.defineProperty(navigator, 'share', {
  value: undefined,
  writable: true,
  configurable: true,
});

Object.defineProperty(navigator, 'onLine', {
  value: true,
  writable: true,
  configurable: true,
});

Object.defineProperty(navigator, 'hardwareConcurrency', {
  value: 8,
  writable: true,
});

Object.defineProperty(navigator, 'sendBeacon', {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
  writable: true,
});

const storage: Record<string, string> = {};
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn((k: string) => storage[k] ?? null),
    setItem: vi.fn((k: string, v: string) => { storage[k] = v; }),
    removeItem: vi.fn((k: string) => { delete storage[k]; }),
    clear: vi.fn(() => { Object.keys(storage).forEach(k => delete storage[k]); }),
    get length() { return Object.keys(storage).length; },
    key: vi.fn((i: number) => Object.keys(storage)[i] ?? null),
  },
  writable: true,
});
