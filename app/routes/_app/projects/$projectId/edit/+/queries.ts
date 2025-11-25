import { getProject } from '~/lib/projects-repository.client'
import { loadSlides } from '~/lib/slides-repository.client'

export async function getEditorData(projectId: string, requestUrl: string) {
  const [project, slides] = await Promise.all([
    getProject(projectId),
    loadSlides(projectId),
  ])

  if (!project || slides.length === 0) {
    return null
  }

  const url = new URL(requestUrl)
  const slideParam = url.searchParams.get('slide')
  const selectedIndex = slideParam ? Number.parseInt(slideParam, 10) : 0
  const validIndex =
    selectedIndex >= 0 && selectedIndex < slides.length ? selectedIndex : 0

  return { projectId, project, slides, selectedIndex: validIndex }
}
