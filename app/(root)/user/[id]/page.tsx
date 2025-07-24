import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

    if (!userData) {
        return (
            <div className="p-6">
                <h1>User not found</h1>
            </div>
        )
    }

    return (
        <div className="p-6 w-full max-w-none">
            <h1 className="h1-font">
                Welcome, {userData.name}!
            </h1>

            {/* User Info Card */}
            <Card className="bg-white border-[#d4c5a0] mb-6">
                <CardHeader>
                    <CardTitle className="text-[#335035]">Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <p><strong>Name:</strong> {userData.name}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>College:</strong> {userData.college?.name || "Not specified"}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Organization Memberships */}
            <Card className="bg-white border-[#d4c5a0]">
                <CardHeader>
                    <CardTitle className="text-[#335035]">Your Organizations</CardTitle>
                    <CardDescription>
                        You're a member of {userData.organizationRoles.length} organization(s)
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {userData.organizationRoles.length > 0 ? (
                        <div className="space-y-3">
                            {userData.organizationRoles.map((role) => (
                                <div key={role.id} className="flex items-center justify-between p-3 border border-[#d4c5a0] rounded-lg">
                                    <div>
                                        <h3 className="font-medium text-[#335035]">
                                            {role.organization.name}
                                        </h3>
                                        <p className="text-sm text-[#968054]">
                                            {role.organization.description || "No description"}
                                        </p>
                                    </div>
                                    <Badge className="bg-[#C3BA88] text-[#335035]">
                                        {role.role}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[#968054]">You're not a member of any organizations yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}