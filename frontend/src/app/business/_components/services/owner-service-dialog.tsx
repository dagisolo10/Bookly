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
    const [removeExistingThumbnail, setRemoveExistingThumbnail] = useState(false);
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
            return;
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

    const removeExisting = () => setRemoveExistingThumbnail(true);

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
            const updatePayload = removeExistingThumbnail ? { ...data, thumbnail: null } : data;
            updateService({ id: service.id, service: updatePayload }, { onSuccess: () => setOpen(false) });
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(v) => {
                setOpen(v);
                if (!v) setErrors({});
                if (v) setRemoveExistingThumbnail(false);
            }}
        >
            <DialogContent className="sm:max-w-125">
                <form key={service?.id ?? "add"} onSubmit={handleSubmitForm}>
                    <DialogHeader className="mb-4">
                        <DialogTitle>{mode === "add" ? "Add" : "Edit"} Service</DialogTitle>
                        <DialogDescription>{mode === "add" ? addDesc : editDesc}</DialogDescription>
                    </DialogHeader>

                    <FieldGroup className="gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Field className="gap-1">
                                <Label className="text-xs" htmlFor="service-name">
                                    Service Name
                                </Label>
                                <Input name="name" defaultValue={mode === "edit" ? service?.name : undefined} id="service-name" placeholder="e.g. Men's Haircut" />
                                {errors.name && <p className="text-destructive mt-1 text-xs">{errors.name}</p>}
                            </Field>

                            <Field className="gap-1">
                                <Label className="text-xs" htmlFor="service-price">
                                    Price ($)
                                </Label>
                                <Input name="price" min={0} step={0.01} defaultValue={mode === "edit" ? service?.price : undefined} id="service-price" type="number" placeholder="0.00" />
                                {errors.price && <p className="text-destructive mt-1 text-xs">{errors.price}</p>}
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Field className="gap-1">
                                <Label className="text-xs" htmlFor="service-duration">
                                    Duration (min)
                                </Label>
                                <Input name="durationInMinutes" defaultValue={mode === "edit" ? service?.durationInMinutes : undefined} id="service-duration" type="number" placeholder="30" />
                                {errors.durationInMinutes && <p className="text-destructive mt-1 text-xs">{errors.durationInMinutes}</p>}
                            </Field>

                            <Field className="gap-1">
                                <Label className="text-xs" htmlFor="service-category">
                                    Category
                                </Label>
                                <Input name="category" defaultValue={mode === "edit" ? service?.category : undefined} id="service-category" placeholder="e.g. Hair" />
                                {errors.category && <p className="text-destructive mt-1 text-xs">{errors.category}</p>}
                            </Field>
                        </div>

                        <Field className="gap-2">
                            <Label className="text-xs">Thumbnail Image</Label>
                            <div className="flex items-center gap-3">
                                <Input id="service-thumbnail" type="file" accept="image/*" onChange={handleFileChange} className="sr-only" aria-describedby="service-thumbnail-name" />
                                <Label htmlFor="service-thumbnail" className="hover:bg-muted cursor-pointer rounded-lg border px-4 py-2 text-xs font-medium transition-colors">
                                    Choose File
                                </Label>
                                <span id="service-thumbnail-name" aria-live="polite" className="text-muted-foreground text-xs">
                                    {banner ? banner.file.name : "No file selected"}
                                </span>
                            </div>

                            {banner && (
                                <div>
                                    <span className="text-muted-foreground mb-1 block text-xs font-medium">New thumbnail (unsaved)</span>
                                    <div className="relative aspect-video h-24 overflow-hidden rounded-xl border">
                                        <Image src={banner.previewUrl} alt="New thumbnail preview" fill className="object-contain" />
                                        <button onClick={clearImage} title="Remove new thumbnail" type="button" className="text-background hover:bg-foreground absolute top-1 right-1 rounded-full bg-black/50 p-1">
                                            <Plus className="size-3 rotate-45" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {!banner && existingThumbnailUrl && !removeExistingThumbnail && (
                                <div className="">
                                    <span className="text-muted-foreground mb-1 block text-xs font-medium">Current thumbnail</span>
                                    <div className="relative mx-auto aspect-video h-24 overflow-hidden rounded-xl">
                                        <Image src={existingThumbnailUrl} alt="Current thumbnail" fill className="object-contain" />
                                        <button onClick={removeExisting} title="Remove current thumbnail" type="button" className="text-background hover:bg-foreground bg-foreground/50 absolute top-0 right-1 rounded-full p-1">
                                            <Plus className="size-3 rotate-45" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="mt-8">
                        <DialogClose asChild>
                            <Button variant="outline" className="text-xs" type="button">
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button className="text-xs" type="submit">
                            {mode === "add" ? addBtn : editBtn}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
