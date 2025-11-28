import { createRequestHandler, RouterContextProvider } from 'react-router'

const handler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
)

export default (request: Request) =>
  handler(request, new RouterContextProvider())
