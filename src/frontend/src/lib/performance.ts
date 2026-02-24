// Advanced performance monitoring utilities

export interface PerformanceMetrics {
  startTime: number;
  marks: Record<string, number>;
  measures: Record<string, number>;
  vitals: Record<string, {
    name: string;
    value: number;
    rating: string;
  }>;
}

declare global {
  interface Window {
    performanceMetrics?: PerformanceMetrics;
  }
}

/**
 * Mark a performance milestone
 */
export function markPerformance(name: string): void {
  try {
    performance.mark(name);
    if (window.performanceMetrics) {
      window.performanceMetrics.marks[name] = performance.now();
    }
    console.log(`[Performance] ✓ ${name} at ${performance.now().toFixed(2)}ms`);
  } catch (error) {
    console.warn('Performance marking not supported:', error);
  }
}

/**
 * Measure time between two marks
 */
export function measurePerformance(name: string, startMark: string, endMark: string): number | null {
  try {
    performance.measure(name, startMark, endMark);
    const measure = performance.getEntriesByName(name, 'measure')[0];
    const duration = measure.duration;
    
    if (window.performanceMetrics) {
      window.performanceMetrics.measures[name] = duration;
    }
    
    console.log(`[Performance] ⏱️  ${name} = ${duration.toFixed(2)}ms`);
    return duration;
  } catch (error) {
    console.warn('Performance measurement failed:', error);
    return null;
  }
}

/**
 * Log app startup time with rating
 */
export function logAppStartup(appName: string): void {
  markPerformance(`${appName}-startup-complete`);
  
  if (window.performanceMetrics) {
    const startupTime = performance.now() - window.performanceMetrics.startTime;
    const rating = startupTime < 1000 ? '🟢 Excellent' : 
                   startupTime < 2500 ? '🟡 Good' : '🔴 Needs Improvement';
    console.log(`[Performance] 🚀 ${appName} startup: ${startupTime.toFixed(2)}ms ${rating}`);
  }
}

/**
 * Get all performance metrics
 */
export function getPerformanceMetrics(): PerformanceMetrics | null {
  return window.performanceMetrics || null;
}

/**
 * Log comprehensive performance summary with ratings
 */
export function logPerformanceSummary(): void {
  const metrics = getPerformanceMetrics();
  if (!metrics) {
    console.warn('No performance metrics available');
    return;
  }
  
  console.group('📊 Performance Summary - Core Web Vitals');
  
  // Core Web Vitals with ratings
  if (metrics.vitals.LCP) {
    const { value, rating } = metrics.vitals.LCP;
    const icon = rating === 'good' ? '🟢' : rating === 'needs-improvement' ? '🟡' : '🔴';
    console.log(`${icon} LCP (Largest Contentful Paint): ${value.toFixed(2)}ms - ${rating}`);
  }
  
  if (metrics.vitals.FID) {
    const { value, rating } = metrics.vitals.FID;
    const icon = rating === 'good' ? '🟢' : rating === 'needs-improvement' ? '🟡' : '🔴';
    console.log(`${icon} FID (First Input Delay): ${value.toFixed(2)}ms - ${rating}`);
  }
  
  if (metrics.vitals.CLS) {
    const { value, rating } = metrics.vitals.CLS;
    const icon = rating === 'good' ? '🟢' : rating === 'needs-improvement' ? '🟡' : '🔴';
    console.log(`${icon} CLS (Cumulative Layout Shift): ${value.toFixed(4)} - ${rating}`);
  }
  
  if (metrics.vitals.FCP) {
    const { value, rating } = metrics.vitals.FCP;
    const icon = rating === 'good' ? '🟢' : rating === 'needs-improvement' ? '🟡' : '🔴';
    console.log(`${icon} FCP (First Contentful Paint): ${value.toFixed(2)}ms - ${rating}`);
  }
  
  if (metrics.vitals.TTFB) {
    const { value, rating } = metrics.vitals.TTFB;
    const icon = rating === 'good' ? '🟢' : rating === 'needs-improvement' ? '🟡' : '🔴';
    console.log(`${icon} TTFB (Time to First Byte): ${value.toFixed(2)}ms - ${rating}`);
  }
  
  console.groupEnd();
  
  // Additional metrics
  console.group('📈 Additional Metrics');
  
  if (metrics.vitals['DOM Ready']) {
    console.log(`⚡ DOM Ready: ${metrics.vitals['DOM Ready'].value.toFixed(2)}ms`);
  }
  
  if (metrics.vitals['Page Load']) {
    console.log(`📦 Page Load: ${metrics.vitals['Page Load'].value.toFixed(2)}ms`);
  }
  
  console.groupEnd();
  
  // Cache performance
  getCachePerformance();
}

/**
 * Get cache performance statistics
 */
export async function getCachePerformance(): Promise<void> {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    return;
  }
  
  try {
    const channel = new MessageChannel();
    
    channel.port1.onmessage = (event) => {
      if (event.data.type === 'CACHE_SIZE') {
        console.group('💾 Cache Performance');
        event.data.sizes.forEach((cache: { name: string; size: number }) => {
          console.log(`${cache.name}: ${cache.size} entries`);
        });
        console.groupEnd();
      }
    };
    
    navigator.serviceWorker.controller.postMessage(
      { type: 'GET_CACHE_SIZE' },
      [channel.port2]
    );
  } catch (error) {
    console.warn('Failed to get cache stats:', error);
  }
}

/**
 * Monitor component render time
 */
export function measureComponentRender(componentName: string, callback: () => void): void {
  const startMark = `${componentName}-render-start`;
  const endMark = `${componentName}-render-end`;
  
  markPerformance(startMark);
  callback();
  markPerformance(endMark);
  measurePerformance(`${componentName}-render`, startMark, endMark);
}

/**
 * Clear all caches (for debugging)
 */
export async function clearAllCaches(): Promise<void> {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    console.warn('Service worker not available');
    return;
  }
  
  navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
  console.log('[Performance] Cache clear requested');
}

/**
 * Force service worker update
 */
export async function updateServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }
  
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      console.log('[Performance] Service worker update requested');
    }
  } catch (error) {
    console.warn('Failed to update service worker:', error);
  }
}
