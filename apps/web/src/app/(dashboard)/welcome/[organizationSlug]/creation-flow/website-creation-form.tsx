"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { WebsiteInstallationTarget } from "@origamichat/database/enums";
import {
  CreateWebsiteRequest,
  createWebsiteRequestSchema,
} from "@origamichat/api/schemas";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";

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
import { Spinner } from "@/components/ui/spinner";
import { isValidDomain } from "@/lib/utils";
import Icon from "@/components/ui/icons";

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
  const trpc = useTRPC();
  const form = useForm<CreateWebsiteRequest>({
    resolver: zodResolver(createWebsiteRequestSchema),
    defaultValues: {
      name: "",
      domain: "",
      organizationId,
      installationTarget: WebsiteInstallationTarget.NEXTJS,
    },
  });

  const domainValue = form.watch("domain");

  const shouldCheckDomain =
    !!domainValue &&
    form.formState.isDirty &&
    isValidDomain(domainValue) &&
    !isSubmitting;

  const { data: isDomainTaken, isFetching: isCheckingDomain } = useQuery({
    ...trpc.website.checkDomain.queryOptions({
      domain: domainValue,
    }),
    enabled: !!shouldCheckDomain,
  });

  const handleSubmit = (data: CreateWebsiteRequest) => {
    if (isDomainTaken) return;

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
                  <div className="relative">
                    <Input
                      placeholder="Eg. polar.sh"
                      {...field}
                      disabled={isSubmitting}
                      onBlur={(e) => {
                        // Remove protocol if present
                        const value = e.target.value;
                        const domainWithoutProtocol = value.replace(
                          /^https?:\/\//,
                          ""
                        );

                        field.onChange(domainWithoutProtocol);

                        // Trigger validation
                        form.trigger("domain");
                      }}
                      append={
                        field.value &&
                        shouldCheckDomain && (
                          <div className="flex items-center gap-2">
                            {isCheckingDomain && <Spinner />}
                            {!isCheckingDomain && isDomainTaken ? (
                              <Icon name="x" />
                            ) : !isCheckingDomain && field.value ? (
                              <Icon name="check" />
                            ) : null}
                          </div>
                        )
                      }
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  The domain your users will be chatting with you and your AI
                  agents.
                  {isDomainTaken && (
                    <p className="text-destructive mt-1">
                      This domain is already in use. Please choose another one.
                    </p>
                  )}
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="installationTarget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Framework</FormLabel>
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
            disabled={
              isSubmitting ||
              isDomainTaken ||
              !form.formState.isValid ||
              !isValidDomain(domainValue)
            }
            isSubmitting={isSubmitting}
            className="w-full"
          >
            Start your integration
          </BaseSubmitButton>
        </form>
      </Form>
    </div>
  );
}
