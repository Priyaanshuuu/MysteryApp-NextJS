'use client'
import { Message } from '@/model/User.model'
import  { useState } from 'react'
import {useToast} from '@/components/ui/toast'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AcceptMessageSchema } from '../schemas/acceptMessageSchema'

const page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchingLoading] = useState(false)
  const toast = useToast()

  const handleDeleteMessage = (messageId: string)=>{
    setMessages(messages.filter(message=>message.id !== messageId))

    const {data: session} = useSession()

    const form = useForm({
      resolver: zodResolver(AcceptMessageSchema)
    })

  }
  return (
    <div>
      The dashboard page
    </div>
  )
}

export default page
