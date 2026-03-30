export function getAppTabUrl() {
  if (chrome?.runtime?.getURL) {
    return chrome.runtime.getURL('app.html')
  }

  return '/app.html'
}

export async function openAppInTab() {
  const url = getAppTabUrl()

  if (chrome?.tabs?.create) {
    await chrome.tabs.create({ url })
    return
  }

  window.open(url, '_blank', 'noopener,noreferrer')
}
