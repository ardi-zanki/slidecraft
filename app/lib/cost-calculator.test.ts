import { describe, it, expect } from 'vitest'
import {
  calculateGenerationCost,
  formatCost,
  formatCostJPY,
  getCostMessage,
  getCostMessageJPY,
} from './cost-calculator'

describe('cost-calculator', () => {
  describe('calculateGenerationCost', () => {
    it('should calculate cost for single image generation with short prompt', () => {
      const result = calculateGenerationCost('背景を白に変更', 1)

      expect(result.inputCost).toBeGreaterThan(0)
      expect(result.outputCost).toBe(0.134) // 1K/2K resolution: $0.134/image
      expect(result.totalCost).toBe(result.inputCost + result.outputCost)
      expect(result.inputTokens).toBeGreaterThan(0)
      expect(result.outputTokens).toBe(0)
    })

    it('should calculate cost for multiple image generation', () => {
      const result = calculateGenerationCost('タイトルを大きく', 3)

      expect(result.outputCost).toBe(0.134 * 3) // 3 images
      expect(result.totalCost).toBeGreaterThan(result.outputCost)
    })

    it('should estimate token count for Japanese text', () => {
      // 日本語は約2文字/tokenで推定される
      const shortPrompt = calculateGenerationCost('修正', 1)
      const longPrompt = calculateGenerationCost(
        '背景色を青から白に変更して、タイトルのフォントサイズを大きくする',
        1,
      )

      expect(longPrompt.inputTokens).toBeGreaterThan(shortPrompt.inputTokens)
      expect(longPrompt.inputCost).toBeGreaterThan(shortPrompt.inputCost)
    })

    it('should include image input cost (original image)', () => {
      const result = calculateGenerationCost('test', 1)

      // 画像入力コストが含まれている（$0.0011）
      expect(result.inputCost).toBeGreaterThan(0.001)
    })
  })

  describe('formatCost', () => {
    it('should format very small costs with 4 decimals', () => {
      expect(formatCost(0.00001)).toBe('$0.0000')
      expect(formatCost(0.00099)).toBe('$0.0010')
    })

    it('should format small costs (< $0.01) with 4 decimals', () => {
      expect(formatCost(0.0035)).toBe('$0.0035')
      expect(formatCost(0.0099)).toBe('$0.0099')
    })

    it('should format medium costs (< $1) with 3 decimals', () => {
      expect(formatCost(0.135)).toBe('$0.135')
      expect(formatCost(0.999)).toBe('$0.999')
    })

    it('should format large costs (>= $1) with 2 decimals', () => {
      expect(formatCost(1.0)).toBe('$1.00')
      expect(formatCost(12.345)).toBe('$12.35')
      expect(formatCost(100.5)).toBe('$100.50')
    })
  })

  describe('formatCostJPY', () => {
    const exchangeRate = 150 // 1 USD = 150 JPY

    it('should format very small JPY amounts with 2 decimals', () => {
      expect(formatCostJPY(0.0001, exchangeRate)).toBe('¥0.02') // 0.015 JPY → 0.02
      expect(formatCostJPY(0.0005, exchangeRate)).toBe('¥0.07') // 0.075 JPY → 0.07 (floating point precision)
    })

    it('should format small JPY amounts (< ¥1) with 1 decimal', () => {
      expect(formatCostJPY(0.005, exchangeRate)).toBe('¥0.8') // 0.75 JPY
      expect(formatCostJPY(0.006, exchangeRate)).toBe('¥0.9') // 0.9 JPY
    })

    it('should format large JPY amounts (>= ¥1) as rounded integers', () => {
      expect(formatCostJPY(0.01, exchangeRate)).toBe('¥2') // 1.5 JPY → 2
      expect(formatCostJPY(0.135, exchangeRate)).toBe('¥20') // 20.25 JPY → 20
      expect(formatCostJPY(1.0, exchangeRate)).toBe('¥150') // 150 JPY
    })

    it('should handle different exchange rates correctly', () => {
      const cost = 0.135 // $0.135
      expect(formatCostJPY(cost, 100)).toBe('¥14') // 13.5 JPY → 14
      expect(formatCostJPY(cost, 150)).toBe('¥20') // 20.25 JPY → 20
      expect(formatCostJPY(cost, 200)).toBe('¥27') // 27 JPY
    })
  })

  describe('getCostMessage', () => {
    it('should generate detailed cost message in USD', () => {
      const estimate = calculateGenerationCost('テスト', 2)
      const message = getCostMessage(estimate)

      expect(message).toContain('入力:')
      expect(message).toContain('出力:')
      expect(message).toContain('合計:')
      expect(message).toContain('$')
    })
  })

  describe('getCostMessageJPY', () => {
    it('should generate detailed cost message in JPY', () => {
      const estimate = calculateGenerationCost('テスト', 2)
      const message = getCostMessageJPY(estimate, 150)

      expect(message).toContain('入力:')
      expect(message).toContain('出力:')
      expect(message).toContain('合計:')
      expect(message).toContain('¥')
    })
  })

  describe('real-world scenarios', () => {
    it('should calculate realistic cost for typical slide modification', () => {
      // 典型的なスライド修正のシナリオ
      const prompt = '背景色を青から白に変更して、タイトルを太字にする'
      const result = calculateGenerationCost(prompt, 1)

      // 1枚の修正で約 $0.135 程度（画像出力が主なコスト）
      expect(result.totalCost).toBeGreaterThan(0.13)
      expect(result.totalCost).toBeLessThan(0.15)

      // 150円/ドルで約20円
      const jpyCost = result.totalCost * 150
      expect(jpyCost).toBeGreaterThan(19)
      expect(jpyCost).toBeLessThan(22)
    })

    it('should calculate cost for batch generation (4 variations)', () => {
      const prompt = 'スライドのデザインを改善'
      const result = calculateGenerationCost(prompt, 4)

      // 4枚生成で約 $0.54 程度
      expect(result.totalCost).toBeGreaterThan(0.53)
      expect(result.totalCost).toBeLessThan(0.55)

      // 150円/ドルで約80円
      const jpyCost = result.totalCost * 150
      expect(jpyCost).toBeGreaterThan(79)
      expect(jpyCost).toBeLessThan(83)
    })
  })
})
