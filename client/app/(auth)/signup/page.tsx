"use client";
import ContinueBtn from "@/components/continue-btn";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mainFetch } from "@/lib/custom-fetch";
import { cn } from "@/lib/utils";
import { SignUp, signUpSchema } from "@/schema/auth.schema";
import { useMutation } from "@tanstack/react-query";
import { CheckIcon, LoaderCircleIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import * as z from "zod";

const SignUpPage = () => {
  const [formData, setFormData] = React.useState<SignUp>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [focused, setFocused] = React.useState<string[]>([]);
  const [emailExists, setEmailExists] = React.useState<boolean>(false);
  const [isHiddenPassword, setIsHiddenPassword] = React.useState<boolean>(true);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name == "email" && emailExists) {
      setEmailExists(false);
    }
  };

  const handleOnChangFocus = (
    e: React.FocusEvent<HTMLInputElement, Element>
  ) => {
    if (e.type == "blur" && !focused.includes(e.target.name)) {
      setFocused((prev) => [...prev, e.target.name]);
    }
  };

  const handleError = React.useCallback(
    (path: string) => {
      const parse = signUpSchema.safeParse(formData);
      if (parse.success) return [];
      const errors: z.ZodIssue[] = parse.error.issues;
      return errors.filter((e) => e.path.join("_") == path);
    },
    [formData]
  );

  const { isPending, mutate } = useMutation({
    mutationFn: async (input: z.infer<typeof signUpSchema>) => {
      return await mainFetch.post<
        { message: string },
        z.infer<typeof signUpSchema>
      >("/auth/signup", input);
    },
    onSuccess({ data }) {
      toast.success(data.message);
      setFormData({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });
      setFocused([]);
    },
    onError() {
      setEmailExists(true);
      setFormData((prev) => ({
        ...prev,
        username: "",
        password: "",
        confirmPassword: "",
      }));
      setFocused(["email"]);
    },
    onMutate() {},
  });

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    const parse = signUpSchema.safeParse(formData);
    if (!parse.success) return;
    mutate(formData);
  };

  return (
    <main className="sm:p-8" onSubmit={handleSubmit}>
      <form className="rounded-lg sm:border bg-card text-card-foreground sm:shadow-sm p-4 sm:p-6 sm:mx-auto sm:max-w-md transition-all">
        <div className="flex flex-col space-y-1.5">
          <h3 className="font-semibold tracking-tight text-2xl">Đăng ký</h3>
          <p className="text-sm text-muted-foreground">
            Nhập email và mật khẩu để tạo tài khoản
          </p>
        </div>

        <div className="pt-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Tên</Label>
              <Input
                placeholder="Nguyễn Văn A"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleOnChange}
                onBlur={handleOnChangFocus}
                className={cn(
                  focused.includes("username") &&
                    handleError("username").length > 0
                    ? "border-red-500"
                    : ""
                )}
              />
              {focused.includes("username") &&
                handleError("username").map((e, idx) => (
                  <p key={idx} className="font-bold text-xs text-red-500">
                    {e.message}
                  </p>
                ))}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                placeholder="test@example.com"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleOnChange}
                onBlur={handleOnChangFocus}
                className={cn(
                  focused.includes("email") && handleError("email").length > 0
                    ? "border-red-500"
                    : ""
                )}
              />
              {focused.includes("email") &&
                handleError("email").map((e, idx) => (
                  <p key={idx} className="font-bold text-xs text-red-500">
                    {e.message}
                  </p>
                ))}
              {emailExists && (
                <p className="font-bold text-xs text-red-500">
                  Email này đã đăng ký.{" "}
                  <Link
                    className="text-primary text-xs"
                    href={`/signin?email=${formData.email}`}
                  >
                    Đăng nhập
                  </Link>
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mật khẩu</Label>

              <PasswordInput
                placeholder="********"
                id="password"
                name="password"
                autoComplete="off"
                value={formData.password}
                onChange={handleOnChange}
                onBlur={handleOnChangFocus}
                className={cn(
                  focused.includes("password") &&
                    handleError("password").length > 0
                    ? "border-red-500"
                    : ""
                )}
                open={isHiddenPassword}
                onOpenChange={setIsHiddenPassword}
              />

              <div className="flex flex-col gap-y-1">
                <Label className="font-normal text-xs">
                  Mật khẩu của bạn phải bao gồm:
                </Label>
                <p
                  className={cn(
                    "inline-flex gap-x-2 items-center text-gray-500",

                    handleError("password").filter((e) => e.code == "too_small")
                      .length == 0
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
                    handleError("password").filter(
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
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <PasswordInput
                placeholder="********"
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="off"
                value={formData.confirmPassword}
                onChange={handleOnChange}
                onBlur={handleOnChangFocus}
                className={cn(
                  focused.includes("confirmPassword") &&
                    handleError("confirmPassword").length > 0
                    ? "border-red-500"
                    : ""
                )}
                open={isHiddenPassword}
                onOpenChange={setIsHiddenPassword}
              />

              {focused.includes("confirmPassword") &&
                handleError("confirmPassword").map((e, idx) => (
                  <p key={idx} className="font-bold text-xs text-red-500">
                    {e.message}
                  </p>
                ))}
            </div>
            <Button variant="default" disabled={isPending}>
              {isPending && (
                <LoaderCircleIcon className="h-4 w-4 animate-spin flex-shrink-0 mr-1" />
              )}
              Đăng ký
            </Button>
            <ContinueBtn label="Đăng ký với Google" redir="/signup" />
          </div>
          <div className="mt-4 text-center text-sm">
            Bạn đã có tài khoản?{" "}
            <Link className="underline" href="/signin">
              Đăng nhập
            </Link>
          </div>
        </div>
      </form>
    </main>
  );
};

export default SignUpPage;
