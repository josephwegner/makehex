import '@babel/polyfill'

var flash = document.getElementsByClassName('flash')
if (flash.length) {
  flash = flash[0]
  document.getElementsByClassName('header')[0].style.position = 'relative'
  document.getElementsByClassName('header')[0].style['z-index'] = '1'
  document.getElementsByClassName('submenu')[0].style.position = 'relative'
  document.getElementsByClassName('submenu')[0].style['z-index'] = '1'

  setTimeout(function() {
    flash.style.transition = 'transform .5s'
    flash.style.transform = 'translateY(-100%)'
  }, 5000)
}
