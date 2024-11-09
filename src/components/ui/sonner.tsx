import { useTheme } from '@/contexts/ThemeProvider'
import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const theme = useTheme()

  return (
    <Sonner
      theme={theme.theme}
      className="toaster group"
      position="top-center"
      richColors
      toastOptions={{}}
      {...props}
    />
  )
}

export { Toaster }
