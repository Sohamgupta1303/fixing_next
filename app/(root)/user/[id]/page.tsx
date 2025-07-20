import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from "next/navigation"
import UserProfileWithSidebar from './UserProfileClient'

export default async function UserPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/api/auth/signin")
        return
    }

    // Fetch user data
    const userData = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            college: true,
            organizationRoles: {
                include: {
                    organization: true,
                },
            },
        },
    })

    // Fetch organizations for sidebar
    const organizations = await prisma.organization.findMany({
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
    })

    if (!userData) {
        return (
            <div className="p-6">
                <h1>User not found</h1>
            </div>
        )
    }

    return (
        <UserProfileWithSidebar 
            userData={userData} 
            organizations={organizations} 
        />
    )
}