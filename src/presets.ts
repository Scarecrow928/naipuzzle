import type { NailongImage } from './types'

const B = import.meta.env.BASE_URL

const D: Omit<NailongImage, 'imageUrl'> = {
  displayName: '',
  description: '',
  audioUrl: `${B}assets/laugh.m4a`,
}

export const nailongPresets: NailongImage[] = [
  { ...D, displayName: 'nailong', imageUrl: `${B}assets/default.webp` },
  { ...D, imageUrl: `${B}assets/150D0799-39E8-43AD-B3D5-6028C9B8F0F1.webp` },
  { ...D, imageUrl: `${B}assets/DFDFAD4B-502F-46AE-8804-C66001BCAB88.webp` },
  { ...D, imageUrl: `${B}assets/IMG_5459.webp` },
  { ...D, imageUrl: `${B}assets/IMG_5552.webp` },
  { ...D, imageUrl: `${B}assets/IMG_5555.webp` },
  { ...D, imageUrl: `${B}assets/IMG_5564.webp` },
  { ...D, imageUrl: `${B}assets/IMG_5568.webp` },
  { ...D, imageUrl: `${B}assets/IMG_5570.webp` },
  { ...D, imageUrl: `${B}assets/IMG_5576.webp` },
  { ...D, imageUrl: `${B}assets/IMG_5577.webp` },
  { ...D, imageUrl: `${B}assets/IMG_5578.webp` },
  { ...D, imageUrl: `${B}assets/IMG_5579.webp` },
  { ...D, imageUrl: `${B}assets/IMG_5580.webp` },
  { ...D, imageUrl: `${B}assets/IMG_5601.webp` },
  { ...D, imageUrl: `${B}assets/laugh001.webp` },
  { ...D, imageUrl: `${B}assets/laugh002.webp` },
  { ...D, imageUrl: `${B}assets/naijiang001.webp` },
  { ...D, imageUrl: `${B}assets/naijiang002.webp` },
  { ...D, imageUrl: `${B}assets/xiaoshengke.webp` },
]
