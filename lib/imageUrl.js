export function thumbFor(src) {
  if (!src || !/\.(png|jpe?g|webp)$/i.test(src)) return src
  return src.replace(/\.(png|jpe?g|webp)$/i, '.webp').replace('/images/', '/thumbnails/')
}

export function displayImage(src) {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return src
  }
  return thumbFor(src)
}
