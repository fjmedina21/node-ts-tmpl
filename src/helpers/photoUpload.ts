import { v2, UploadApiResponse } from "cloudinary";
import { UploadedFile } from "express-fileupload";

const cloudinary = v2;
cloudinary.config("process.env.CLOUDINARY_URL");

function validateFileExt(file: UploadedFile) {
    try {
        const validExtensions = ["jpg", "jpeg", "webp", "png", "svg"];
        const [, ext] = file.name.split('.');

        if (!validExtensions.includes(ext.toLocaleLowerCase())) throw new Error("Invalid file type");
    } catch (error: unknown) {
        if (error instanceof Error) return Promise.reject(error.message);
    }
}

export async function photoUpload(file: UploadedFile, subfolder: string | string) {
    const result = validateFileExt(file);
    if (result) return result;

    const { tempFilePath } = file;
    const data = await cloudinary.uploader.upload(tempFilePath, { folder: `bibloslibrary/${subfolder}` });
    return data;
}

export async function photoDelete(public_id: string): Promise<void | undefined> {
    await cloudinary.uploader.destroy(public_id)
        .catch((reason: unknown) => { return Promise.reject(reason); });
}

export async function photoUpdate(public_id: string, file: UploadedFile, subfolder: string): Promise<undefined> {
    const result = validateFileExt(file);
    if (result) return result;

    await cloudinary.uploader.destroy(public_id)
        .then(async () => {
            await photoUpload(file, subfolder)
                .then((data) => { return data; })
                .catch((reason) => { return Promise.reject(reason); });
        })
        .catch((reason: unknown) => { return Promise.reject(reason); });

}