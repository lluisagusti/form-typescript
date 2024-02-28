import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/* eslint-disable */
const s3Client = new S3Client({
    region: process.env.S3_UPLOAD_REGION,
    credentials: {
        accessKeyId: process.env.S3_UPLOAD_KEY,
        secretAccessKey: process.env.S3_UPLOAD_SECRET,
    }
})
/* eslint-disable */

async function uploadFileToS3(file: any, fileName: any) {

    const fileBuffer = file;

    const params = {
        Bucket: process.env.S3_UPLOAD_BUCKET,
        Key: `${fileName}`,
        Body: fileBuffer,
        ContentType: "image/jpg"
    }

    const command = new PutObjectCommand(params);
    const responses3 = await s3Client.send(command);
    return fileName;
}

export async function POST(request: any) {
    try {

        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "File is required." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileData = await uploadFileToS3(buffer, file.name);

        return NextResponse.json({ success: true, fileData });
    } catch (error) {
        return NextResponse.json({ error });
    }
}