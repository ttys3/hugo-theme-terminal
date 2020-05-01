const mobileQuery = getComputedStyle(document.body).getPropertyValue('--phoneWidth')
const isMobile = () => window.matchMedia(mobileQuery).matches

if(!isMobile()) {
  const languageSelector = document.querySelector('.language-selector-current')
  const moreLanguagesContainer = document.querySelector('.language-selector__more')

  document.body.addEventListener('click', () => {
    if (moreLanguagesContainer && !moreLanguagesContainer.classList.contains('hidden')) {
      moreLanguagesContainer.classList.add('hidden')
    }
  })

  languageSelector && languageSelector.addEventListener('click', e => {
    e.stopPropagation()
    moreLanguagesContainer.classList.toggle('hidden')
  })
}
