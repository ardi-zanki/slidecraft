// Google Analytics event tracking helpers

declare global {
  interface Window {
    gtag?: (
      command: string,
      ...args: (string | Record<string, unknown>)[]
    ) => void
  }
}

export function trackEvent(
  eventName: string,
  parameters?: Record<string, unknown>,
) {
  if (typeof window !== 'undefined' && window.gtag) {
    if (parameters) {
      window.gtag('event', eventName, parameters)
    } else {
      window.gtag('event', eventName)
    }
  }
}

// Page view tracking for client-side navigation
export function trackPageView(path: string, title?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-MYGWWZDCP2', {
      page_path: path,
      page_title: title || document.title,
    })
  }
}

// Project events
export function trackProjectCreated() {
  trackEvent('project_created')
}

export function trackPdfUploaded(pageCount: number) {
  trackEvent('pdf_uploaded', {
    page_count: pageCount,
  })
}

// Generation events
export function trackGenerationStarted(candidateCount: number) {
  trackEvent('generation_started', {
    candidate_count: candidateCount,
  })
}

export function trackGenerationCompleted(
  candidateCount: number,
  duration: number,
) {
  trackEvent('generation_completed', {
    candidate_count: candidateCount,
    duration_ms: duration,
  })
}

export function trackGenerationFailed(error: string) {
  trackEvent('generation_failed', {
    error_message: error,
  })
}

// Export events
export function trackPdfExported(pageCount: number) {
  trackEvent('pdf_exported', {
    page_count: pageCount,
  })
}

// API Key events
export function trackApiKeySet() {
  trackEvent('api_key_set')
}

export function trackApiKeyRemoved() {
  trackEvent('api_key_removed')
}
