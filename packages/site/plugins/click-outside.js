// ////////////////////////////////// Click anywhere outside a modal to close it
// ---------------------------------------- https://stackoverflow.com/a/42389266
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('click-outside', {
    beforeMount (el, binding) {
      el.clickOutsideEvent = function (e) {
        if (!(el === e.target || el.contains(e.target))) {
          binding.value(e)
        }
      }
      el.pressEscKey = function (e) {
        if (event.defaultPrevented) { return }
        const key = event.key || event.keyCode
        if (key === 'Escape' || key === 'Esc' || key === 27) {
          binding.value(e)
        }
      }
      document.body.addEventListener('click', el.clickOutsideEvent)
      document.addEventListener('keyup', el.pressEscKey)
    },
    unmounted (el) {
      document.body.removeEventListener('click', el.clickOutsideEvent)
      document.removeEventListener('keyup', el.pressEscKey)
    }
  })
})
