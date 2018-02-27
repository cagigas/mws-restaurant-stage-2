registerServiceWorker = () => {
  if (!navigator.serviceWorker) return

  navigator.serviceWorker.register('/sw.js').then(function (/*reg*/) {
    if (!navigator.serviceWorker.controller) {
      return
    }
    console.log('Registration Worked!')

  }).catch(function () {
    console.error('Registration failed!')
  })
}

registerServiceWorker()
