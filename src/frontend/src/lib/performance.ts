// Performance monitoring utilities — production-safe (no console.log)

export interface PerformanceMetrics {
  startTime: number;
  marks: Record<string, number>;
  measures: Record<string, number>;
  vitals: Record<string, { name: string; value: number; rating: string }>;
}

declare global {
  interface Window {
    performanceMetrics?: PerformanceMetrics;
  }
}

/** Mark a performance milestone */
export function markPerformance(name: string): void {
  try {
    performance.mark(name);
    if (window.performanceMetrics) {
      window.performanceMetrics.marks[name] = performance.now();
    }
  } catch {
    // Silently ignore if Performance API unavailable
  }
}

/** Measure time between two marks */
export function measurePerformance(
  name: string,
  startMark: string,
  endMark: string,
): number | null {
  try {
    performance.measure(name, startMark, endMark);
    const entries = performance.getEntriesByName(name, "measure");
    if (!entries.length) return null;
    const duration = entries[0].duration;
    if (window.performanceMetrics) {
      window.performanceMetrics.measures[name] = duration;
    }
    return duration;
  } catch {
    return null;
  }
}

/** Log app startup (silent in prod) */
export function logAppStartup(_appName: string): void {
  markPerformance("app-startup-complete");
}

/** Get all performance metrics */
export function getPerformanceMetrics(): PerformanceMetrics | null {
  return window.performanceMetrics || null;
}

/** Log performance summary (no-op in prod) */
export function logPerformanceSummary(): void {
  // Silent in production — metrics tracked internally only
}

/** Get cache performance statistics */
export async function getCachePerformance(): Promise<void> {
  // Silent in production
}

/** Monitor component render time */
export function measureComponentRender(
  componentName: string,
  callback: () => void,
): void {
  const startMark = `${componentName}-render-start`;
  const endMark = `${componentName}-render-end`;
  markPerformance(startMark);
  callback();
  markPerformance(endMark);
  measurePerformance(`${componentName}-render`, startMark, endMark);
}

/** Clear all caches */
export async function clearAllCaches(): Promise<void> {
  if (!("serviceWorker" in navigator) || !navigator.serviceWorker.controller)
    return;
  navigator.serviceWorker.controller.postMessage({ type: "CLEAR_CACHE" });
}

/** Force service worker update */
export async function updateServiceWorker(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) await registration.update();
  } catch {
    // Silently ignore
  }
}
