import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home({searchParams} : {searchParams : Promise<{query? : string}>}) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/api/auth/signin");
    return;
  }

  const query = (await searchParams).query;

  // Fetch organizations for the main content
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

  // Just render the main content (sidebar is in layout)
  return (
    <div className="p-6 w-full max-w-none">
      <h1 className="h1-font">
        Welcome to College Rush
      </h1>
      
      {query && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#335035] mb-4">
            Search Results for `{query}`
          </h2>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {organizations.map((org) => (
          <div key={org.id} className="bg-white border-[#d4c5a0] p-4 rounded-lg">
            <h3 className="font-medium text-[#335035]">{org.name}</h3>
            <p className="text-sm text-[#968054] mt-1">
              {org.description || "No description"}
            </p>
            <div className="mt-2">
              <span className="text-xs bg-[#C3BA88] text-[#335035] px-2 py-1 rounded">
                {org.category || "General"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
