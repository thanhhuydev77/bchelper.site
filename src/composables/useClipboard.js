import { useClipboard } from '@vueuse/core'

export function useClipboardCopy() {
  const { copy, copied, isSupported } = useClipboard()

  const copyToClipboard = async (text) => {
    if (!isSupported.value) {
      // Fallback for browsers that don't support clipboard API
      try {
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        
        if (successful) {
          return { success: true, message: 'Copied to clipboard!' }
        } else {
          return { success: false, message: 'Failed to copy to clipboard' }
        }
      } catch (error) {
        return { success: false, message: 'Failed to copy to clipboard' }
      }
    }

    try {
      await copy(text)
      return { success: true, message: 'Copied to clipboard!' }
    } catch (error) {
      return { success: false, message: 'Failed to copy to clipboard' }
    }
  }

  return {
    copyToClipboard,
    copied,
    isSupported
  }
} 