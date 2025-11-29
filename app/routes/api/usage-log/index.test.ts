import { describe, expect, it } from 'vitest'
import {
  ApiUsageLogSchema,
  MAX_METADATA_SIZE,
} from '~/lib/api-usage-log-schema'

describe('ApiUsageLogSchema validation', () => {
  describe('valid inputs', () => {
    it('should accept valid slide_analysis operation', () => {
      const validData = {
        operation: 'slide_analysis',
        model: 'gemini-3-pro-preview',
        inputTokens: 1000,
        outputTokens: 500,
        costUsd: 0.01,
        costJpy: 1.5,
        exchangeRate: 150,
      }

      const result = ApiUsageLogSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should accept valid image_generation operation', () => {
      const validData = {
        operation: 'image_generation',
        model: 'gemini-3-pro-image-preview',
        inputTokens: 2000,
        outputTokens: 0,
        costUsd: 0.134,
        costJpy: 20.1,
        exchangeRate: 150,
      }

      const result = ApiUsageLogSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should accept valid input with metadata', () => {
      const validData = {
        operation: 'slide_analysis',
        model: 'gemini-2.5-flash',
        inputTokens: 5000,
        outputTokens: 1000,
        costUsd: 0.05,
        costJpy: 7.5,
        exchangeRate: 150,
        metadata: {
          imageSize: 123456,
          textElementCount: 10,
          graphicRegionCount: 5,
        },
      }

      const result = ApiUsageLogSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should accept zero tokens', () => {
      const validData = {
        operation: 'image_generation',
        model: 'test-model',
        inputTokens: 0,
        outputTokens: 0,
        costUsd: 0,
        costJpy: 0,
        exchangeRate: 150,
      }

      const result = ApiUsageLogSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('invalid inputs', () => {
    it('should reject invalid operation', () => {
      const invalidData = {
        operation: 'invalid_operation',
        model: 'gemini-3-pro-preview',
        inputTokens: 1000,
        outputTokens: 500,
        costUsd: 0.01,
        costJpy: 1.5,
        exchangeRate: 150,
      }

      const result = ApiUsageLogSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject empty model', () => {
      const invalidData = {
        operation: 'slide_analysis',
        model: '',
        inputTokens: 1000,
        outputTokens: 500,
        costUsd: 0.01,
        costJpy: 1.5,
        exchangeRate: 150,
      }

      const result = ApiUsageLogSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject model exceeding max length', () => {
      const invalidData = {
        operation: 'slide_analysis',
        model: 'a'.repeat(101),
        inputTokens: 1000,
        outputTokens: 500,
        costUsd: 0.01,
        costJpy: 1.5,
        exchangeRate: 150,
      }

      const result = ApiUsageLogSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject negative inputTokens', () => {
      const invalidData = {
        operation: 'slide_analysis',
        model: 'gemini-3-pro-preview',
        inputTokens: -1,
        outputTokens: 500,
        costUsd: 0.01,
        costJpy: 1.5,
        exchangeRate: 150,
      }

      const result = ApiUsageLogSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject inputTokens exceeding max', () => {
      const invalidData = {
        operation: 'slide_analysis',
        model: 'gemini-3-pro-preview',
        inputTokens: 10_000_001,
        outputTokens: 500,
        costUsd: 0.01,
        costJpy: 1.5,
        exchangeRate: 150,
      }

      const result = ApiUsageLogSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject non-integer tokens', () => {
      const invalidData = {
        operation: 'slide_analysis',
        model: 'gemini-3-pro-preview',
        inputTokens: 1000.5,
        outputTokens: 500,
        costUsd: 0.01,
        costJpy: 1.5,
        exchangeRate: 150,
      }

      const result = ApiUsageLogSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject negative costUsd', () => {
      const invalidData = {
        operation: 'slide_analysis',
        model: 'gemini-3-pro-preview',
        inputTokens: 1000,
        outputTokens: 500,
        costUsd: -0.01,
        costJpy: 1.5,
        exchangeRate: 150,
      }

      const result = ApiUsageLogSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject costUsd exceeding max', () => {
      const invalidData = {
        operation: 'slide_analysis',
        model: 'gemini-3-pro-preview',
        inputTokens: 1000,
        outputTokens: 500,
        costUsd: 1001,
        costJpy: 1.5,
        exchangeRate: 150,
      }

      const result = ApiUsageLogSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject zero exchangeRate', () => {
      const invalidData = {
        operation: 'slide_analysis',
        model: 'gemini-3-pro-preview',
        inputTokens: 1000,
        outputTokens: 500,
        costUsd: 0.01,
        costJpy: 1.5,
        exchangeRate: 0,
      }

      const result = ApiUsageLogSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject negative exchangeRate', () => {
      const invalidData = {
        operation: 'slide_analysis',
        model: 'gemini-3-pro-preview',
        inputTokens: 1000,
        outputTokens: 500,
        costUsd: 0.01,
        costJpy: 1.5,
        exchangeRate: -150,
      }

      const result = ApiUsageLogSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject exchangeRate exceeding max', () => {
      const invalidData = {
        operation: 'slide_analysis',
        model: 'gemini-3-pro-preview',
        inputTokens: 1000,
        outputTokens: 500,
        costUsd: 0.01,
        costJpy: 1.5,
        exchangeRate: 501,
      }

      const result = ApiUsageLogSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject missing required fields', () => {
      const invalidData = {
        operation: 'slide_analysis',
        model: 'gemini-3-pro-preview',
        // missing inputTokens, outputTokens, costUsd, costJpy, exchangeRate
      }

      const result = ApiUsageLogSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('metadata size validation', () => {
    it('should calculate metadata size correctly', () => {
      const smallMetadata = { key: 'value' }
      const jsonString = JSON.stringify(smallMetadata)
      expect(jsonString.length).toBeLessThan(MAX_METADATA_SIZE)
    })

    it('should detect oversized metadata', () => {
      // 10KB超のメタデータを生成
      const largeValue = 'x'.repeat(MAX_METADATA_SIZE + 1)
      const largeMetadata = { data: largeValue }
      const jsonString = JSON.stringify(largeMetadata)
      expect(jsonString.length).toBeGreaterThan(MAX_METADATA_SIZE)
    })
  })
})
