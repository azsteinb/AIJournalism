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

exports.newArticle = async (oldArticle) => {
	const newArticle = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: "Rewrite the following article in a concise format with no more than 300 words(but at least 200 words) and do not make any assumptions. " + 
		"Keep in mind, the article text might start with other irrelevant data like a cookies warning. You don't need to focus on that. Format it nicely."
		+ " Here is the article:" + oldArticle,
		temperature: 0.65,
  		max_tokens: 1000,
  		top_p: 1.0,
  		frequency_penalty: 0.0,
  		presence_penalty: 0.0,
	  });
	return newArticle
}