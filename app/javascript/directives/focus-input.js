export default function (Vue) {
  Vue.directive('focus', {
      inserted: function (el) {
          el.focus()
      }
  })
}
