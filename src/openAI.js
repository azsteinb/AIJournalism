const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Gets a news topic using openai
 * @returns A topic
 */
exports.getTopic = async () => {
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

exports.newArticle = async (oldAritcle) => {
	const newArticle = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: "Write an article(150 words) based on the following description, don't make any wild assumptions: \n\n" + oldAritcle,
		temperature: 0.65,
  		max_tokens: 350,
  		top_p: 1.0,
  		frequency_penalty: 0.0,
  		presence_penalty: 0.0,
	  });
	return newArticle
}