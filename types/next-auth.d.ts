import { Role } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: Role
      collegeId?: string | null
      college?: {
        id: string
        name: string
        domains: string[]
      } | null
      organizationRoles?: {
        id: string
        role: string
        organization: {
          id: string
          name: string
        }
      }[]
    }
  }

  interface User {
    id: string
    role: Role
    collegeId?: string | null
  }
} 

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role?: Role
    collegeId?: string | null
  }
} 