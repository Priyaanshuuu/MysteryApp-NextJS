import React from 'react'
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
}
const MessageCard = ({message, onMessageDelete}:MessageCardProps) => {
    const {toast} = useToast()
    const handleDeleteConfirm = async () => {
        axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        toast({
            title: response.data.message,
        })
        
    }
}

function messageCards({message, onMessageDelete}: MessageCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <AlertDialog>
                    <AlertDialogTrigger><Button variant = "destructive">
                        <X className='w-5 h-5' />
                        </Button>
                        </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={handleDeleteConfirm}>Cancel</AlertDialogCancel>
                            <AlertDialogAction >Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <CardDescription>Card Description</CardDescription>
            </CardHeader>

            <CardFooter>
            </CardFooter>
        </Card>

    )
}

export default messageCards
