const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.newArticle = async (oldArticle) => {
	const newArticle = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: "Rewrite the following article with no more than 300 words(but at least 150 words) and do not make any assumptions. " + 
		"Format the data with <h3> headings for the start of each paragraph after the initial one. If there are any citations in the original article, be sure to cite them in the rewrite."
		+ " Here is the article:" + oldArticle,
		temperature: 0.65,
  		max_tokens: 1500,
  		top_p: 1.0,
  		frequency_penalty: 0.0,
  		presence_penalty: 0.0,
	  });
	return newArticle
}