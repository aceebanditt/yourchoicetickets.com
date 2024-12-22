"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/account/profile-form";
import { OrderHistory } from "@/components/account/order-history";
import { SavedEvents } from "@/components/account/saved-events";
import { supabase } from "@/lib/auth/auth-config";
import type { Database } from "@/lib/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function AccountPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  if (!user || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted rounded" />
          <div className="h-[200px] bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="saved">Saved Events</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-6">
            <ProfileForm profile={profile} />
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <OrderHistory userId={user.id} />
        </TabsContent>

        <TabsContent value="saved">
          <SavedEvents userId={user.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}