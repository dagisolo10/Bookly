import { createSupabaseServerClient } from "./server";

export async function uploadImage(files: Express.Multer.File[], path: string, bucket: string) {
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

        return publicUrls;
    } catch (error) {
        if (uploadedPaths.length > 0) await supabase.storage.from(bucket).remove(uploadedPaths);
        throw error;
    }
}
