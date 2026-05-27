import { createSupabaseServerClient } from "./server";

type UploadResult = { success: true; images: string[] } | { success: false; error: string };

export async function uploadImages(files: Express.Multer.File[], path: string, bucket: string): Promise<UploadResult> {
    const supabase = createSupabaseServerClient();
    const publicUrls: string[] = [];
    const uploadedPaths: string[] = [];

    try {
        for (const file of files) {
            const unique = crypto.randomUUID();
            const fileExt = file.originalname.split(".").pop();
            const fileName = `${file.originalname.split(".")[0]}-${unique}.${fileExt}`;
            const filePath = `${path}/${fileName}`;

            const { error } = await supabase.storage.from(bucket).upload(filePath, file.buffer, {
                contentType: file.mimetype,
            });

            if (error) throw new Error(`Upload failed: ${error.message}`);

            uploadedPaths.push(filePath);

            const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

            publicUrls.push(data.publicUrl);
        }

        return { images: publicUrls, success: true };
    } catch (err) {
        if (uploadedPaths.length > 0) {
            await supabase.storage.from(bucket).remove(uploadedPaths);
        }
        const message = err instanceof Error ? err.message : "Unknown upload error";
        return { success: false, error: message };
    }
}

export async function removeImages(urls: string[], bucket: string) {
    const supabase = createSupabaseServerClient();

    const paths = urls
        .map((url) => {
            try {
                const decodedUrl = decodeURIComponent(url);
                const splitKey = `/storage/v1/object/public/${bucket}/`;
                const parts = decodedUrl.split(splitKey);

                if (parts.length < 2) return null;

                const path = parts[1];
                return path || null;
            } catch {
                return null;
            }
        })
        .filter((path): path is string => Boolean(path));

    if (paths.length === 0) return;

    const { error } = await supabase.storage.from(bucket).remove(paths);

    if (error) {
        throw new Error(`Image removal failed: ${error.message}`);
    }
}
