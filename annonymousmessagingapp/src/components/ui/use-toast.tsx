import {
    useToast as useRadixToast,
    type ToastProps,
  } from "./toast"
  
  export function useToast() {
    const { toast } = useRadixToast()
    return {
      toast,
    }
  }
  
  export type { ToastProps }
  