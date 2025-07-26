importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js')

const firebaseConfig = {
  apiKey: 'AIzaSyBTmVl9nZdFaPhrsEyVYpDOLw0O3yGNY30',
  authDomain: 'academy-wallet.firebaseapp.com',
  projectId: 'academy-wallet',
  storageBucket: 'academy-wallet.firebasestorage.app',
  messagingSenderId: '514336371372',
  appId: '1:514336371372:web:d5cdba022b964eba98e509',
  measurementId: 'G-C6WB3589J7',
}

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

messaging.onMessage((payload) => {
  if (Notification.permission !== 'granted') return

  const link = payload.fcmOptions?.link || payload.data?.link

  if (link) {
    toast.info(`${payload.notification?.title}: ${payload.notification?.body}`, {
      action: {
        label: 'Visit',
        onClick: () => router.push(link),
      },
    })
  } else {
    toast.info(`${payload.notification?.title}: ${payload.notification?.body}`)
  }
})

self.addEventListener('notificationclick', function (event) {

  event.notification.close()

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      const url = event.notification.data.url

      if (!url) return

      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }

      if (clients.openWindow) {

        return clients.openWindow(url)
      }
    })
  )
})
