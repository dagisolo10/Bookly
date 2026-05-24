"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateService, useUpdateService } from "@/hooks/tan stack/use-owner-service";
import type { Service } from "@/types/models";
import { SyntheticEvent, useState } from "react";

interface DialogProp {
    open: boolean;
    service?: Service;
    businessId: string;
    mode?: "edit" | "add";
    setOpen: (val: boolean) => void;
}

export default function ServiceDialog({ open, setOpen, mode = "add", service, businessId }: DialogProp) {
    const addDesc = "Create a new offering for your clients. Fill in the details below to list this service on your booking profile.";
    const editDesc = "Update the details of your service. These changes will reflect on your business page immediately.";

    const addBtn = "Add Service";
    const editBtn = "Save Changes";

    const { mutate: createService } = useCreateService();
    const { mutate: updateService } = useUpdateService();

    const [errors, setErrors] = useState<Partial<Record<"name" | "price" | "category" | "durationInMinutes", string>>>({});

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
        if (!Number.isFinite(parsedDuration) || parsedDuration < 1 || !Number.isInteger(parsedDuration))
            next.durationInMinutes = "Duration must be a whole number of at least 1 minute";

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
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setErrors({}); }}>
            <DialogContent className="sm:max-w-125">
                <form onSubmit={handleSubmitForm}>
                    <DialogHeader className="mb-4">
                        <DialogTitle>{mode === "add" ? "Add" : "Edit"} Service</DialogTitle>
                        <DialogDescription>{mode === "add" ? addDesc : editDesc}</DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <Label htmlFor="service-name">Service Name</Label>
                                <Input
                                    name="name"
                                    defaultValue={mode === "edit" ? service?.name : undefined}
                                    id="service-name"
                                    placeholder="e.g. Men's Haircut"
                                />
                                {errors.name && <p className="text-destructive mt-1 text-xs">{errors.name}</p>}
                            </Field>

                            <Field>
                                <Label htmlFor="service-price">Price ($)</Label>
                                <Input
                                    name="price"
                                    min={0}
                                    step={0.01}
                                    defaultValue={mode === "edit" ? service?.price : undefined}
                                    id="service-price"
                                    type="number"
                                    placeholder="0.00"
                                />
                                {errors.price && <p className="text-destructive mt-1 text-xs">{errors.price}</p>}
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <Label htmlFor="service-duration">Duration (min)</Label>
                                <Input
                                    name="durationInMinutes"
                                    defaultValue={mode === "edit" ? service?.durationInMinutes : undefined}
                                    id="service-duration"
                                    type="number"
                                    placeholder="30"
                                />
                                {errors.durationInMinutes && <p className="text-destructive mt-1 text-xs">{errors.durationInMinutes}</p>}
                            </Field>

                            <Field>
                                <Label htmlFor="service-category">Category</Label>
                                <Input
                                    name="category"
                                    defaultValue={mode === "edit" ? service?.category : undefined}
                                    id="service-category"
                                    placeholder="e.g. Hair"
                                />
                                {errors.category && <p className="text-destructive mt-1 text-xs">{errors.category}</p>}
                            </Field>
                        </div>
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
