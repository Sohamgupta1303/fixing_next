import React from "react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Temporary type definition until Prisma client is fully generated
type OrganizationWithRelations = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  category: string | null;
  createdAt: Date;
  college: {
    id: string;
    name: string;
  } | null;
  members: {
    id: string;
    role: string;
    user: {
      id: string;
      name: string | null;
    };
  }[];
};

interface OrgCardProps {
  organization: OrganizationWithRelations;
}

const OrgCard = ({ organization }: OrgCardProps) => {
  return (
    <li className="organization-card group">
      <div className="flex-between">
        <div className="flex-between gap-5">
          <p className="text-16-medium line-clamp-1">
            <Link href={`/organization/${organization.id}`}>
              {organization.name}
            </Link>
          </p>
        </div>
        <p className="org-card_date">
          {formatDate(organization.createdAt.toISOString())}
        </p>
      </div>
      <div className="organization-card_desc mt-5">
        <p>
          <Link href={`/organization/${organization.id}`}>
            {organization.description}
            {organization.image && (
              <img 
                src={organization.image} 
                alt={organization.name} 
                className="organization-card_img mt-5"
              />
            )}
          </Link>
        </p>
      </div>
      <div className="flex-between gap-3 mt-5">
        <Link href={`/?query=${organization.category?.toLowerCase()}`}>
          <p className="text-16-medium">{organization.category}</p>
        </Link>
        <Button className="startup-card_btn" asChild>
          <Link href={`/organization/${organization.id}`}>Details</Link>
        </Button>
      </div>
    </li>
  );
};

export default OrgCard;