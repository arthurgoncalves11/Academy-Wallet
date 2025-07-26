'use client'

import dynamic from 'next/dynamic'
import useFcmToken from '@/hooks/useFcmToken'

const FcmTokenHandler = () => {
  useFcmToken()
  return null
}

export default dynamic(() => Promise.resolve(FcmTokenHandler), { ssr: false })
