export function generateTimeSlots(open: string, close: string, duration: number, step: number): string[] {
    const toMinutes = (t: string) => {
        const [h, m] = t.split(":").map(Number);
        return (h ?? 0) * 60 + (m ?? 0);
    };

    const openMin = toMinutes(open);
    const closeMin = toMinutes(close);
    const slots: string[] = [];

    for (let start = openMin; start + duration <= closeMin; start += step) {
        const h = Math.floor(start / 60);
        const m = start % 60;
        slots.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    }
    return slots;
}
