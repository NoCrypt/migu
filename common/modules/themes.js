import { append, element } from 'svelte/internal'
import { writable } from 'simple-store-svelte'
import { settings } from './settings'
import { get } from 'svelte/store'

const style = element('style')
style.id = 'customThemes'
append(document.head, style)

export const variables = writable(localStorage.getItem('theme') || '')

const AMOLED = `--sidebar-gradient: linear-gradient(90deg, #000000 15.62%, #000000eb 36.46%, #0000009e 70.83%, rgba(0, 0, 0, 0) 100%);
--banner-gradient-bottom: linear-gradient(0deg, #000000 0%, #0000 15%, #0000 100%);
--banner-gradient-left: linear-gradient(90deg, #000000 0%, rgba(23, 25, 29, 0.5) 75%, rgba(25, 28, 32, 0) 100%);
--torrent-card-gradient: linear-gradient(90deg, #000000 32%, rgba(23, 25, 28, 0.90) 100%);
--episode-card-gradient: linear-gradient(180deg, rgba(0, 0, 0, 0) 77.08%, rgba(0, 0, 0, 0.7) 100%);
--episode-preview-card-gradient: linear-gradient(180deg, #0000 0%, #2a2a2a00 80%, #2a2a2a 95%, #2a2a2a 100%);
--preview-card-gradient: linear-gradient(180deg, #0000 0%, #2a2a2a00 80%, #2a2a2ae3 95%, #2a2a2a 100%);
--section-end-gradient: linear-gradient(270deg, #181818ff 0%, #18181800 100%);
--dark-color-hsl: var(--dark-color-base-hue), var(--dark-color-base-saturation), 0% !important;
--dark-color-light: #1a1a1a !important;
`

const NORMAL = `--sidebar-gradient: linear-gradient(90deg, #17191D 15.62%, rgba(23, 25, 29, 0.92) 36.46%, rgba(23, 25, 29, 0.619632) 70.83%, rgba(23, 25, 29, 0) 100%);
--banner-gradient-bottom: linear-gradient(0deg, #17191D 0%, #0000 15%, #0000 100%);
--banner-gradient-left: linear-gradient(90deg, #17191D 0%, rgba(23, 25, 29, 0.5) 75%, rgba(25, 28, 32, 0) 100%);
--torrent-card-gradient: linear-gradient(90deg, #17191C 32%, rgba(23, 25, 28, 0.90) 100%);
--episode-card-gradient: linear-gradient(180deg, rgba(0, 0, 0, 0) 77.08%, rgba(0, 0, 0, 0.7) 100%);
--episode-preview-card-gradient: linear-gradient(180deg, #0000 0%, #25292f00 80%, #25292f 95%, #25292f 100%);
--preview-card-gradient: linear-gradient(180deg, #0000 0%, #25292f00 80%, #25292fe3 95%, #25292f 100%);
--section-end-gradient: linear-gradient(270deg, #17191cff 0%, #17191c00 100%);
--dark-color-hsl: var(--dark-color-base-hue), var(--dark-color-base-saturation), 10% !important;
--dark-color-light: #25292F !important;
`

variables.subscribe(value => {
  localStorage.setItem('theme', value)
  updateTheme(value)
})

export function updateTheme(value) {
  if (get(settings).amoledTheme) {
    value += AMOLED
  } else {
    value += NORMAL
  }
  style.textContent = `:root{${value.replace(/{|}/g, '')}}`
}
