import { useEffect, useState, useRef } from "react";

interface PerformanceMetrics {
  renderTime: number;
  domNodes: number;
  reRenderCount: number;
  scrollFps: number;
  averageFps: number;
  memoryUsage?: number;
}

// Type definition for Chrome's performance.memory API
interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

// Extended Performance interface with Chrome-specific memory API
interface PerformanceWithMemory extends Performance {
  memory?: PerformanceMemory;
}

// Type guard to check if performance.memory is available
function hasMemoryAPI(perf: Performance): perf is PerformanceWithMemory {
  return (
    "memory" in perf &&
    typeof (perf as PerformanceWithMemory).memory !== "undefined" &&
    typeof (perf as PerformanceWithMemory).memory?.usedJSHeapSize === "number"
  );
}

// Helper function to safely get memory usage in MB
function getMemoryUsageMB(): number | undefined {
  if (typeof window === "undefined" || typeof performance === "undefined") {
    return undefined;
  }

  if (hasMemoryAPI(performance)) {
    const memory = performance.memory;
    // TypeScript still needs explicit check even after type guard
    if (memory && typeof memory.usedJSHeapSize === "number") {
      return memory.usedJSHeapSize / 1048576; // Convert bytes to MB
    }
  }

  return undefined;
}

export function usePerformanceMetrics(enabled: boolean = true) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    domNodes: 0,
    reRenderCount: 0,
    scrollFps: 0,
    averageFps: 0,
    memoryUsage: 0,
  });

  const renderStartTime = useRef<number>(0);
  const reRenderCountRef = useRef<number>(0);
  const fpsHistoryRef = useRef<number[]>([]);
  const frameCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const isScrollingRef = useRef<boolean>(false);
  const scrollStartTimeRef = useRef<number>(0);

  // Measure initial render time
  useEffect(() => {
    if (!enabled) return;

    renderStartTime.current = performance.now();
    reRenderCountRef.current = 0;

    const measureRender = () => {
      const renderTime = performance.now() - renderStartTime.current;

      // Count DOM nodes
      const domNodes = document.querySelectorAll("*").length;

      // Check memory if available
      const memoryUsage = getMemoryUsageMB();

      setMetrics((prev) => ({
        ...prev,
        renderTime,
        domNodes,
        reRenderCount: reRenderCountRef.current,
        memoryUsage,
      }));
    };

    // Measure after React has finished rendering
    requestAnimationFrame(() => {
      setTimeout(measureRender, 0);
    });
  }, [enabled]);

  // Track re-renders
  useEffect(() => {
    if (!enabled) return;
    reRenderCountRef.current += 1;
  });

  // Measure scroll FPS
  useEffect(() => {
    if (!enabled) return;

    let animationFrameId: number;
    const fpsHistory: number[] = [];
    let scrollFrameCount = 0;

    const handleScrollStart = () => {
      isScrollingRef.current = true;
      scrollStartTimeRef.current = performance.now();
      scrollFrameCount = 0;
    };

    const handleScrollEnd = () => {
      isScrollingRef.current = false;
    };

    const measureFps = () => {
      const currentTime = performance.now();
      frameCountRef.current++;

      // Track scroll-specific FPS
      if (isScrollingRef.current) {
        scrollFrameCount++;
      }

      if (currentTime >= lastTimeRef.current + 1000) {
        // General FPS
        const fps = Math.round(
          (frameCountRef.current * 1000) / (currentTime - lastTimeRef.current)
        );

        // Scroll FPS calculation
        let scrollFps = 0;
        if (isScrollingRef.current && scrollStartTimeRef.current > 0) {
          const scrollDuration = currentTime - scrollStartTimeRef.current;
          scrollFps = Math.round((scrollFrameCount * 1000) / scrollDuration);
          scrollFrameCount = 0;
          scrollStartTimeRef.current = currentTime;
        }

        fpsHistory.push(fps);
        if (fpsHistory.length > 10) {
          fpsHistory.shift();
        }

        fpsHistoryRef.current = fpsHistory;

        const averageFps =
          fpsHistory.reduce((sum, f) => sum + f, 0) / fpsHistory.length;

        setMetrics((prev) => ({
          ...prev,
          scrollFps: scrollFps || prev.scrollFps,
          averageFps: Math.round(averageFps),
        }));

        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;
      }

      animationFrameId = requestAnimationFrame(measureFps);
    };

    // Add scroll event listeners
    window.addEventListener("scroll", handleScrollStart, { passive: true });
    let scrollTimeout: NodeJS.Timeout;
    const scrollEndHandler = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScrollEnd, 150);
    };
    window.addEventListener("scroll", scrollEndHandler, { passive: true });

    animationFrameId = requestAnimationFrame(measureFps);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("scroll", handleScrollStart);
      window.removeEventListener("scroll", scrollEndHandler);
      clearTimeout(scrollTimeout);
    };
  }, [enabled]);

  // Update metrics periodically
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      const domNodes = document.querySelectorAll("*").length;
      const memoryUsage = getMemoryUsageMB();

      setMetrics((prev) => ({
        ...prev,
        domNodes,
        reRenderCount: reRenderCountRef.current,
        memoryUsage,
        averageFps: fpsHistoryRef.current.length
          ? Math.round(
              fpsHistoryRef.current.reduce((sum, f) => sum + f, 0) /
                fpsHistoryRef.current.length
            )
          : prev.averageFps,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled]);

  return metrics;
}
