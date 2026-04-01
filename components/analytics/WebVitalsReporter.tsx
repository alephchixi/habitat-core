"use client";

import { useEffect } from "react";
import { useReportWebVitals } from "next/web-vitals";

type ReportWebVitalsCallback = Parameters<typeof useReportWebVitals>[0];

type MetricPayload = {
  id: string;
  name: string;
  value: number;
  delta: number;
  rating?: string;
  navigationType?: string;
};

function sendMetric(metric: MetricPayload) {
  const payload = JSON.stringify({
    id: metric.id,
    name: metric.name,
    value: metric.value,
    delta: metric.delta,
    rating: metric.rating,
    navigationType: metric.navigationType,
    pathname: window.location.pathname,
    href: window.location.href,
  });

  const url = "/api/analytics/web-vitals";
  void fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: payload,
    keepalive: true,
  });
}

function sendMetricWithBeacon(metric: MetricPayload) {
  const payload = JSON.stringify({
    id: metric.id,
    name: metric.name,
    value: metric.value,
    delta: metric.delta,
    rating: metric.rating,
    navigationType: metric.navigationType,
    pathname: window.location.pathname,
    href: window.location.href,
  });

  const url = "/api/analytics/web-vitals";
  const canUseBeacon = typeof navigator.sendBeacon === "function";

  if (canUseBeacon) {
    const body = new Blob([payload], { type: "application/json" });
    const queued = navigator.sendBeacon(url, body);
    if (queued) {
      return;
    }
  }

  void fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: payload,
    keepalive: true,
  });
}

const postWebVitals: ReportWebVitalsCallback = (metric) => {
  sendMetricWithBeacon({
    id: metric.id,
    name: metric.name,
    value: metric.value,
    delta: metric.delta,
    rating: metric.rating,
    navigationType: metric.navigationType,
  });
};

function metricRating(name: "LCP" | "CLS" | "INP", value: number): "good" | "needs-improvement" | "poor" {
  if (name === "LCP") {
    if (value <= 2500) return "good";
    if (value <= 4000) return "needs-improvement";
    return "poor";
  }

  if (name === "CLS") {
    if (value <= 0.1) return "good";
    if (value <= 0.25) return "needs-improvement";
    return "poor";
  }

  if (value <= 200) return "good";
  if (value <= 500) return "needs-improvement";
  return "poor";
}

export function WebVitalsReporter() {
  useReportWebVitals(postWebVitals);

  useEffect(() => {
    if (!("PerformanceObserver" in window)) return;

    let lcpValue = 0;
    let clsValue = 0;
    let inpValue = 0;
    let flushed = false;

    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (!lastEntry) return;

      const candidate = Number(lastEntry.startTime);
      if (Number.isFinite(candidate) && candidate > lcpValue) {
        lcpValue = candidate;
      }
    });

    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const shift = entry as PerformanceEntry & {
          value?: number;
          hadRecentInput?: boolean;
        };

        if (shift.hadRecentInput) continue;
        const value = Number(shift.value);
        if (Number.isFinite(value) && value > 0) {
          clsValue += value;
        }
      }
    });

    const inpObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const candidate = Number(entry.duration);
        if (Number.isFinite(candidate) && candidate > inpValue) {
          inpValue = candidate;
        }
      }
    });

    try {
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      // Not supported in this browser/runtime.
    }

    try {
      clsObserver.observe({ type: "layout-shift", buffered: true });
    } catch {
      // Not supported in this browser/runtime.
    }

    try {
      // `durationThreshold` is supported by Chromium but not typed in all TS DOM libs yet.
      (inpObserver as PerformanceObserver).observe({
        type: "event",
        buffered: true,
      } as PerformanceObserverInit);
    } catch {
      // Not supported in this browser/runtime.
    }

    function resolveLcpValue(): number {
      if (lcpValue > 0) return lcpValue;

      const fcp = performance
        .getEntriesByType("paint")
        .find((entry) => entry.name === "first-contentful-paint");

      const fallback = Number(fcp?.startTime);
      if (Number.isFinite(fallback) && fallback > 0) {
        return fallback;
      }

      return Math.max(0, performance.now());
    }

    function flushMetrics() {
      if (flushed) return;
      flushed = true;

      const resolvedLcp = resolveLcpValue();
      sendMetric({
        id: `manual-lcp-${Date.now().toString(36)}`,
        name: "LCP",
        value: resolvedLcp,
        delta: resolvedLcp,
        rating: metricRating("LCP", resolvedLcp),
        navigationType: "navigate",
      });

      const resolvedCls = Math.max(0, clsValue);
      sendMetric({
        id: `manual-cls-${Date.now().toString(36)}`,
        name: "CLS",
        value: resolvedCls,
        delta: resolvedCls,
        rating: metricRating("CLS", resolvedCls),
        navigationType: "navigate",
      });

      const resolvedInp = Math.max(0, inpValue);
      sendMetric({
        id: `manual-inp-${Date.now().toString(36)}`,
        name: "INP",
        value: resolvedInp,
        delta: resolvedInp,
        rating: metricRating("INP", resolvedInp),
        navigationType: "navigate",
      });
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushMetrics();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange, true);
    window.addEventListener("pagehide", flushMetrics, true);
    window.addEventListener("beforeunload", flushMetrics, true);
    const timer = window.setTimeout(flushMetrics, 150);

    return () => {
      flushMetrics();
      window.clearTimeout(timer);
      lcpObserver.disconnect();
      clsObserver.disconnect();
      inpObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange, true);
      window.removeEventListener("pagehide", flushMetrics, true);
      window.removeEventListener("beforeunload", flushMetrics, true);
    };
  }, []);

  return null;
}
