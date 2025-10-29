"use client";
import { useState } from "react";
import { usePerformanceMetrics } from "./usePerformanceMetrics";

export default function PerformanceMonitor() {
  const [enabled, setEnabled] = useState(true);
  const metrics = usePerformanceMetrics(enabled);

  if (!enabled) {
    return (
      <button
        onClick={() => setEnabled(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm"
      >
        Show Performance Monitor
      </button>
    );
  }

  const getColorForMetric = (value: number, thresholds: number[]) => {
    if (value <= thresholds[0]) return "text-green-500";
    if (value <= thresholds[1]) return "text-yellow-500";
    return "text-red-500";
  };

  const renderTimeColor = getColorForMetric(metrics.renderTime, [100, 500]);
  const domNodesColor = getColorForMetric(metrics.domNodes, [1000, 3000]);
  const fpsColor = getColorForMetric(metrics.scrollFps, [30, 15]);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-2xl z-50 min-w-[280px] border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-300">Performance Monitor</h3>
        <button
          onClick={() => setEnabled(false)}
          className="text-gray-400 hover:text-white text-xs"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Render Time:</span>
          <span className={renderTimeColor}>
            {metrics.renderTime.toFixed(2)}ms
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">DOM Nodes:</span>
          <span className={domNodesColor}>
            {metrics.domNodes.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Re-renders:</span>
          <span className="text-blue-400">{metrics.reRenderCount}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Scroll FPS:</span>
          <span className={fpsColor}>{metrics.scrollFps} fps</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">
            Avg FPS <span className="text-gray-500 text-xs">(10s)</span>:
          </span>
          <span className={fpsColor}>{metrics.averageFps} fps</span>
        </div>

        {metrics.memoryUsage && (
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Memory:</span>
            <span className="text-purple-400">
              {metrics.memoryUsage.toFixed(2)} MB
            </span>
          </div>
        )}

        <div className="pt-2 mt-2 border-t border-gray-700">
          <div className="text-gray-500 text-xs">
            <div className="mb-1">Thresholds:</div>
            <div className="text-green-400">✓ Good</div>
            <div className="text-yellow-400">⚠ Moderate</div>
            <div className="text-red-400">✗ Poor</div>
          </div>
        </div>
      </div>
    </div>
  );
}
