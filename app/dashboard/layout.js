import { Container } from "postcss"
import ContainerLayout from "../components/ContainerLayout"
import { AuthProvider } from "../auth/auth-context"
import { Toaster } from "@/components/ui/sonner"

export default function DashboardLayout({
    children, // will be a page or nested layout
}) {
    return (
            <AuthProvider>
                <ContainerLayout>
                    {children}
                    <Toaster  richColors/>
                </ContainerLayout>
            </AuthProvider>
    )
  }