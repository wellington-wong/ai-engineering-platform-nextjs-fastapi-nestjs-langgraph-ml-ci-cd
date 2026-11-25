
import { type ReactNode, Suspense } from 'react'


export default function LoginLayout({ children }: {children: ReactNode}) {

    return (
        <Suspense>
            { children }
        </Suspense>
    )
}