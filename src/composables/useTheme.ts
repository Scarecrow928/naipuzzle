import { ref, type Ref } from 'vue'
import type { ThemeAPI } from '../types'

const presets: Record<string, Record<string, string>> = {
  nailong: {
    '--color-primary': '#c68d2f',
    '--color-primary-rgb': '198, 141, 47',

    '--color-secondary': '#775a20',
    '--color-secondary-rgb': '119, 90, 32',

    '--color-bg': '#ebce79',
    '--color-bg-rgb': '235, 206, 121',

    '--color-surface': 'rgba(255, 255, 255, 0.7)',
    '--color-surface-hover': 'rgba(255, 255, 255, 0.9)',

    '--color-text': '#0a0e00',
    '--color-text-dim': 'rgba(10, 14, 0, 0.8)',

    '--color-success': '#2ecc71',
    '--color-error': '#e74c3c',

    '--panel-opacity': '0.85',
    '--panel-blur': '10px',
    '--bg-image': 'none',
  },
  dark: {
    '--color-primary': '#6366f1',
    '--color-primary-rgb': '99, 102, 241',
    '--color-secondary': '#a78bfa',
    '--color-secondary-rgb': '167, 139, 250',
    '--color-bg': '#0f0f14',
    '--color-bg-rgb': '15, 15, 20',
    '--color-surface': 'rgba(255,255,255,0.08)',
    '--color-surface-hover': 'rgba(255,255,255,0.12)',
    '--color-text': '#f1f1f3',
    '--color-text-dim': 'rgba(255,255,255,0.6)',
    '--color-success': '#34d399',
    '--color-error': '#f87171',
    '--panel-opacity': '0.15',
    '--panel-blur': '20px',
    '--bg-image': 'none',
  },
  light: {
    '--color-primary': '#4f46e5',
    '--color-primary-rgb': '79, 70, 229',
    '--color-secondary': '#7c3aed',
    '--color-secondary-rgb': '124, 58, 237',
    '--color-bg': '#f5f5f7',
    '--color-bg-rgb': '245, 245, 247',
    '--color-surface': 'rgba(255,255,255,0.6)',
    '--color-surface-hover': 'rgba(255,255,255,0.8)',
    '--color-text': '#18181b',
    '--color-text-dim': 'rgba(0,0,0,0.5)',
    '--color-success': '#16a34a',
    '--color-error': '#dc2626',
    '--panel-opacity': '0.4',
    '--panel-blur': '16px',
    '--bg-image': 'none',
  },
  forest: {
    '--color-primary': '#22c55e',
    '--color-primary-rgb': '34, 197, 94',
    '--color-secondary': '#84cc16',
    '--color-secondary-rgb': '132, 204, 22',
    '--color-bg': '#0a1a0f',
    '--color-bg-rgb': '10, 26, 15',
    '--color-surface': 'rgba(255,255,255,0.06)',
    '--color-surface-hover': 'rgba(255,255,255,0.1)',
    '--color-text': '#ecfdf5',
    '--color-text-dim': 'rgba(236,253,245,0.5)',
    '--color-success': '#86efac',
    '--color-error': '#fca5a5',
    '--panel-opacity': '0.12',
    '--panel-blur': '24px',
    '--bg-image': 'none',
  },
  ocean: {
    '--color-primary': '#06b6d4',
    '--color-primary-rgb': '6, 182, 212',
    '--color-secondary': '#3b82f6',
    '--color-secondary-rgb': '59, 130, 246',
    '--color-bg': '#0c1929',
    '--color-bg-rgb': '12, 25, 41',
    '--color-surface': 'rgba(255,255,255,0.06)',
    '--color-surface-hover': 'rgba(255,255,255,0.1)',
    '--color-text': '#e0f2fe',
    '--color-text-dim': 'rgba(224,242,254,0.5)',
    '--color-success': '#67e8f9',
    '--color-error': '#fca5a5',
    '--panel-opacity': '0.12',
    '--panel-blur': '22px',
    '--bg-image': 'none',
  },
}

export function useTheme(): ThemeAPI {
  const currentPreset = ref('dark')
  const customBgImage = ref('')

  function applyPreset(name: string) {
    if (!presets[name]) return
    currentPreset.value = name
    const vars = { ...presets[name] }
    if (customBgImage.value) {
      vars['--bg-image'] = `url(${customBgImage.value})`
    }
    applyVars(vars)
  }

  function setCustomVar(prop: string, value: string) {
    document.documentElement.style.setProperty(prop, value)
  }

  function setBgImage(url: string) {
    customBgImage.value = url
    setCustomVar('--bg-image', url ? `url(${url})` : 'none')
  }

  function applyVars(vars: Record<string, string>) {
    Object.entries(vars).forEach(([prop, value]) => {
      document.documentElement.style.setProperty(prop, value)
    })
  }

  function init() {
    applyPreset('dark')
  }

  return {
    currentPreset,
    customBgImage,
    presets,
    applyPreset,
    setCustomVar,
    setBgImage,
    init,
  }
}
