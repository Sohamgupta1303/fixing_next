import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma) as any,
  providers: [GitHub],
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }) {
      // Add user ID and role to session
      if (session.user) {
        session.user.id = user.id
        
        // Get user with role and college information
        const fullUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            college: true,
            organizationRoles: {
              include: {
                organization: true,
              },
            },
          },
        })
        
        if (fullUser) {
          session.user.role = fullUser.role
          session.user.collegeId = fullUser.collegeId
          session.user.college = fullUser.college
          session.user.organizationRoles = fullUser.organizationRoles
        }
      }
      return session
    },
    async signIn({ user, account }) {
      if (account?.provider === "github" && user.email) {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        })
        
        if (!existingUser) {
          // New user - try to match them to a college by email domain
          const emailDomain = user.email.split('@')[1]
          const college = await prisma.college.findFirst({
            where: {
              domains: {
                has: emailDomain,
              },
            },
          })
          
          // If we found a college, we'll update the user after account creation
          if (college) {
            // The user will be created by the adapter, then we'll update collegeId
            setTimeout(async () => {
              await prisma.user.update({
                where: { email: user.email! },
                data: { collegeId: college.id },
              })
            }, 100)
          }
        }
      }
      return true
    },
  },
})