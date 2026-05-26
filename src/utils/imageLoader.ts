import type { ImageLoadResult } from '../types'

export function loadImageFromFile(file: File): Promise<ImageLoadResult> {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'))
      return
    }
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => resolve({ url, img, ratio: img.naturalWidth / img.naturalHeight })
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image file.'))
    }
    img.src = url
  })
}

export function loadImageFromURL(urlString: string): Promise<ImageLoadResult> {
  return new Promise((resolve, reject) => {
    if (!urlString || !urlString.trim()) {
      reject(new Error('Please enter a valid URL.'))
      return
    }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve({ url: urlString.trim(), img, ratio: img.naturalWidth / img.naturalHeight })
    img.onerror = () => {
      reject(new Error('Failed to load image from URL. The image may be inaccessible due to CORS or the URL may be invalid.'))
    }
    img.src = urlString.trim()
  })
}
