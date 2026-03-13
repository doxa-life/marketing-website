/**
 * Processes all elements with the `.highlight` class and wraps specific words
 * in colored spans based on data attributes.
 *
 * Data attributes:
 * - data-highlight-index: 1-based index of word to highlight
 * - data-highlight-last: if present, highlight the last word
 * - data-highlight-color: color class to apply (default: 'primary')
 *
 * Ported from WordPress theme.js highlight logic.
 */
export function useHighlightText(container?: HTMLElement) {
  const root = container || document

  const highlights = root.querySelectorAll('.highlight')
  highlights.forEach((item) => {
    const el = item as HTMLElement
    const text = el.textContent || ''
    const words = text.split(' ').filter(Boolean)

    if (words.length === 0) return

    const highlightIndex = el.dataset.highlightIndex
      ? parseInt(el.dataset.highlightIndex) - 1
      : -1
    const highlightLast = el.dataset.highlightLast !== undefined
    const highlightColor = el.dataset.highlightColor || 'primary'

    const newInnerHTML = words.map((word, index) => {
      if (highlightIndex > -1 && index === highlightIndex) {
        return `<span class="color-${highlightColor}">${word}</span>`
      }
      if (highlightLast && index === words.length - 1) {
        return `<span class="color-${highlightColor}">${word}</span>`
      }
      return word
    })

    el.innerHTML = newInnerHTML.join(' ')
  })
}
