const permissions = {
    'org:admin': ['project:read', 'project:create', 'project:delete'],
    'org:member': ['project:read', 'project:create'],

} as const
export type Permission = 'project:read' | 'project:create' | 'project:delete'

export function can(role: string | null | undefined, permission: Permission) {
    if (!role) return false
    const allowed = permissions[role as keyof typeof permissions] as
        | readonly Permission[]
        | undefined
    return allowed?.includes(permission) ?? false


}