/** True on phones and tablets (iPhone, iPad, Android), or when the URL has ?touch for testing. */
export function isTouchDevice(): boolean {
  return (
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches ||
    new URLSearchParams(window.location.search).has('touch')
  )
}
