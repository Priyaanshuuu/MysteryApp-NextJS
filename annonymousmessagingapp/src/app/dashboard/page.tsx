'use client'

import { Message } from '@/model/User.model'
import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/components/ui/toast'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AcceptMessageSchema } from '../schemas/acceptMessageSchema'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { AxiosError } from 'axios'
import { User } from 'next-auth'

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchingLoading] = useState(false)
  const { toast } = useToast()
  const { data: session } = useSession()

  // Form setup
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema)
  })

  const { register, watch, setValue } = form
  const acceptMessages = watch('acceptMessages')

  // Fetch Accept Message Settings
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchingLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-message')
      setValue('acceptMessages', response.data.isAcceptingMessage)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Failed to fetch message settings',
        variant: 'destructive'
      })
    } finally {
      setIsSwitchingLoading(false)
    }
  }, [setValue, toast])

  // Handle Message Deletion
  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) => prevMessages.filter(message => message.id !== messageId))
  }

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchingLoading(false)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
      if(refresh){
        toast({
          title: 'Refreshed messages',
          description: 'Showing refreshed messages',
        })
      }
      
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Failed to fetch message settings',
        variant: 'destructive'})
    }
    finally {
      setIsSwitchingLoading(false)
      setIsLoading(false)
    }

  },[setIsLoading, setMessages])

  useEffect(() => {
    if(!session || !session.user){
      fetchMessages()
    }

  }
  ,[session, setValue, fetchAcceptMessage, fetchMessages])

  const handleSwitchChange = async () => {
  try {
    const response = await axios.post<ApiResponse>('/api/accept-messages', {
      acceptMessages: !acceptMessages
    })
    setValue('acceptMessages', !acceptMessages)
    toast({
      title: response.data.message,
      variant: "destructive"
    })
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>
    toast({
      title: 'Error',
      description: axiosError.response?.data.message || 'Failed to update message settings',
      variant: 'destructive'
    })
    
  }
  }

  const {username} = session?.user as User
  const baseUrl = `${window.location.protocol}//${window.location.host}`

  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard =  () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title: 'Copied to clipboard',
      description: 'Your profile URL has been copied to clipboard'
  })

  if(!session || !session.user){
    return <div>Please Login</div>
  }


  return (
    <div>
      The dashboard page
    </div>
  )
}

export default Page
