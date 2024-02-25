import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {

    const data = await req.formData();
    if (!process.env.REPLICATE_API_TOKEN) {
        throw new Error(
            "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
        );
    }

    const prediction = await replicate.predictions.create({
        version: "2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
        input: {
            task: data.get("task"),
            image: data.get("image"),
            question: data.get("question")
        },
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
