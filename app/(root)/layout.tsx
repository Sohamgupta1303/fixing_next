import Navbar from "@/components/navbar";
import LayoutWithSidebar from "@/components/LayoutWithSidebar";
import React from "react";
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth";

export default async function Layout({children} : Readonly<{children : React.ReactNode}>) {
    const session = await auth();
    
    // Only fetch data if user is authenticated
    const organizations = session?.user ? await prisma.organization.findMany({
        include: {
            college: true,
            members: {
                include: {
                    user: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    }) : [];

    return (
        <main className="font-work-sans">
            <Navbar/>
            
            {session?.user ? (
                <LayoutWithSidebar 
                    organizations={organizations}
                    userId={session.user.id}
                >
                    {children}
                </LayoutWithSidebar>
            ) : (
                <div>
                    {children}
                </div>
            )}
        </main>
    )
}