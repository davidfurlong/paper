import { WalletIcon } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ThemeSettings } from "~/components/ThemeSettings";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ConnectedWalletLabel } from "~/components/web3/ConnnectedWalletLabel";
import { LogoutButton } from "~/components/web3/WalletButtons";
import { getServerAuth } from "~/utils/getServerAuth";

export const metadata: Metadata = {
  title: "Settings",
  description: "Adjust your preferences",
  openGraph: {
    title: "Settings",
    description: "Adjust your preferences",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

const settings = async () => {
  const { isAuthenticated, address } = await getServerAuth();
  if (!isAuthenticated) {
    redirect("/");
  }

  return (
    <div className="space-y-4">
      <ThemeSettings />

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <p className="text-sm text-muted-foreground">Manage your wallet connection</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <h1 className="text-lg flex gap-2 items-center">
              <WalletIcon /> Wallet
            </h1>
            <div className="pl-4 flex flex-col gap-2">
              <ConnectedWalletLabel />
              <LogoutButton />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default settings;
