import { Container } from "postcss"
import ContainerLayout from "../components/ContainerLayout"
import { AuthProvider } from "../auth/auth-context"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "../components/theme-provider"
export default function DashboardLayout({
    children, // will be a page or nested layout
}) {
    return (
            <AuthProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                    <ContainerLayout>
                        {children}
                        <Toaster  richColors/>
                    </ContainerLayout>
                </ThemeProvider>
            </AuthProvider>
    )
  }