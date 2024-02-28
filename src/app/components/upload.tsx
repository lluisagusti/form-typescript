"use client";

import Image from "next/image";
import { useState } from "react";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
    setImageUrl(null)
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/s3-upload", {
        method: "POST",
        body: formData,
      });

      const data: any = await response.json();
      console.log('UploadForm 2 >> ', data);
      data?.url ?? console.log('data.url >> ', data.url);
      const { url } = data
      console.log('url :>> ', url);
      setImageUrl(url)
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  }

  return (
    <>
      <h1>Upload Files to S3 Bucket</h1>

      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={!file || uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {imageUrl?.length && (
          <div className="mt-4">
              <div className="flex flex-col text-black items-center justify-center w-full">
                <Image
                  src={imageUrl?.toString()}
                  alt="output"
                  width={500}
                  height={500}
                  className="object-cover w-full h-full rounded-md border-gray-300"
                />
              </div>
              <div className="flex flex-col text-black items-center justify-center w-full">
              url: {imageUrl}
              <p className="mt-4 text-xs text-gray-700">status: success</p>
            </div>
          </div>
        )}
    </>
  );
};

export default UploadForm;