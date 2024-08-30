import ContainerLayout from "@/app/components/ContainerLayout"

export default function UserDetails() {
    return (
      <ContainerLayout>
        <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 md:py-12">
          <div className="grid gap-6 md:gap-8">
            <div>
              <h1 className="text-2xl font-bold">John Doe</h1>
              <p className="text-muted-foreground">Username: johndoe123</p>
            </div>
            <div className="grid gap-4">
              <div>
                <h2 className="text-lg font-semibold">Contact Information</h2>
                <p>Email: john.doe@example.com</p>
                <p>Phone: +1234567890</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Address</h2>
                <p>123 Main St, Springfield</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Account Status</h2>
                <p>Active</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Role</h2>
                <p>Admin</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Preferences</h2>
                <ul className="grid gap-2">
                  <li>Receive newsletters: Yes</li>
                  <li>Enable two-factor authentication: No</li>
                  <li>Dark mode: Enabled</li>
                </ul>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Joined Date</h2>
                <p>January 15, 2023</p>
              </div>
            </div>
          </div>
        </div>
      </ContainerLayout>
    )
}
