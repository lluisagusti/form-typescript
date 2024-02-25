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
    "yorickvp/llava-13b:a0fdc44e4f2e1f20f2bb4e27846899953ac8e66c5886c5878fa1d6b73ce009e5",
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
