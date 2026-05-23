"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateService, useUpdateService } from "@/hooks/use-owner-service";
import { Service } from "@/types/models";
import { SyntheticEvent } from "react";

interface DialogProp {
    open: boolean;
    service?: Service;
    businessId: string;
    mode?: "edit" | "add";
    setOpen: (val: boolean) => void;
}

export function ServiceDialog({ open, setOpen, mode = "add", service, businessId }: DialogProp) {
    const addDesc = "Create a new offering for your clients. Fill in the details below to list this service on your booking profile.";
    const editDesc = "Update the details of your service. These changes will reflect on your business page immediately.";

    const addBtn = "Add Service";
    const editBtn = "Save Changes";

    const { mutate: createService } = useCreateService();
    const { mutate: updateService } = useUpdateService();

    function handleSubmitForm(e: SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const payload = Object.fromEntries(formData);

        const name = payload["name"] as string;
        const price = Number(payload["price"]);
        const category = payload["category"] as string;
        const durationInMinutes = Number(payload["durationInMinutes"]);

        const data = { name, price, category, durationInMinutes, businessId };

        if (mode === "add") {
            createService(data);
        } else if (mode === "edit" && service) {
            updateService({
                id: service.id,
                service: data,
            });
        }

        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                            </Field>

                            <Field>
                                <Label htmlFor="service-category">Category</Label>
                                <Input
                                    name="category"
                                    defaultValue={mode === "edit" ? service?.category : undefined}
                                    id="service-category"
                                    placeholder="e.g. Hair"
                                />
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
