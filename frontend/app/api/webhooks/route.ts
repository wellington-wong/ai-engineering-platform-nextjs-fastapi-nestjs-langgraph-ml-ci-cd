import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { and, eq } from 'drizzle-orm'




import { NextRequest } from 'next/server'
import { db } from '@/db'
import { memberships, organizations, users } from '@/db/schema'
export async function POST(req: NextRequest) {
    let evt
    try {
        evt = await verifyWebhook(req)

    } catch (err) {
        console.error('Error verifying webhook:', err)
        return new Response('Error verifying webhook', {status: 400})
    }

    switch (evt.type) {
        case 'user.created':
        case 'user.updated': {
            const {id, email_addresses, primary_email_address_id} = evt.data

            const email =
                email_addresses.find((e) => e.id === primary_email_address_id)
                    ?.email_address ?? email_addresses[0]?.email_address

            if (!email) break

            await db
                .insert(users)
                .values({clerkId: id, email})
                .onConflictDoUpdate({
                    target: users.clerkId,
                    set: {email},
                })
            break
        }

        case 'user.deleted': {
            if (evt.data.id) {
                await db.delete(users).where(eq(users.clerkId, evt.data.id))
            }
            break
        }
        case 'organization.created':
        case 'organization.updated': {


            const {id, name, slug} = evt.data
            await db
                .insert(organizations)
                .values({clerkOrgId: id, name, slug})
                .onConflictDoUpdate({
                    target: organizations.clerkOrgId,
                    set: {name, slug},
                })
            break
        }

        case 'organization.deleted': {
            if (evt.data.id) {
                await db.delete(organizations).where(eq(organizations.clerkOrgId, evt.data.id))
            }
            break
        }

        case 'organizationMembership.created':
        case 'organizationMembership.updated': {
            const {organization, public_user_data, role} = evt.data

            // Upsert the org from the membership payload, in case this event
            // arrives before organization.created
            const [org] = await db
                .insert(organizations)
                .values({
                    clerkOrgId: organization.id,
                    name: organization.name,
                    slug: organization.slug,
                })
                .onConflictDoUpdate({
                    target: organizations.clerkOrgId,
                    set: {name: organization.name, slug: organization.slug},
                })
                .returning()

            const [user] = await db
                .select()
                .from(users)
                .where(eq(users.clerkId, public_user_data.user_id))
                .limit(1)

            // User row not there yet: fail so Clerk retries the delivery
            if (!user) return new Response('User not synced yet', {status: 500})

            await db
                .insert(memberships)
                .values({organizationId: org.id, userId: user.id, role})
                .onConflictDoUpdate({
                    target: [memberships.organizationId, memberships.userId],
                    set: {role},
                })
            break
        }

        case 'organizationMembership.deleted': {
            const {organization, public_user_data} = evt.data

            const [org] = await db
                .select()
                .from(organizations)
                .where(eq(organizations.clerkOrgId, organization.id))
                .limit(1)
            const [user] = await db
                .select()
                .from(users)
                .where(eq(users.clerkId, public_user_data.user_id))
                .limit(1)

            if (org && user) {
                await db
                    .delete(memberships)
                    .where(
                        and(eq(memberships.organizationId, org.id), eq(memberships.userId, user.id)),
                    )
            }
            break
        }


    }
    return new Response('OK', { status: 200 })



}