import { defaultMetadata } from "@/lib/metadata";

export const metadata = defaultMetadata;

export default function BusinessLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <div className="mx-auto max-w-6xl py-12">{children}</div>;
}
