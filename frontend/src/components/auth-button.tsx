"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";

export default function AuthButton() {
    const { isSignedIn } = useUser();

    if (isSignedIn) {
        return (
            <Button size={"cta"} asChild>
                <Link href={"/customer"}>Continue</Link>
            </Button>
        );
    }

    return (
        <SignInButton mode="modal">
            <Button size={"cta"}>Get started</Button>
        </SignInButton>
    );
}
