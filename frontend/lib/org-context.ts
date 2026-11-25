import 'server-only'
import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { organizations, users } from '@/db/schema'

export async function requireOrgContext() {
    const { userId, orgId, orgRole } = await auth()
    if (!userId || !orgId || !orgRole) throw new Error('Unauthorized')

    const [user] = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1)
    const [org] = await db




        .select()
        .from(organizations)
        .where(eq(organizations.clerkOrgId, orgId))
        .limit(1)

    // Webhook sync is eventually consistent, so these rows can lag briefly


    if (!user || !org) throw new Error('Account is still syncing, try again shortly')

    return { user, org, role: orgRole }
}