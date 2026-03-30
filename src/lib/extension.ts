export interface ExtensionPreferences {
  showAppOnNewTab: boolean
}

const STORAGE_KEY = 'easy-todos.extension-preferences'

export function getDefaultExtensionPreferences(): ExtensionPreferences {
  return {
    showAppOnNewTab: false,
  }
}

function getChromeStorage() {
  return chrome?.storage?.sync
}

export async function loadExtensionPreferences(): Promise<ExtensionPreferences> {
  const fallback = getDefaultExtensionPreferences()
  const storage = getChromeStorage()

  if (storage) {
    const result = await storage.get(STORAGE_KEY)
    return {
      ...fallback,
      ...(result[STORAGE_KEY] as Partial<ExtensionPreferences> | undefined),
    }
  }

  if (typeof localStorage === 'undefined') {
    return fallback
  }

  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return fallback
  }

  try {
    return {
      ...fallback,
      ...(JSON.parse(raw) as Partial<ExtensionPreferences>),
    }
  }
  catch {
    return fallback
  }
}

export async function saveExtensionPreferences(preferences: ExtensionPreferences) {
  const storage = getChromeStorage()

  if (storage) {
    await storage.set({ [STORAGE_KEY]: preferences })
    return
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  }
}

export function getAppTabUrl() {
  if (chrome?.runtime?.getURL) {
    return chrome.runtime.getURL('newtab.html')
  }

  return '/newtab.html'
}

export async function openAppInTab() {
  const url = getAppTabUrl()

  if (chrome?.tabs?.create) {
    await chrome.tabs.create({ url })
    return
  }

  window.open(url, '_blank', 'noopener,noreferrer')
}
