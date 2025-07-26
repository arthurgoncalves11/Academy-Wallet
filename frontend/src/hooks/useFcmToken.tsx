'use client'

import { useEffect, useRef, useState, useCallback} from 'react'
import { onMessage, Unsubscribe } from 'firebase/messaging'
import { fetchToken, messaging } from '@/firebase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'

async function getNotificationPermissionAndToken() {
  if (!('Notification' in window)) {
    console.info('This browser does not support desktop notification')
    return null
  }

  if (Notification.permission === 'granted') {
    return await fetchToken()
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      return await fetchToken()
    }
  }
  
  return null
}

const useFcmToken = () => {
  const router = useRouter()
  const [notificationPermissionStatus, setNotificationPermissionStatus] = useState<NotificationPermission | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const retryLoadToken = useRef(0)
  const isLoading = useRef(false)
  const { token: authToken } = useAuth()
  const sendTokenToBackend = useCallback(async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/register_device`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ token }),
      })

      if (!response.ok) throw new Error('Falha ao registrar dispositivo')

     
    } catch (error) {
      console.error('Erro ao registrar token:', error)
    }
  }, [authToken])

  const loadToken = useCallback(async () => {
    if (isLoading.current) return

    isLoading.current = true
    const token = await getNotificationPermissionAndToken()

    if (Notification.permission === 'denied') {
      setNotificationPermissionStatus('denied')
      console.info(
        '%cPush Notifications issue - permission denied',
        'color: green; background: #c7c7c7; padding: 8px; font-size: 20px'
      )
      isLoading.current = false
      return
    }

    if (!token) {
      if (retryLoadToken.current >= 3) {
        alert(
          'Não conseguimos pegar sua permissão para envio de notificações, caso queira receber notificações, por favor dê permissão e recarregue a página.'
        )
        console.info(
          '%cPush Notifications issue - unable to load token after 3 retries',
          'color: green; background: #c7c7c7; padding: 8px; font-size: 20px'
        )
        isLoading.current = false
        return
      }

      retryLoadToken.current += 1
      console.error('An error occurred while retrieving token. Retrying...')
      isLoading.current = false
      await loadToken()
      return
    }

    setNotificationPermissionStatus(Notification.permission)
    setToken(token)
    isLoading.current = false
  }, [])

  useEffect(() => {
    const initialize = async () => {
      if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

      try {
        const token = await getNotificationPermissionAndToken()
        if (token && authToken) {
          setToken(token)
        
          await sendTokenToBackend(token)
        }
      } catch (error) {
        console.error('Initialization error:', error)
      }
    }

    initialize()
  }, [authToken, sendTokenToBackend])

  useEffect(() => {
    if ('Notification' in window) {
      loadToken()
    }
  }, [loadToken])

  useEffect(() => {
    let isMounted = true
    let unsubscribe: Unsubscribe | null = null

    const setupListener = async () => {
      if (!token) return

      const m = await messaging()
      if (!m || !isMounted) return

      unsubscribe = onMessage(m, (payload) => {
        if (Notification.permission !== 'granted') return

        console.log('Foreground push notification received:', payload)
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
    }

    setupListener()

    return () => {
      isMounted = false
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [token, router])

  return { token, notificationPermissionStatus }
}

export default useFcmToken