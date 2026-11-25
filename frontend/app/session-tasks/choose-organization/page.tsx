import { ClerkProvider, TaskChooseOrganization } from '@clerk/nextjs'



export default function Page() {
    return (
        <ClerkProvider>
            <TaskChooseOrganization redirectUrlComplete="/dashboard" />
        </ClerkProvider>
    )
}