"use client"

import * as React from "react"
import ClubSidebar from "@/components/simple-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Types matching your database
type UserData = {
    id: string
    name: string | null
    email: string | null
    college: {
        id: string
        name: string
        domains: string[]
    } | null
    organizationRoles: Array<{
        id: string
        role: string
        organization: {
            id: string
            name: string
            description: string | null
            category: string | null
        }
    }>
}

type Organization = {
    id: string
    name: string
    description: string | null
    category: string | null
    college: {
        id: string
        name: string
        domains: string[]
    } | null
    members: Array<{
        id: string
        role: string
        user: {
            id: string
            name: string | null
            email: string | null
        }
    }>
    createdAt: Date
}

interface UserProfileWithSidebarProps {
    userData: UserData
    organizations: Organization[]
}

// Placeholder todos - you can fetch real data later
const todoItems = [
    { id: 1, title: "Complete application for Programming Club", dueDate: "2024-01-15", completed: false },
    { id: 2, title: "Update profile information", dueDate: "2024-01-20", completed: true },
    { id: 3, title: "Join study group", dueDate: "2024-01-18", completed: false },
]

export default function UserProfileWithSidebar({ 
    userData, 
    organizations 
}: UserProfileWithSidebarProps) {
    const [selectedOrg, setSelectedOrg] = React.useState<Organization | null>(null)
    const [currentView, setCurrentView] = React.useState<"profile" | "todo">("profile")
    
    const pendingTodos = todoItems.filter(t => !t.completed).length

    const handleOrgClick = (org: Organization) => {
        setSelectedOrg(org)
        // You could navigate to the main club page or show org details
        window.location.href = `/?club=${org.id}`
    }

    const handleTodoClick = () => {
        setCurrentView("todo")
    }

    return (
        <div className="h-screen w-full bg-[#2a4a2d] overflow-hidden">
            <div className="flex h-full w-full">
                {/* Sidebar */}
                <ClubSidebar
                    organizations={organizations}
                    selectedOrg={selectedOrg}
                    pendingTodos={pendingTodos}
                    onTodoClick={handleTodoClick}
                    onOrgClick={handleOrgClick}
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col bg-[#f8f6f0] min-w-0 w-full h-full">
                    <div className="flex-1 overflow-y-auto min-h-0">
                        {currentView === "profile" && (
                            <div className="p-6 w-full max-w-none">
                                <h1 className="text-3xl font-bold text-[#335035] mb-6">
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
                                                        <Badge 
                                                            className="bg-[#C3BA88] text-[#335035]"
                                                        >
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
                        )}

                        {currentView === "todo" && (
                            <div className="p-6">
                                <h1 className="text-2xl font-bold text-[#335035] mb-6 flex items-center gap-2">
                                    📋 Your Tasks
                                </h1>
                                <div className="space-y-3">
                                    {todoItems.map((todo) => (
                                        <Card key={todo.id} className="bg-white border-[#d4c5a0]">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={todo.completed}
                                                        className="rounded"
                                                        readOnly
                                                    />
                                                    <div className="flex-1">
                                                        <div className={`font-medium ${todo.completed ? "line-through text-[#968054]" : "text-[#335035]"}`}>
                                                            {todo.title}
                                                        </div>
                                                        <div className="text-sm text-[#968054]">Due: {todo.dueDate}</div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}