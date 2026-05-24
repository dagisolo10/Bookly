"use client";

import { syncUserQueryOptions } from "@/hooks/tan stack/query-options";
import { useUpdateUser } from "@/hooks/tan stack/use-user";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";

export default function UserSync({ children }: { children: ReactNode }) {
    const { isLoaded, isSignedIn, user } = useUser();

    const { mutate: updateUser } = useUpdateUser();

    const { data: dbUser } = useQuery(
        syncUserQueryOptions({
            enabled: isLoaded && isSignedIn,
        }),
    );

    useEffect(() => {
        if (dbUser && user?.fullName && dbUser.name !== user.fullName) {
            updateUser({ name: user.fullName });
        }
    }, [dbUser, updateUser, user?.fullName]);

    return children;
}
