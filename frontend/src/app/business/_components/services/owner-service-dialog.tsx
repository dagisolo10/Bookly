"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateService, useUpdateService } from "@/hooks/tan stack/use-owner-service";
import type { BannerUpload, Service } from "@/types/models";
import { Plus } from "lucide-react";
import Image from "next/image";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface DialogProp {
    open: boolean;
    service?: Service;
    businessId: string;
    mode?: "edit" | "add";
    setOpen: (val: boolean) => void;
}

export default function ServiceDialog({ open, setOpen, mode = "add", service, businessId }: DialogProp) {
    const addDesc = "Create a new offering for your customers. Fill in the details below to list this service on your booking profile.";
    const editDesc = "Update the details of your service. These changes will reflect on your business page immediately.";

    const addBtn = "Add Service";
    const editBtn = "Save Changes";

    const [banner, setBanner] = useState<BannerUpload | null>(null);
    const bannersRef = useRef<BannerUpload | null>(null);

    const existingThumbnailUrl = mode === "edit" && service?.thumbnail ? service.thumbnail : null;

    useEffect(() => {
        return () => {
            if (bannersRef.current) URL.revokeObjectURL(bannersRef.current.previewUrl);
        };
    }, []);

    useEffect(() => {
        bannersRef.current = banner;
    }, [banner]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const MAX_BYTES = 5 * 1024 * 1024;

        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_BYTES) {
            toast.error("The image exceeds 5MB limit");
        }

        const newEntries: BannerUpload = {
            file,
            id: crypto.randomUUID(),
            previewUrl: URL.createObjectURL(file),
        };

        if (banner) {
            URL.revokeObjectURL(banner.previewUrl);
        }

        setBanner(newEntries);

        e.target.value = "";
    };

    const clearImage = () => {
        if (banner) URL.revokeObjectURL(banner.previewUrl);
        setBanner(null);
    };

    const { mutate: createService } = useCreateService();
    const { mutate: updateService } = useUpdateService();

    const [errors, setErrors] = useState<Partial<Record<"name" | "price" | "category" | "durationInMinutes", string>>>({});

    // Todo: upload image
    function handleSubmitForm(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData);

        const rawName = (payload["name"] as string) ?? "";
        const rawPrice = payload["price"] as string;
        const rawCategory = (payload["category"] as string) ?? "";
        const rawDuration = payload["durationInMinutes"] as string;

        const parsedPrice = Number(rawPrice);
        const parsedDuration = Number(rawDuration);
        const trimmedName = rawName.trim();
        const trimmedCategory = rawCategory.trim();

        const next: typeof errors = {};

        if (!trimmedName) next.name = "Service name is required";
        if (!trimmedCategory) next.category = "Category is required";
        if (!Number.isFinite(parsedPrice) || parsedPrice < 0.01) next.price = "Price must be at least $0.01";
        if (!Number.isFinite(parsedDuration) || parsedDuration < 1 || !Number.isInteger(parsedDuration)) next.durationInMinutes = "Duration must be a whole number of at least 1 minute";

        setErrors(next);
        if (Object.keys(next).length > 0) return;

        const data = { name: trimmedName, price: parsedPrice, category: trimmedCategory, durationInMinutes: parsedDuration, businessId };

        if (mode === "add") {
            createService(data, { onSuccess: () => setOpen(false) });
        } else if (mode === "edit" && service) {
            updateService({ id: service.id, service: data }, { onSuccess: () => setOpen(false) });
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(v) => {
                setOpen(v);
                if (!v) setErrors({});
            }}
        >
            <DialogContent className="sm:max-w-125">
                <form onSubmit={handleSubmitForm}>
                    <DialogHeader className="mb-4">
                        <DialogTitle>{mode === "add" ? "Add" : "Edit"} Service</DialogTitle>
                        <DialogDescription>{mode === "add" ? addDesc : editDesc}</DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <Label htmlFor="service-name">Service Name</Label>
                                <Input name="name" defaultValue={mode === "edit" ? service?.name : undefined} id="service-name" placeholder="e.g. Men's Haircut" />
                                {errors.name && <p className="text-destructive mt-1 text-xs">{errors.name}</p>}
                            </Field>

                            <Field>
                                <Label htmlFor="service-price">Price ($)</Label>
                                <Input name="price" min={0} step={0.01} defaultValue={mode === "edit" ? service?.price : undefined} id="service-price" type="number" placeholder="0.00" />
                                {errors.price && <p className="text-destructive mt-1 text-xs">{errors.price}</p>}
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <Label htmlFor="service-duration">Duration (min)</Label>
                                <Input name="durationInMinutes" defaultValue={mode === "edit" ? service?.durationInMinutes : undefined} id="service-duration" type="number" placeholder="30" />
                                {errors.durationInMinutes && <p className="text-destructive mt-1 text-xs">{errors.durationInMinutes}</p>}
                            </Field>

                            <Field>
                                <Label htmlFor="service-category">Category</Label>
                                <Input name="category" defaultValue={mode === "edit" ? service?.category : undefined} id="service-category" placeholder="e.g. Hair" />
                                {errors.category && <p className="text-destructive mt-1 text-xs">{errors.category}</p>}
                            </Field>
                        </div>

                        <Field>
                            <Label htmlFor="service-thumbnail">Thumbnail Image</Label>
                            <div className="relative">
                                <Input id="service-thumbnail" type="file" accept="image/*" onChange={handleFileChange} className="cursor-pointer text-transparent file:cursor-pointer file:font-semibold" />
                                <span className="pointer-events-none absolute top-1/2 left-32 -translate-y-1/2 text-sm text-zinc-500">{banner ? banner.file.name : "No file selected"}</span>
                            </div>

                            {banner && (
                                <div className="relative aspect-video h-24 overflow-hidden rounded-xl border">
                                    <Image src={banner.previewUrl} alt="Preview" fill className="object-contain" />
                                    <button onClick={clearImage} title="Remove Thumbnail Image" type="button" className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white hover:bg-black">
                                        <Plus className="size-3 rotate-45" />
                                    </button>
                                </div>
                            )}

                            {existingThumbnailUrl && (
                                <div className="relative aspect-video h-24 overflow-hidden rounded-xl border">
                                    <Image src={existingThumbnailUrl} alt="Preview" fill className="object-contain" />
                                    <button onClick={clearImage} title="Remove Thumbnail Image" type="button" className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white hover:bg-black">
                                        <Plus className="size-3 rotate-45" />
                                    </button>
                                </div>
                            )}
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="mt-8">
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button type="submit">{mode === "add" ? addBtn : editBtn}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
