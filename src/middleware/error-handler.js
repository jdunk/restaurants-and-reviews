export function handleError(e, resp) {
  resp.status(500).json({
    error: e.message
  });
}