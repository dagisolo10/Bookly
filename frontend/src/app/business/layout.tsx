import { defaultMetadata } from "@/lib/metadata";

export const metadata = defaultMetadata;

export default function BusinessLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <div>{children}</div>;
}
