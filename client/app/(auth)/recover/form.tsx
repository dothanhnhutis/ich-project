"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircleIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { mainFetch } from "@/lib/custom-fetch";
import * as z from "zod";
import { toast } from "sonner";
import { Recover, recoverSchema } from "@/schema/auth.schema";
type RecoverFormProps = {
  email?: string;
};

const RecoverForm = ({ email }: RecoverFormProps) => {
  const [formData, setFormData] = React.useState<Recover>({
    email: email || "",
  });

  const recoverMutation = useMutation({
    mutationFn: async (input: Recover) => {
      return await mainFetch.post<{ message: string }>("/auth/recover", input);
    },
    onSuccess({ data }) {
      setFormData({ email: "" });
      toast.success(data.message);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parse = recoverSchema.safeParse(formData);
    if (!parse.success) return;
    recoverMutation.mutate(formData);
  };
  return (
    <div
      className="flex flex-col flex-grow sm:flex-grow-0 sm:grid grid-cols-12 transition-all
  "
    >
      <div className="flex flex-col flex-grow sm:flex-grow-0 sm:col-start-3 sm:col-end-11 mx-auto w-full sm:max-w-[570px] p-4">
        <div className="flex flex-col flex-grow space-y-6">
          <div className="mt-10 mb-6 text-center">
            <div className="inline-flex w-[145px] h-[130px] min-w-[145px] min-h-[130px]">
              <Image
                src={"/mail.svg"}
                alt="mail"
                width={100}
                height={100}
                className="shrink-0 size-auto"
              />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-center mt-4">
            <span>Cập nhật mật khẩu của bạn</span>
          </h1>
          <p className="text-center text-muted-foreground text-base">
            Nhập địa chỉ email của bạn và chọn <strong>Gửi</strong>.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                value={formData.email}
                onChange={(e) => {
                  setFormData({
                    email: e.target.value,
                  });
                }}
                id="email"
                type="email"
                placeholder="example@gmail.com"
                className="focus-visible:ring-offset-0 focus-visible:ring-transparent"
              />
            </div>
            <div className="flex gap-1 justify-end items-center mt-4">
              <Link
                prefetch
                href="/signin"
                className={buttonVariants({ variant: "link" })}
              >
                Huỷ bỏ
              </Link>

              <Button variant="default" disabled={recoverMutation.isPending}>
                {recoverMutation.isPending && (
                  <LoaderCircleIcon className="h-4 w-4 animate-spin flex-shrink-0 mr-2" />
                )}
                Gửi
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecoverForm;
