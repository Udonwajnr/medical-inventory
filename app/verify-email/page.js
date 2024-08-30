import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerifyEmail() {
  return (
    <div className="flex justify-center items-center h-screen bg-background">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>
            A verification link has been sent to your email address. Please check your inbox to complete the verification process.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-gray-600">
            If you don’t see the email, please check your spam or junk folder.
          </p>
          <Link href="https://mail.google.com" target="_blank" rel="noopener noreferrer">
            <Button className="w-full">Open Email</Button>
          </Link>
        </CardContent>
        <CardFooter>
          <div className="text-center">
            <p className="text-sm text-gray-600">Didn’t receive the email?</p>
            <Link href="/resend-verification" className="text-blue-500 underline">
              Resend Verification Email
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
