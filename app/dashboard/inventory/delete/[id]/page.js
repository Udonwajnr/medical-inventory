
import { Button } from "@/components/ui/button"
import Link from "next/link"
export default function Component() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <TrashIcon className="mx-auto h-12 w-12 text-destructive" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Delete Item</h1>
        <p className="mt-4 text-muted-foreground">
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button variant="destructive">Confirm Delete</Button>
          <Link href="/dashboard/inventory">
            <Button variant="outline">
                Cancel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}