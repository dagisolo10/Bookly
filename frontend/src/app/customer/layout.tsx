import { defaultMetadata } from "@/lib/metadata";

export const metadata = defaultMetadata;

export default function CustomerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return <div className="screen">{children}</div>;
}
