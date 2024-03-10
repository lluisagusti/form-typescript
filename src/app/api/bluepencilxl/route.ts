import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {

  const data = await req.formData()
  const prompt = data.get("prompt")
  // const num_outputs = data.get("num_outputs")

  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
    );
  }

  const input = { prompt: prompt, num_outputs: 4 }

  console.log('PROMPT @ API >>>>>>>>>>>>>>>>>>>> ', input)

  const prediction = await replicate.predictions.create({
    version: "06db33e3cd56700e2b0de541e65e2fc377604bebc97eb87b40e1d190fafa7ef4",
    input: input,
  });

  if (prediction?.error) {
    return new Response(
      JSON.stringify({ detail: prediction.error.detail }),
      { status: 500 }
    );
  }

  return new Response(
    JSON.stringify(prediction),
    { status: 201 }
  );
}
