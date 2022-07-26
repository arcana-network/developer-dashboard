async function fallbackCopyToClipboard(value: string) {
  try {
    const textArea = document.createElement('textarea')
    textArea.value = value
    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.position = 'fixed'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    const successful = document.execCommand('copy')
    textArea.remove()
    if (successful) {
      return { success: true }
    } else {
      return { success: false, errMsg: 'Failed to copy. Try again' }
    }
  } catch (e) {
    return {
      success: false,
      errMsg: 'Copying to clipboard is not supported in your browser',
    }
  }
}

export default async function copyToClipboard(value: string) {
  if (value) {
    if (!navigator.clipboard) {
      return await fallbackCopyToClipboard(value)
    } else {
      try {
        await navigator.clipboard.writeText(value)
        return { success: true }
      } catch (e) {
        return { success: false, errMsg: 'Failed to copy. Try again' }
      }
    }
  }
  return { success: false, errMsg: 'Cannot copy empty value' }
}
