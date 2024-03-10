import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export const runtime = 'edge'

export async function POST(req: any) {
    const data = await req.formData()
    const url = data.get("url")

    const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        // stream: true,
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "Respond with the following information about the image: Hair:[hair color], Glasses: [glasses ? true : false], Eyes: [eyes color], FaceShape: [face shape], Clothes: [clothes color]"
                        // , Skin: [skin tonality]
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
