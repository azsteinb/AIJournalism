import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    organization: "YOUR_ORG_ID",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Gets a news topic using openai
 * @returns A topic
 */
export async function getTopic(){
	const topic = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: "Please come up with a one word, random news topic",
		temperature: 0.65,
  		max_tokens: 150,
  		top_p: 1.0,
  		frequency_penalty: 0.0,
  		presence_penalty: 0.0,
	  });
	return topic
}