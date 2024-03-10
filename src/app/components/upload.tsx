"use client";

import Image from "next/image"
import { useState } from "react"
import { Button, Grid, GridColumn, GridRow, Input } from "semantic-ui-react"

const UploadForm = ({ urlString }: any) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0])
    setImageUrl(null)
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!file) return

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/s3-upload", {
        method: "POST",
        body: formData
      });

      const data: any = await response.json();
      const { url } = data
      setImageUrl(url)
      setUploading(false)
      urlString(url)
    } catch (error) {
      console.log(error)
      setUploading(false)
    }
  }  

  return (
    <>
      
      {!imageUrl?.length && <div className="text-black p-5">
            <Grid columns={1} textAlign='center'>
              <GridRow verticalAlign='middle'>
                <Input type="file" onChange={handleFileChange} />
                <Button onClick={handleSubmit} disabled={!file || uploading} >{uploading ? "Uploading..." : "Upload"}</Button>
              </GridRow>
            </Grid>
          </div>}

      {imageUrl?.length && <div className="mt-4, text-black">
              <div className="flex flex-col items-center justify-center w-full">
                <Image
                  src={imageUrl?.toString()}
                  alt="output"
                  width={250}
                  height={250}
                />
              </div>
          </div>}
      
    </>
  );
};

export default UploadForm