"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/auth/auth-config";
import type { Database } from "@/lib/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ProfileFormProps {
  profile: Profile | null;
}

interface FormData {
  name: string;
  email: string;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: profile?.name || "",
      email: profile?.email || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: data.name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile?.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          disabled
          {...register("email")}
        />
        <p className="text-sm text-muted-foreground">
          Email cannot be changed
        </p>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}