import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ResetEmailSent() {
  return (
    <div className="flex justify-center items-center h-screen bg-background">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Reset Email Sent</CardTitle>
          <CardDescription>
            We have sent a password reset email to your address. Please check your email and follow the instructions to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            If you do not see the email in your inbox, please check your spam or junk folder.
          </p>
        </CardContent>
        <CardFooter className="">
            <Link href="https://mail.google.com" target="_blank" rel="noopener noreferrer">
            <Button className="w-full">Open Email</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
