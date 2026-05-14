"use client";

import type { ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormProvider as HookFormProvider,
  useForm,
  useFormContext,
  type FieldValues,
  type Resolver,
  type SubmitHandler,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import type { z } from "zod";

interface FormProviderProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  children: ReactNode;
  className?: string;
  id?: string;
  noValidate?: boolean;
  onSubmit?: SubmitHandler<TFieldValues>;
}

export function useAppForm<TFieldValues extends FieldValues = FieldValues>(
  options?: UseFormProps<TFieldValues>,
) {
  return useForm<TFieldValues>(options);
}

export function useZodForm<TFieldValues extends FieldValues>(
  schema: z.ZodType<TFieldValues, TFieldValues>,
  options?: Omit<UseFormProps<TFieldValues>, "resolver">,
) {
  return useForm<TFieldValues>({
    ...options,
    resolver: zodResolver(schema) as Resolver<TFieldValues>,
  });
}

export function FormProvider<TFieldValues extends FieldValues>({
  form,
  children,
  className,
  id,
  noValidate = true,
  onSubmit,
}: FormProviderProps<TFieldValues>) {
  return (
    <HookFormProvider {...form}>
      <form
        id={id}
        className={className}
        noValidate={noValidate}
        onSubmit={onSubmit ? form.handleSubmit(onSubmit) : undefined}
      >
        {children}
      </form>
    </HookFormProvider>
  );
}

export { useFormContext };
