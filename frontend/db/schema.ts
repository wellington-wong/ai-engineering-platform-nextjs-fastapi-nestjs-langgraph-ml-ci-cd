import { pgTable, text, timestamp, uuid, unique } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {


    id: uuid('id').defaultRandom().primaryKey(),
    clerkId: text('clerk_id').notNull().unique(),
    email: text('email').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const organizations = pgTable('organizations', {
    id: uuid('id').defaultRandom().primaryKey(),

    clerkOrgId: text('clerk_org_id').notNull().unique(),
    name: text('name').notNull(),
    slug: text('slug'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const memberships = pgTable(
    'memberships',
    {

        id: uuid('id').defaultRandom().primaryKey(),
        organizationId: uuid('organization_id')
            .notNull()
            .references(() => organizations.id, { onDelete: 'cascade' }),
        userId: uuid('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        role: text('role').notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),

    },
    (t) => [unique().on(t.organizationId, t.userId)],
)

export const projects = pgTable('projects', {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
        .notNull()
        .references(() => organizations.id, { onDelete: 'cascade' }),


    name: text('name').notNull(),
    createdBy: uuid('created_by')
        .notNull()
        .references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})