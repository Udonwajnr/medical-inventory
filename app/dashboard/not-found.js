// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-700">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
        <p className="mt-4 text-gray-500">Sorry, the page you are looking for does not exist.</p>
        <Link href="/" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg">
          Go Back Home
        </Link>
      </div>
    </div>
  )
}
