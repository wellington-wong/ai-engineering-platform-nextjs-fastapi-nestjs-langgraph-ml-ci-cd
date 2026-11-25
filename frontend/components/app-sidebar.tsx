import Link from 'next/link'
import {
    Sidebar,

    SidebarContent,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/components/ui/sidebar'
import Image from "next/image";

const items = [

    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Projects', href: '/projects' },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <Link href="/" className="flex items-center px-2 mb-5 mt-2">


                        <Image src="/images/w.codes-logo.png" width="98" height="23" alt="Wellington Codes" />
                    </Link>
                    <SidebarMenu className="ml-2">
                        {items.map((item) => (
                            <SidebarMenuItem key={item.href}>

                                <SidebarMenuButton render={<Link href={item.href}>{item.title}</Link>}>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}