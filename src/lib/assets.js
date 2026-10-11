// BASE_URL keeps public assets working when the site is served from a sub-path (GitHub Pages).
export const asset = (path) => `${import.meta.env.BASE_URL}${path}`
