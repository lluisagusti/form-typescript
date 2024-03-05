"use client";

import Image from "next/image";
import { useState } from "react";

const UploadForm = ({ urlString }: any) => {
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
      const { url } = data
      setImageUrl(url)
      setUploading(false);
      urlString(url)
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  }  

  return (
    <>
      {/* <h1 className="text-black">Upload Files to S3 Bucket</h1> */}

      {!imageUrl?.length && (<form onSubmit={handleSubmit} className="text-black p-5">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button className="ui button" type="submit" disabled={!file || uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>)}

      {imageUrl?.length && (
          <div className="mt-4, text-black">
              <div className="flex flex-col items-center justify-center w-full">
                <Image
                  src={imageUrl?.toString()}
                  alt="output"
                  width={250}
                  height={250}
                  className="object-cover w-full h-full rounded-md border-gray-300"
                />
              </div>
              <div className="flex flex-col items-center justify-center w-full p-5">
              url: {imageUrl}
              {/* <p className="mt-4 text-xs text-gray-700">status: success</p> */}
            </div>
          </div>
        )}
    </>
  );
};

export default UploadForm;