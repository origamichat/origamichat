"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { WebsiteInstallationTarget } from "@repo/database/enums";
import { CreateWebsiteRequest, createWebsiteRequestSchema } from "api/schemas";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FrameworkPicker } from "@/components/framework-picker";
import { BaseSubmitButton } from "@/components/ui/base-submit-button";

interface WebsiteCreationFormProps {
  organizationId: string;
  onSubmit?: (data: CreateWebsiteRequest) => void;
  isSubmitting?: boolean;
}

export default function WebsiteCreationForm({
  organizationId,
  onSubmit,
  isSubmitting = false,
}: WebsiteCreationFormProps) {
  const form = useForm<CreateWebsiteRequest>({
    resolver: zodResolver(createWebsiteRequestSchema),
    defaultValues: {
      name: "",
      domain: "",
      organizationId,
      installationTarget: WebsiteInstallationTarget.NEXTJS,
    },
  });

  const handleSubmit = (data: CreateWebsiteRequest) => {
    onSubmit?.(data);
  };

  return (
    <div className="mt-4 w-full">
      <div className="mb-6">
        <p className="text-muted-foreground">
          Provide your website details and select your framework to get started.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 w-full"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg. Dub, Midday"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domain</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Eg. polar.sh"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  The domain your users will be chatting with you and your AI
                  agents.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="installationTarget"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="mt-6">Pick your framework</FormLabel>
                <FormControl>
                  <FrameworkPicker
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <BaseSubmitButton
            type="submit"
            disabled={isSubmitting || !form.formState.isValid}
            className="w-full"
            isSubmitting={isSubmitting}
          >
            Create
          </BaseSubmitButton>
        </form>
      </Form>
    </div>
  );
}
