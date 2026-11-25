'use server'

import { and, eq } from 'drizzle-orm'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '@/db'
import { projects } from '@/db/schema'
import { can } from '@/lib/permissions'
import { requireOrgContext } from '@/lib/org-context'

const CreateProject = z.object({
    name: z.string().trim().min(1, 'Name is required').max(100),

})
export async function createProject(formData: FormData) {
    const ctx = await requireOrgContext()
    if (!can(ctx.role, 'project:create')) throw new Error('Forbidden')

    const parsed = CreateProject.safeParse({ name: formData.get('name') })
    if (!parsed.success) throw new Error(parsed.error.issues[0].message)

    await db.insert(projects).values({

        organizationId: ctx.org.id,
        name: parsed.data.name,
        createdBy: ctx.user.id,
    })

    revalidatePath('/projects')
}

export async function deleteProject(projectId: string) {

    const ctx = await requireOrgContext()
    if (!can(ctx.role, 'project:delete')) throw new Error('Forbidden')

    // The org filter matters: knowing another org's project ID must not be enough
    await db
        .delete(projects)
        .where(and(eq(projects.id, projectId), eq(projects.organizationId, ctx.org.id)))

    revalidatePath('/projects')


}