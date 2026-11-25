import { auth, currentUser } from '@clerk/nextjs/server'
import { ClerkProvider } from '@clerk/nextjs'
import { redirect } from 'next/navigation'


import { db } from "@/db";
import { users } from "@/db/schema";
export default async function DashboardPage() {
    const { userId, orgId, orgRole } = await auth()
    if (!userId) redirect('/sign-in')
    if (!orgId) redirect('/session-tasks/choose-organization')



    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
        </div>
    )
}