import Replicate from "replicate"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(req: Request) {

  const data = await req.formData()
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
    )
  }

  const prediction = await replicate.run(
    "yorickvp/llava-v1.6-vicuna-7b:27add3e273925bd1e1635b75dc3b7c32be13d5c26e2c613a7e0e06fa0299c5fb",
    {
      input: {
        image: data.get("image"),
        prompt: data.get("prompt")
      }
    }
  )

  if (!prediction) {
    return new Response(
      JSON.stringify({ detail: "no result" }),
      { status: 500 }
    );
  }

  return new Response(
    JSON.stringify({ detail: prediction }),
    { status: 201 }
  )
}
