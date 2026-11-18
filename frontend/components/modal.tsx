import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const sizes = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-lg",
    lg: "sm:max-w-3xl",
    xl: "sm:max-w-5xl",
    full: "sm:max-w-[95vw]",
} as const

interface ModalContentProps {
    title: string
    description?: string
    hideHeader?: boolean
    size?: keyof typeof sizes
    className?: string
    children: React.ReactNode
}

// The styled body: use inside any <Dialog>
export function ModalContent({
                                 title,
                                 description,
                                 hideHeader,
                                 size = "md",
                                 className,
                                 children,
                             }: ModalContentProps) {
    return (
        <DialogContent
            className={cn("max-h-[90dvh] w-[calc(100%-1.5rem)] overflow-y-auto", sizes[size], className)}
        >
            <DialogHeader className={cn(hideHeader && "sr-only")}>
                <DialogTitle>{title}</DialogTitle>
                {description ? <DialogDescription>{description}</DialogDescription> : null}
            </DialogHeader>
            {children}
        </DialogContent>
    )
}

// Click-to-open: no state needed
export function ModalTrigger({
                                 trigger,
                                 children,
                                 ...contentProps
                             }: ModalContentProps & { trigger: React.ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger asChild className={"cursor-pointer"}>{trigger}</DialogTrigger>
            <ModalContent {...contentProps}>{children}</ModalContent>
        </Dialog>
    )
}

// Controlled: for menus, table rows, or opening from code
export function Modal({
                          open,
                          onOpenChange,
                          children,
                          ...contentProps
                      }: ModalContentProps & { open: boolean; onOpenChange: (open: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <ModalContent {...contentProps}>{children}</ModalContent>
        </Dialog>
    )
}