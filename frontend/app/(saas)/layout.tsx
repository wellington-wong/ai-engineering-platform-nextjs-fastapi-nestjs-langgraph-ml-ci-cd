import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ClerkProvider, OrganizationSwitcher, UserButton } from '@clerk/nextjs'

import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { ReactNode, Suspense } from 'react'



export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <Suspense>
            <AppLayoutContent>
                { children }
            </AppLayoutContent>
        </Suspense>
    )
}

async function AppLayoutContent({
                            children,
                         }: {
    children: React.ReactNode
}) {
    const { userId, orgId } = await auth()
    if (!userId) redirect('/sign-in')
    if (!orgId) redirect('/session-tasks/choose-organization')

    return (
        <SidebarProvider>
            <ClerkProvider afterSignOutUrl="/dashboard">

                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-14 items-center justify-between border-b px-4">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger />
                            <OrganizationSwitcher />
                        </div>
                        <UserButton />
                    </header>
                    <div className="p-6">{children}</div>
                </SidebarInset>
            </ClerkProvider>
        </SidebarProvider>
    )
}