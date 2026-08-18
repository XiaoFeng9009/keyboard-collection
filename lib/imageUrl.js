export function thumbFor(src) {
  if (!src || !/\.(png|jpe?g|webp)$/i.test(src)) return src
  return src.replace(/\.(png|jpe?g|webp)$/i, '.webp').replace('/images/', '/thumbnails/')
}
