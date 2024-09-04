import { Container } from "postcss"
import ContainerLayout from "../components/ContainerLayout"
import { AuthProvider } from "../auth/auth-context"

export default function DashboardLayout({
    children, // will be a page or nested layout
}) {
    return (
            <AuthProvider>
                <ContainerLayout>
                    {children}
                </ContainerLayout>
            </AuthProvider>

    )
  }