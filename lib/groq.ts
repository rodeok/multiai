import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface GroqResponse {
  content: string;
  model: string;
}

export async function generateResponse(
  message: string,
  model: string
): Promise<GroqResponse> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      model: model,
      temperature: 0.7,
      max_tokens: 2000,
    });

    return {
      content: completion.choices[0]?.message?.content || '',
      model,
    };
  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error('Failed to generate response');
  }
}