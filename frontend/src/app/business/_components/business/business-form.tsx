"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCreateBusiness } from "@/hooks/tan stack/use-owner-business";
import { createBusinessSchema } from "@/lib/validation";
import { WeekDay } from "@/types/models";
import { CreateBusinessPayload } from "@/types/payload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

type BannerUpload = {
    id: string;
    file: File;
    previewUrl: string;
};

export default function BusinessForm() {
    const router = useRouter();

    const [banners, setBanners] = useState<BannerUpload[]>([]);
    const weekDays: WeekDay[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const bannersRef = useRef<BannerUpload[]>([]);
    const hoursSectionRef = useRef<HTMLDivElement>(null);

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<CreateBusinessPayload>({
        resolver: zodResolver(createBusinessSchema),
        shouldUnregister: true,
        defaultValues: {
            name: "",
            location: "",
            phone: "",
            description: "",
            bannerImages: [],
            hours: [
                { day: "Monday", open: "09:00", close: "17:00" },
                { day: "Tuesday", open: "09:00", close: "17:00" },
                { day: "Wednesday", open: "09:00", close: "17:00" },
                { day: "Thursday", open: "09:00", close: "17:00" },
                { day: "Friday", open: "09:00", close: "17:00" },
                { day: "Saturday", open: "09:00", close: "17:00" },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: "hours" });

    const { mutateAsync: createBusiness, isPending: isCreating } = useCreateBusiness();

    useEffect(() => {
        const bannerImages = banners.map((b) => b.previewUrl);
        setValue("bannerImages", bannerImages);
    }, [banners, setValue]);

    function toggleDay(day: WeekDay, value: "open" | "close") {
        if (value === "open") {
            const exists = fields.some((f) => f.day === day);
            if (!exists) {
                append({ day, open: "09:00", close: "17:00" });
            }
        } else {
            const idx = fields.findIndex((f) => f.day === day);
            if (idx !== -1) remove(idx);
        }
    }

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const MAX_BYTES = 5 * 1024 * 1024;
        const newlySelectedFiles = Array.from(e.target.files || []);
        const oversized: string[] = [];
        const validFiles: File[] = [];

        for (const file of newlySelectedFiles) {
            if (file.size > MAX_BYTES) {
                oversized.push(file.name);
            } else {
                validFiles.push(file);
            }
        }

        if (oversized.length > 0) {
            toast.error(`Some files exceed the 5MB limit and were skipped: ${oversized.join(", ")}`);
        }

        const newEntries: BannerUpload[] = validFiles.map((file) => ({
            file,
            id: crypto.randomUUID(),
            previewUrl: URL.createObjectURL(file),
        }));
        setBanners((prev) => [...prev, ...newEntries]);
        e.target.value = "";
    }

    function handleRemoveNewBanner(idToRemove: string, urlToRemove: string) {
        URL.revokeObjectURL(urlToRemove);
        setBanners((prev) => prev.filter((item) => item.id !== idToRemove));
    }

    useEffect(() => {
        bannersRef.current = banners;
    }, [banners]);

    useEffect(() => {
        if (errors.hours) {
            hoursSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [errors.hours]);

    useEffect(() => {
        return () => bannersRef.current.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl));
    }, [banners]);

    const onSubmit: SubmitHandler<CreateBusinessPayload> = async (data) => {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("phone", data.phone ?? "");
        formData.append("location", data.location ?? "");
        formData.append("description", data.description ?? "");

        formData.append("hours", JSON.stringify(data.hours));

        banners.forEach((banner) => {
            formData.append("bannerImages", banner.file);
        });

        const promise = createBusiness(formData);
        toast.promise(promise, {
            loading: "Creating business...",
            success: "Business created successfully",
            error: (err) => err.message || "Something went wrong",
        });
        await promise;
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <div className="space-y-6">
                <Tag text="General Information" />

                <FieldGroup className="gap-6">
                    <Field className="gap-2">
                        <Label htmlFor="name">Business Name</Label>
                        <Input id="name" {...register("name")} placeholder="e.g. The Silver Scissors" className="text-sm" />
                        <ErrorMessage message={errors.name?.message} />
                    </Field>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Field className="gap-2">
                            <Label htmlFor="location">Address / Location</Label>
                            <Input id="location" {...register("location")} placeholder="123 Business Ave, Suite 100" className="text-sm" />
                            <ErrorMessage message={errors.location?.message} />
                        </Field>
                        <Field className="gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" {...register("phone")} type="tel" placeholder="+1 (555) 000-0000" className="text-sm" />
                            <ErrorMessage message={errors.phone?.message} />
                        </Field>
                    </div>

                    <Field ref={hoursSectionRef} className="gap-2 border-0 shadow-none ring-0">
                        <Label>Daily Operating Hours</Label>

                        <div className="space-y-2 rounded-xl border px-4 py-2">
                            {weekDays.map((day) => {
                                const fieldIndex = fields.findIndex((f) => f.day === day);
                                const isOpen = fieldIndex !== -1;
                                return (
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" key={day}>
                                        <p className="w-24 text-sm font-medium">{day}</p>

                                        {!isOpen && (
                                            <div className="my-1 sm:flex-1 sm:text-center">
                                                <h2 className="text-sm font-semibold">Closed all day</h2>
                                            </div>
                                        )}

                                        {isOpen && (
                                            <div className="flex flex-1 items-center gap-2 transition-opacity duration-200">
                                                <input type="hidden" {...register(`hours.${fieldIndex}.day` as const)} />
                                                <Input type="time" className="h-7 rounded-xl text-sm" defaultValue="09:00" {...register(`hours.${fieldIndex}.open` as const)} />
                                                <span className="text-muted-foreground text-[10px] font-semibold uppercase">to</span>
                                                <Input type="time" className="h-7 rounded-xl text-sm" defaultValue="17:00" {...register(`hours.${fieldIndex}.close` as const)} />
                                            </div>
                                        )}

                                        <RadioGroup className="rounded-full bg-zinc-100 p-1" onValueChange={(value: "open" | "close") => toggleDay(day, value)} defaultValue="open" value={isOpen ? "open" : "close"}>
                                            <div>
                                                <RadioGroupItem value="open" id={`${day}-open`} className="peer sr-only hidden" />
                                                <Label htmlFor={`${day}-open`} className="peer-data-[state=checked]:bg-background cursor-pointer rounded-full px-4 py-1 text-xs font-semibold transition-all peer-data-[state=checked]:shadow-sm">
                                                    Open
                                                </Label>
                                            </div>

                                            <div>
                                                <RadioGroupItem value="close" id={`${day}-close`} className="peer sr-only hidden" />
                                                <Label htmlFor={`${day}-close`} className="peer-data-[state=checked]:bg-background cursor-pointer rounded-full px-4 py-1 text-xs font-semibold transition-all peer-data-[state=checked]:shadow-sm">
                                                    Closed
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                );
                            })}
                        </div>
                        <ErrorMessage message={getHoursError(errors.hours)} />
                    </Field>
                </FieldGroup>
            </div>

            <div className="space-y-6">
                <Tag text="Branding" />

                <FieldGroup>
                    <Field>
                        <Label htmlFor="description">Short Description</Label>
                        <Textarea id="description" {...register("description")} placeholder="Describe your business mission and vibe..." />
                        <ErrorMessage message={errors.description?.message} />
                    </Field>

                    <Field>
                        <Label>Storefront Banner</Label>

                        {banners.length > 0 && (
                            <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                                {banners.map(({ id, previewUrl }) => (
                                    <div key={id} className="relative aspect-video overflow-hidden rounded-xl border">
                                        <Image src={previewUrl} alt="Preview" width={1080} height={400} className="h-full w-full object-cover" />
                                        <button onClick={() => handleRemoveNewBanner(id, previewUrl)} title="Remove Banner Image" type="button" className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white hover:bg-black">
                                            <Plus className="size-3 rotate-45" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="group relative flex min-h-40 w-full cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all">
                            <Label className="flex h-full w-full items-center justify-center" htmlFor="banner">
                                <div className="text-center">
                                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-110">
                                        <Plus className="size-5 text-zinc-600" />
                                    </div>

                                    <p className="text-muted-foreground text-sm font-semibold">Upload Banner Images</p>
                                    <p className="my-2 text-xs text-zinc-500">Use horizontal (landscape) images for the best look.</p>
                                    <p className="text-xs text-zinc-500">PNG, JPG or WEBP up to 5MB</p>
                                </div>

                                <input multiple onChange={handleFileChange} type="file" id="banner" accept="image/*" className="absolute inset-0 cursor-pointer opacity-0" />
                            </Label>
                        </div>
                        <ErrorMessage message={errors.bannerImages?.message} />
                    </Field>
                </FieldGroup>
            </div>

            <div className="flex items-center justify-end gap-4">
                <Button onClick={() => router.back()} size={"cta"} variant="ghost" type="button">
                    Discard
                </Button>

                <Button disabled={isCreating} type="submit" size={"cta"} className="sm:w-auto">
                    Register Business
                </Button>
            </div>
        </form>
    );
}

export function Tag({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className="bg-foreground h-4 w-1 rounded-full" />
            <h3 className="text-sm font-bold tracking-widest text-zinc-500 uppercase">{text}</h3>
        </div>
    );
}

function ErrorMessage({ message }: { message?: string }) {
    return message ? <p className="text-destructive mt-1 text-xs font-medium">{message}</p> : null;
}

function getHoursError(errors: unknown): string | undefined {
    if (!errors) return;
    if (Array.isArray(errors)) {
        const itemErrors = errors.map((e) => e?.root?.message).filter(Boolean);
        return itemErrors.length > 0 ? itemErrors.join(", ") : undefined;
    }
    return (errors as { message?: string })?.message;
}
