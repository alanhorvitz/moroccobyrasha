import { toast as sonnerToast } from 'sonner'

export const useToast = () => {
  const toast = ({ title, description }: { title: string; description?: string }) => {
    if (description) {
      sonnerToast(title, { description })
    } else {
      sonnerToast(title)
    }
  }

  return { toast }
}