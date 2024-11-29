"use client";
import React from "react";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CheckIcon, LoaderCircleIcon } from "lucide-react";
import { UserToken } from "@/schema/user.schema";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { mainFetch } from "@/lib/custom-fetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DEFAULT_LOGOUT_REDIRECT } from "@/routes";
import { ResetPassword, resetPasswordSchema } from "@/schema/auth.schema";

const ResetPasswordForm = ({ token }: { token: string }) => {
  const routes = useRouter();
  const [isHiddenPassword, setIsHiddenPassword] = React.useState<boolean>(true);
  const [formData, setFormData] = React.useState<ResetPassword>({
    newPassword: "",
    confirmPassword: "",
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [focused, setFocused] = React.useState<string[]>([]);
  const handleOnChangFocus = (
    e: React.FocusEvent<HTMLInputElement, Element>
  ) => {
    if (e.type == "blur" && !focused.includes(e.target.name)) {
      setFocused((prev) => [...prev, e.target.name]);
    }
  };

  const handleError = React.useCallback(
    (path: string) => {
      const parse = resetPasswordSchema.safeParse(formData);
      if (parse.success) return [];
      const errors: z.ZodIssue[] = parse.error.issues;
      return errors.filter((e) => e.path.join("_") == path);
    },
    [formData]
  );

  const resetPasswordMutation = useMutation({
    mutationFn: async (input: ResetPassword) => {
      return mainFetch.post<{ message: string }>(
        "/auth/reset-password?token=" + token,
        input
      );
    },
    onMutate() {
      setFormData({
        newPassword: "",
        confirmPassword: "",
      });
      setFocused([]);
    },
    onSuccess({ data }) {
      toast.success(data.message);
      routes.push(DEFAULT_LOGOUT_REDIRECT);
    },
    onError(error) {
      toast.error(error.message);
      if (error.message == "Phiên của bạn đã hết hạn.") {
        routes.push(DEFAULT_LOGOUT_REDIRECT);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parse = resetPasswordSchema.safeParse(formData);
    if (!parse.success) return;
    resetPasswordMutation.mutate(formData);
  };

  return (
    <div className="flex flex-col flex-grow mx-auto w-full sm:max-w-[570px] p-4 transition-all">
      <div className="flex flex-col flex-grow space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight text-center mt-4">
          Đặt lại mật khẩu bảo mật
        </h1>

        <p className="text-muted-foreground text-center">
          Nhập mật khẩu bảo mật và khôi phục lại tài khoản của bạn
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 w-full">
          <div className="flex flex-col gap-y-1.5">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <PasswordInput
              id="newPassword"
              name="newPassword"
              autoComplete="off"
              placeholder="********"
              open={isHiddenPassword}
              onOpenChange={setIsHiddenPassword}
              value={formData.newPassword}
              onChange={handleOnChange}
              onBlur={handleOnChangFocus}
              className={cn(
                focused.includes("newPassword") &&
                  handleError("newPassword").length > 0
                  ? "border-red-500"
                  : ""
              )}
            />

            <div className="flex flex-col gap-y-1">
              <p className="font-normal text-xs">
                Mật khẩu của bạn phải bao gồm:
              </p>
              <p
                className={cn(
                  "inline-flex gap-x-2 items-center text-gray-500",
                  handleError("newPassword").filter(
                    (e) => e.code == "too_small"
                  ).length == 0
                    ? "text-green-400"
                    : ""
                )}
              >
                <CheckIcon size={16} />
                <span className="font-medium text-xs">8 đến 40 ký tự</span>
              </p>
              <p
                className={cn(
                  "inline-flex gap-x-2 items-center text-gray-500",
                  handleError("newPassword").filter(
                    (e) => "validation" in e && e.validation == "regex"
                  ).length == 0
                    ? "text-green-400"
                    : ""
                )}
              >
                <CheckIcon size={16} />
                <span className="font-medium text-xs">
                  Chữ cái, số và ký tự đặc biệt @$!%*?&
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-1.5">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>

            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="off"
              placeholder="********"
              open={isHiddenPassword}
              onOpenChange={setIsHiddenPassword}
              value={formData.confirmPassword}
              onChange={handleOnChange}
              onBlur={handleOnChangFocus}
              className={cn(
                focused.includes("confirmPassword") &&
                  handleError("confirmPassword").length > 0
                  ? "border-red-500"
                  : ""
              )}
            />

            {focused.includes("confirmPassword") &&
              handleError("confirmPassword").map((e, idx) => (
                <p key={idx} className="font-bold text-xs text-red-500">
                  {e.message}
                </p>
              ))}
          </div>
          <Button disabled={resetPasswordMutation.isPending}>
            {resetPasswordMutation.isPending && (
              <LoaderCircleIcon className="h-4 w-4 animate-spin flex-shrink-0 mr-2" />
            )}
            Khôi phục
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
