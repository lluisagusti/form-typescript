"use client";

import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { Prediction } from "replicate";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Home() {

  const [formData, setFormData] = useState({ task: "", image: "", question: "" });
  const [file, setFile] = useState<File>()
  const [filePath, setFilePath] = useState<string>("")
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [blipPrediction, setBlipPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState(null);

  const handleSubmitSDXLForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("/api/predictions", {
      method: "POST",
      body: new FormData(e.currentTarget),
    });

    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
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
        setError(prediction.detail);
        return;
      }
      setPrediction(prediction);
    }
  };

  const handleBlipFormData = async (e: any) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  }

  const handleSubmitBlipForm = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log(`Task: ${formData.task}, Image: ${formData.image}, Question: ${formData.question}`
    );

    const preReq = new FormData();
    preReq.append('task', 'visual_question_answering');
    preReq.append('image', 'https://replicate.delivery/pbxt/KSaykYnRdE6r9lbO5qjW3ERhOTsQaFRYKIugg9GpxlUdJq7Y/valerie-vomit.jpg');
    preReq.append('question', formData?.question);

    const response = await fetch("/api/vision", {
      method: "POST",
      body: preReq,
    });

    let blipPrediction = await response.json();
    if (response.status !== 201) {
      setError(blipPrediction.detail);
      return;
    }
    setBlipPrediction(prediction);

    while (
      blipPrediction.status !== "succeeded" &&
      blipPrediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + blipPrediction?.id, { cache: 'no-store' });
      blipPrediction = await response.json();
      if (response.status !== 200) {
        setError(blipPrediction.detail);
        return;
      }
      setBlipPrediction(blipPrediction);
    }
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
  
      {/* UPLOAD FILE DIV */}
      <div className="flex flex-col z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex bg-white p-10 border-solid border-2 border-gray-300 rounded-3xl">
        <p className="mb-4 text-lg text-gray-700">
        Upload File{" "}
          <a href="https://nextjs.org/docs" className="text-blue-500 hover:underline">
            Next.js
          </a>:
        </p>

        <form onSubmit={onSubmitFile} className="flex flex-col items-center w-full">
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

        {filePath?.length > 3 && (
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
            <p className="mt-4 text-xs text-gray-700">status: uploaded at: {filePath}</p>
          </div>
        )}
      </div>


      {/* BLIP DIV */}
      <div className="flex flex-col pt-10 z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex bg-white p-10 border-solid border-2 border-gray-300 rounded-3xl">
        <p className="mb-4 text-lg text-gray-700">
          Get data with{" "}
          <a href="https://replicate.com/salesforce/blip" className="text-blue-500 hover:underline">
            Blip
          </a>:
        </p>

        <form onSubmit={handleSubmitBlipForm} className="flex flex-col items-center w-full">
          <input
            type="text"
            name="question"
            placeholder="Question"
            onChange={handleBlipFormData}
            className="px-4 py-2 text-black w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 mt-4 w-full bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Read
          </button>
        </form>

        {/* {error && <div className="mt-4 text-red-500">{error}</div>} */}

        {blipPrediction && (
          <div className="mt-4">
            {blipPrediction?.output && (
              <div className="flex flex-col text-black items-center justify-center w-full">
                {blipPrediction?.output}
              </div>
            )}
            <p className="mt-4 text-xs text-gray-700">status: {blipPrediction.status}</p>
          </div>
        )}
      </div>

      
      {/* STABLE DIFFUSION DIV */}
      <div className="flex flex-col b-10 z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex bg-white p-10 border-solid border-2 border-gray-300 rounded-3xl">
        <Head>
          <title>Replicate + Next.js</title>
        </Head>

        <p className="mb-4 text-lg text-gray-700">
          Generate with{" "}
          <a href="https://replicate.com/stability-ai/stable-diffusion" className="text-blue-500 hover:underline">
            SDXL
          </a>:
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

        {error && <div className="mt-4 text-red-500">{error}</div>}

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
