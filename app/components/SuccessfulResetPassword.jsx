import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ResetSuccess() {
  return (
    <div className="flex justify-center items-center h-screen bg-background">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Password Reset Successful</CardTitle>
          <CardDescription>
            Your password has been successfully reset. You can now log in with your new password.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            If you encounter any issues, please contact support.
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/login" passHref>
            <Button className="w-full">Go to Login</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
