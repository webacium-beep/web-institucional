import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * Global test setup for DOM / React island tests.
 *
 * - Registers @testing-library/jest-dom matchers (toBeInTheDocument, etc.)
 *   for all test files — also available in `node` env tests for symmetry.
 * - Cleans up React Testing Library mounts after each test in jsdom env.
 */
afterEach(() => {
  cleanup();
});
