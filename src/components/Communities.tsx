"use client";

import type { Group } from "@cartel-sh/ui";
import { useSearchParams } from "next/navigation";
import { Feed } from "~/components/Feed";
import { CommunityView } from "~/components/communities/CommunityView";
import { TrendingCommunities } from "~/components/communities/TrendingCommunities";
import { SearchBar } from "~/components/menu/Search";
import { TRENDING_COMMUNITY_ADDRESSES } from "~/constants/trendingCommunities";

interface CommunitiesProps {
  initialQuery?: string;
}

const CommunityViewWrapper = ({ item }: { item: Group }) => {
  return <CommunityView community={item} />;
};

export default function Communities({ initialQuery = "" }: CommunitiesProps) {
  const searchParams = useSearchParams();
  const query = initialQuery || searchParams.get("q") || "";

  return (
    <>
      <Feed<Group>
        ItemView={CommunityViewWrapper}
        endpoint={`/api/communities${query ? `?q=${encodeURIComponent(query)}` : ""}`}
        queryKey={["communities", query]}
      />
    </>
  );
}
