import type { User } from "@cartel-sh/ui";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { UserCard } from "./UserCard";

export function UserAvatar({ user, link = true, card = true }: { user: User; link?: boolean; card?: boolean }) {
  const fallback = user?.username?.slice(0, 2) ?? "";
  const avatar = (
    <Avatar suppressHydrationWarning className="w-full h-full m-0">
      <AvatarImage alt={user?.profilePictureUrl} src={user?.profilePictureUrl} className="m-0 object-cover" />
      <AvatarFallback>{fallback.toLowerCase()}</AvatarFallback>
    </Avatar>
  );
  const avatarLink = link ? (
    <Link className="w-full h-full" href={`/u/${user.username || user.address}`} prefetch>
      {avatar}
    </Link>
  ) : (
    avatar
  );
  const avatarCard =
    card && (user?.username || user?.address) ? (
      <UserCard handle={user?.username} address={user?.address}>
        {avatarLink}
      </UserCard>
    ) : (
      avatarLink
    );

  return avatarCard;
}

export function UserAvatarArray({ users, amountTruncated }: { users: User[]; amountTruncated?: number }) {
  const avatars = users.map((user, index) => (
    <div key={`${user.id}-${index}`} className="w-10 h-10 -ml-4">
      <UserAvatar link={true} user={user} />
    </div>
  ));

  const formatAmount = amountTruncated
    ? Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(amountTruncated)
    : "";

  return (
    <div className="flex flex-row pl-4">
      {avatars}
      {amountTruncated ? (
        <div className="w-10 h-10 -ml-4 rounded-full border-2 text-card-foreground text-base backdrop-blur-md border-accent text-center justify-center items-center flex z-10">
          +{formatAmount}
        </div>
      ) : null}
    </div>
  );
}

export function UserAvatarViewer({ user }: { user: User }) {
  const src = user.profilePictureUrl;
  const alt = `@${user.username}'s profile picture`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full h-full cursor-pointer">
          <UserAvatar user={user} link={false} card={false} />
        </div>
      </DialogTrigger>
      {src ? (
        <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-fit">
          <img src={src} alt={alt} className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl" />
        </DialogContent>
      ) : null}
    </Dialog>
  );
}

/// Get the URL for a stamp.fyi profile image.
///
/// @param address The address of the profile.
/// @returns The URL for the profile stamp image.
export function getStampUrl(address: string): string {
  return `https://cdn.stamp.fyi/avatar/${address}?s=140`;
}
