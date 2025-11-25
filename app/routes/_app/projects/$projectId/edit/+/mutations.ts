import { loadSlides, saveSlides } from '~/lib/slides-repository.client'
import { deleteFile } from '~/lib/storage.client'
import type { Slide } from '~/lib/types'

export async function selectCandidate(formData: FormData, projectId: string) {
  try {
    const slideId = formData.get('slideId') as string
    const generatedId = formData.get('generatedId') as string | null

    const slides = await loadSlides(projectId)
    const slide = slides.find((s) => s.id === slideId)

    if (!slide) {
      return { error: 'スライドが見つかりません' }
    }

    const updatedSlide: Slide = {
      ...slide,
      currentGeneratedId: generatedId || undefined,
    }

    const updatedSlides = slides.map((s) =>
      s.id === slideId ? updatedSlide : s,
    )

    await saveSlides(projectId, updatedSlides)

    return { success: true, slideId, generatedId: generatedId || null }
  } catch (error) {
    console.error('候補適用エラー:', error)
    return {
      error:
        error instanceof Error ? error.message : '候補の適用に失敗しました',
    }
  }
}

export async function resetToOriginal(formData: FormData, projectId: string) {
  try {
    const slideId = formData.get('slideId') as string

    const slides = await loadSlides(projectId)
    const slide = slides.find((s) => s.id === slideId)

    if (!slide) {
      return { error: 'スライドが見つかりません' }
    }

    const updatedSlide: Slide = {
      ...slide,
      currentGeneratedId: undefined,
    }

    const updatedSlides = slides.map((s) =>
      s.id === slideId ? updatedSlide : s,
    )

    await saveSlides(projectId, updatedSlides)

    return { success: true, slideId }
  } catch (error) {
    console.error('リセットエラー:', error)
    return {
      error:
        error instanceof Error ? error.message : '元に戻す処理に失敗しました',
    }
  }
}

export async function deleteCandidate(formData: FormData, projectId: string) {
  try {
    const slideId = formData.get('slideId') as string
    const generatedId = formData.get('generatedId') as string

    if (!generatedId) {
      return { error: '削除する候補が指定されていません' }
    }

    const slides = await loadSlides(projectId)
    const slide = slides.find((s) => s.id === slideId)

    if (!slide) {
      return { error: 'スライドが見つかりません' }
    }

    const candidateIndex = slide.generatedCandidates.findIndex(
      (c) => c.id === generatedId,
    )
    if (candidateIndex === -1) {
      return { error: '削除対象の候補が見つかりません' }
    }

    const updatedCandidates = slide.generatedCandidates.filter(
      (c) => c.id !== generatedId,
    )

    const updatedSlide: Slide = {
      ...slide,
      generatedCandidates: updatedCandidates,
      currentGeneratedId:
        slide.currentGeneratedId === generatedId
          ? undefined
          : slide.currentGeneratedId,
    }

    const updatedSlides = slides.map((s) =>
      s.id === slideId ? updatedSlide : s,
    )

    await saveSlides(projectId, updatedSlides)

    const imagePath = `projects/${projectId}/images/${slideId}/generated/${generatedId}.png`
    try {
      await deleteFile(imagePath)
    } catch (error) {
      console.warn('画像ファイルの削除に失敗しました:', error)
    }

    return { success: true, slideId, deletedId: generatedId }
  } catch (error) {
    console.error('候補削除エラー:', error)
    return {
      error:
        error instanceof Error ? error.message : '候補の削除に失敗しました',
    }
  }
}
