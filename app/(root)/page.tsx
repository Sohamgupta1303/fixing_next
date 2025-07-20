import { prisma } from "@/lib/prisma";
import ClubManagementUI from "@/components/club-management-ui";

export default async function Home({searchParams} : {searchParams : Promise<{query? : string}>}) {
  const query = (await searchParams).query;

  // Fetch organizations from PostgreSQL using Prisma
  const organizations = await prisma.organization.findMany({
    include: {
      college: true,
      members: {
        include: {
          user: true,
        },
      },
    },
    where: query ? {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
      ],
    } : undefined,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return <ClubManagementUI organizations={organizations} query={query} />;
}
