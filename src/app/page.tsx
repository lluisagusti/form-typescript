"use client";

import { useState } from "react"
import Image from "next/image"
import { Prediction } from "replicate"
import { VisionFormData } from "./types";
import { sleep } from "./utils/utils";
import UploadComponent from "./components/upload";


export default function Home() {

  const [file, setFile] = useState<File>()
  const [generationError, setGenerationError] = useState(null)
  const [formData, setFormData] = useState<VisionFormData>({ image: "", prompt: "", max_tokens: 1024, temperature: 0.2, top_p: 1 });
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [filePath, setFilePath] = useState<string | null>(null)
  const [visionResponse, setVisionResponse] = useState<string | null>(null)


  const handleSubmitSDXLForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("/api/bluepencilxl", {
      method: "POST",
      body: new FormData(e.currentTarget),
    });

    let prediction = await response.json();
    if (response.status !== 201) {
      setGenerationError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id, { cache: 'no-store' });
      prediction = await response.json();
      if (response.status !== 200) {
        setGenerationError(prediction.detail);
        return;
      }
      setPrediction(prediction);
    }
  }

  const handleVisionFormData = async (e: any) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }

  const handleSubmitVisionForm = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()

    const data = new FormData()
    data.append('image', 'https://replicate.delivery/pbxt/KSvbd6jO4nZIP5JCyhV6Dvf440hbmtocuQtPbp9pGJezFAzO/IMG_4652%20-%20restored.jpg')
    data.append('prompt', formData?.prompt) // Hair and eyes color. Response: "Hair: [hair color]. Eyes: [eyes color]"

    const response: any = await fetch("/api/llava16vicuna7b", {
      method: "POST",
      body: data,
    })

    let visionPrediction = await response.json()
    if (response.status !== 201) {
      setVisionResponse("no result")
      return
    }

    setVisionResponse(visionPrediction.detail.join(""))
    return
  }

  const onSubmitFile = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return

    try {
      const data = new FormData()
      data.set('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      })

      let uploadPath = await res.json();
      uploadPath?.path && setFilePath(uploadPath.path)
      if(!res.ok) throw new Error(await res.text())
      
    } catch (error: any) {
      console.error(error)
    }
  }


  return (
    <main className="flex min-h-screen flex-col items-center p-4 justify-center bg-gray-100">

      <UploadComponent />
  
      {/* UPLOAD FILE (S3 NEEDED) */}
      <div className="flex flex-col z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex p-10">
        <p className="mb-4 text-lg text-gray-700">
        Upload File (
          <a href="https://nextjs.org/docs" className="text-blue-500 hover:underline">
            Next.js
          </a>)
        </p>

        <form onSubmit={onSubmitFile} className="flex flex-col items-center w-full text-black">
          <input
            type="file"
            name="file"
            onChange={(e) => setFile(e.target.files?.[0])}
          />
          <button
            type="submit"
            className="px-4 py-2 mt-4 w-full bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Upload
          </button>
        </form>

        {filePath?.length && (
          <div className="mt-4">
              <div className="flex flex-col text-black items-center justify-center w-full">
                <Image
                  src={filePath?.toString()}
                  alt="output"
                  width={500}
                  height={500}
                  className="object-cover w-full h-full rounded-md border-gray-300"
                />
              </div>
              <div className="flex flex-col text-black items-center justify-center w-full">
              url: {filePath}
              <p className="mt-4 text-xs text-gray-700">status: success</p>
            </div>
          </div>
        )}
      </div>


      {/* VISION: llava-v1.6-vicuna-7b */}
      <div className="flex flex-col pt-10 z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex p-10">
        <p className="mb-4 text-lg text-gray-700">
          Ask to image (
          <a href="https://replicate.com/yorickvp/llava-v1.6-vicuna-7b" className="text-blue-500 hover:underline">
          llava-v1.6-vicuna-7b
          </a>)
        </p>

        <form onSubmit={handleSubmitVisionForm} className="flex flex-col items-center w-full">
          <input
            type="text"
            name="prompt"
            placeholder="Prompt"
            onChange={handleVisionFormData}
            className="px-4 py-2 text-black w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 mt-4 w-full bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Ask
          </button>
        </form>

        {visionResponse && (
          <div className="mt-4">
            {visionResponse?.length && (
              <div className="flex flex-col text-black items-center justify-center w-full">
                {visionResponse}
              </div>
            )}
            <p className="mt-4 text-xs text-gray-700">status: success</p>
          </div>
        )}
      </div>

      
      {/* IMAGE GENERATION OR IMG2IMG */}
      <div className="flex flex-col b-10 z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex p-10">
        <p className="mb-4 text-lg text-gray-700">
          Generate (
          <a href="https://replicate.com/stability-ai/stable-diffusion" className="text-blue-500 hover:underline">
            SDXL
          </a>)
        </p>

        <form onSubmit={handleSubmitSDXLForm} className="flex flex-col items-center w-full">
          <input
            type="text"
            name="prompt"
            placeholder="Prompt"
            className="px-4 py-2 text-black w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 mt-4 w-full bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Generate
          </button>
        </form>

        {generationError && <div className="mt-4 text-red-500">{generationError}</div>}

        {prediction && (
          <div className="mt-4">
            {prediction.output && (
              <div className="flex flex-col items-center justify-center w-full">
                <Image
                  src={prediction.output[prediction.output.length - 1]}
                  alt="output"
                  width={500}
                  height={500}
                  className="object-cover w-full h-full rounded-md border-gray-300"
                />
              </div>
            )}
            <p className="mt-4 text-xs text-gray-700">status: {prediction.status}</p>
          </div>
        )}
      </div>

    </main>
  )
}
