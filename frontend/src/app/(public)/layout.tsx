import { defaultMetadata } from "@/lib/metadata";

export const metadata = defaultMetadata;

export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return children;
}
