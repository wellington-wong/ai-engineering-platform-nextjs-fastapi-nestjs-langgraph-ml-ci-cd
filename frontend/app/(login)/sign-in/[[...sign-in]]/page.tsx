import { ClerkProvider, SignIn } from '@clerk/nextjs'

export default function Page() {

    return (
        <main className="flex min-h-screen items-center justify-center">
            <ClerkProvider>
                <SignIn />
            </ClerkProvider>
        </main>
    )
}