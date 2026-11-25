import { desc, eq } from 'drizzle-orm'
import { db } from '@/db'


import { projects } from '@/db/schema'
import { can } from '@/lib/permissions'
import { requireOrgContext } from '@/lib/org-context'
import { createProject, deleteProject } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react'



export default async function ProjectsPage() {
    return (
        <Suspense>
            <ProjectsContent />
        </Suspense>
    )
}

async function ProjectsContent () {

    const ctx = await requireOrgContext()

    const rows = await db
        .select()
        .from(projects)
        .where(eq(projects.organizationId, ctx.org.id))
        .orderBy(desc(projects.createdAt))

    const canCreate = can(ctx.role, 'project:create')
    const canDelete = can(ctx.role, 'project:delete')

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Projects</h1>

            {canCreate && (
                <form action={createProject} className="flex max-w-md gap-2">
                    <Input name="name" placeholder="New project name" required />
                    <Button type="submit">Create</Button>
                </form>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>{ctx.org.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {rows.length === 0 && (
                        <p className="text-sm text-muted-foreground">No projects yet.</p>
                    )}
                    {rows.map((p) => (
                        <div key={p.id} className="flex items-center justify-between border-b py-2">
                            <span>{p.name}</span>
                            {canDelete && (
                                <form action={deleteProject.bind(null, p.id)}>
                                    <Button variant="outline" size="sm" type="submit">
                                        Delete
                                    </Button>
                                </form>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}