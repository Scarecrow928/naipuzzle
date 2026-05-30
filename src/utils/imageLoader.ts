import type { ImageLoadResult } from '../types'

export function loadImageFromFile(file: File): Promise<ImageLoadResult> {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('所选文件不是图片。'))
      return
    }
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => resolve({ url, img, ratio: img.naturalWidth / img.naturalHeight })
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('图片文件加载失败。'))
    }
    img.src = url
  })
}

export function loadImageFromURL(urlString: string): Promise<ImageLoadResult> {
  return new Promise((resolve, reject) => {
    if (!urlString || !urlString.trim()) {
      reject(new Error('请输入有效的网址。'))
      return
    }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve({ url: urlString.trim(), img, ratio: img.naturalWidth / img.naturalHeight })
    img.onerror = () => {
      reject(new Error('网址图片加载失败，可能是跨域限制或网址无效。'))
    }
    img.src = urlString.trim()
  })
}
