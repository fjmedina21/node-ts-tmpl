import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { UploadedFile } from "express-fileupload";

import { ErrorHandler } from '../helpers';
import { config } from "../config";

cloudinary.config({
    cloud_name: config.CLOUDINARY_NAME,
    api_key: config.CLOUDINARY_KEY,
    api_secret: config.CLOUDINARY_SECRET,
    //secure: true
});

function validateFileExt(file: UploadedFile) {
    try {
        const validExtensions = ["jpg", "jpeg", "webp", "png", "svg"];
        const [, ext] = file.name.split('.');

        if (!validExtensions.includes(ext.toLocaleLowerCase())) throw new ErrorHandler("Tipo de archivo no válido.", 400);
    } catch (error: unknown) {
        if (error instanceof ErrorHandler) return Promise.reject(error);
    }
}

export async function PhotoUpload(file: UploadedFile, subfolder: string): Promise<UploadApiResponse> {
    const error = validateFileExt(file);
    if (error) return error;

    const { tempFilePath } = file;
    return await cloudinary.uploader.upload(tempFilePath, { folder: `typeorm/${subfolder}` });
}

export async function PhotoDelete(public_id: string): Promise<void> {
    await cloudinary.uploader.destroy(public_id)
        .catch((reason: unknown) => { return Promise.reject(reason); });
}

export async function PhotoUpdate(public_id: string | null, file: UploadedFile, subfolder: string): Promise<UploadApiResponse> {
    const error = validateFileExt(file);
    if (error) return error;

    if (public_id) await PhotoDelete(public_id);
    return await PhotoUpload(file, subfolder);
}