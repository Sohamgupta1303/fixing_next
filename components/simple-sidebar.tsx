"use client"

import * as React from "react"
import { CheckSquare } from "lucide-react"
import { cn } from "@/lib/utils"

// Organization type matching your database structure
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

// Icon mapping for different club categories
const getCategoryIcon = (category: string | null) => {
  const { Users, Trophy, Star, Music, Calendar } = require("lucide-react")
  const iconMap: { [key: string]: any } = {
    "academic": Users,
    "sports": Trophy,
    "arts": Star,
    "music": Music,
    "tech": Calendar,
    "default": Users
  }
  return iconMap[category?.toLowerCase() || 'default'] || iconMap.default
}

interface ClubSidebarProps {
  organizations: Organization[]
  selectedOrg: Organization | null
  pendingTodos: number
  onTodoClick: () => void
  onOrgClick: (org: Organization) => void
}

export default function ClubSidebar({ 
  organizations, 
  selectedOrg, 
  pendingTodos, 
  onTodoClick, 
  onOrgClick 
}: ClubSidebarProps) {
  // Convert organizations to the UI format (first 5 for sidebar)
  const clubs = organizations.slice(0, 5).map((org, index) => ({
    id: org.id,
    name: org.name,
    icon: getCategoryIcon(org.category),
    status: Math.random() > 0.5 ? "joined" : "pending" as "joined" | "pending", // Random for demo
    color: "#488363"
  }))

  return (
    <div className="w-20 bg-[#335035] flex flex-col items-center py-4 space-y-4 flex-shrink-0">
      {/* To-Do Widget */}
      <div
        className="relative w-12 h-12 bg-[#488363] rounded-xl cursor-pointer hover:bg-[#5a9575] transition-colors flex items-center justify-center group"
        onClick={onTodoClick}
      >
        <CheckSquare className="h-6 w-6 text-[#FFFFFF]" />
        {pendingTodos > 0 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-[#335035]">{pendingTodos}</span>
          </div>
        )}
      </div>

      {/* Club Widgets */}
      <div className="space-y-3">
        {clubs.map((club) => {
          const IconComponent = club.icon
          const org = organizations.find(o => o.id === club.id)
          
          return (
            <div
              key={club.id}
              className={cn(
                "w-12 h-12 rounded-xl cursor-pointer transition-all hover:bg-[#5a9575] flex items-center justify-center",
                club.status === "joined"
                  ? "bg-[#488363] border-2 border-solid border-[#5a9575]"
                  : "bg-[#488363] border-2 border-dashed border-[#5a9575]",
                selectedOrg?.id === club.id && "ring-2 ring-[#C3BA88]",
              )}
              onClick={() => {
                if (org) onOrgClick(org)
              }}
            >
              <IconComponent className="h-6 w-6 text-[#FFFFFF]" />
            </div>
          )
        })}
      </div>
    </div>
  )
} 