import OpenAI from 'openai'

// Create an OpenAI API client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export const runtime = 'edge'

export async function POST(req: any) {
    const data = await req.formData()
    const url = data.get("url")

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        // stream: true,
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "What are the colors of the clothes, hair, eyes, skin tone, age and face shape? Your response will be: Hair:[hair color], Eyes:[eyes color], Skin:[skin tone], Clothes: [clothes color], Age: [age], FaceShape: [face shape]"
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: url
                        }
                    }
                ]
            }
        ],
    })

    return new Response(
        JSON.stringify(response),
        { status: 201 }
    );
}
