"use client";
import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { Button } from "../ui/button";
import { SignupForm } from "./SignupForm";
import Link from "next/link";
import { ResetPassword } from "./ResetPassword";

export function AuthForm() {
  const [mode, setMode] = useState("login");
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold -tracking-tight">
          {mode === "reset"
            ? "Reset Password"
            : mode === "login"
            ? "Login"
            : "Sign Up"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === "reset"
            ? "Enter your email below to reset your password"
            : mode === "login"
            ? "Enter your email below to login to your account"
            : "Enter your information below to create an account"}
        </p>
      </div>
      {mode === "login" && (
        <>
          <LoginForm />
          <div className="flex text-center justify-between">
            <Button
              variant={"link"}
              onClick={() => setMode("signup")}
              className="p-0"
            >
              Need an account ?
            </Button>
            <Button
              variant={"link"}
              onClick={() => setMode("reset")}
              className="p-0"
            >
              Forgot password ?
            </Button>
          </div>
        </>
      )}
      {mode === "signup" && (
        <>
          <SignupForm />
          <div className="flex text-center justify-center">
            <Button
              variant={"link"}
              onClick={() => setMode("login")}
              className="p-0"
            >
              Already have an account ?
            </Button>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking Signup you agree our
            <Link
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of service
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy policy
            </Link>
          </p>
        </>
      )}
      {mode === "reset" && (
        <>
          <ResetPassword />
          <div className="flex text-center justify-center">
            <Button
              variant={"link"}
              onClick={() => setMode("login")}
              className="p-0"
            >
              Back to login
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
