"use client"

import * as React from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface ModalProps {
    title: string
    description?: string
    trigger?: React.ReactNode
    footer?: React.ReactNode
    children?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
    className?: string
}

export function Modal({
                          title,
                          description,
                          trigger,
                          footer,
                          children,
                          open,
                          onOpenChange,
                          className,
                      }: ModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className={className}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                {children}
                {footer && <DialogFooter>{footer}</DialogFooter>}
            </DialogContent>
        </Dialog>
    )
}