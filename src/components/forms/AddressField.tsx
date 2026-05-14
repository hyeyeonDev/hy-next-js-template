"use client";

import { forwardRef, InputHTMLAttributes } from "react";

import { MapPin } from "lucide-react";

import { Input } from "@/components/ui/Input";

interface AddressFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  detailAddress?: boolean;
}

export const AddressField = forwardRef<HTMLInputElement, AddressFieldProps>(
  ({ className, detailAddress, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        <Input
          ref={ref}
          leftIcon={<MapPin aria-hidden="true" />}
          className={className}
          placeholder="주소를 입력하세요"
          {...props}
        />

        {detailAddress && <Input placeholder="상세 주소를 입력하세요" />}
      </div>
    );
  },
);

AddressField.displayName = "AddressField";
