// const aimodel = require('./openAI.js');
import { getTopic } from './openAI.js';

const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWSAPI_API_KEY);

export async function getArticle(req, res) {
	// Check if any optional parameters were passed in.
	// Author, Topic, Max Words
	const author = (req.query.author === undefined) ? "Something Inc." : req.query.author;
	const maxWords = (req.query.maxWords === undefined) ? 300 : req.query.maxWords;

	/* Topic can't just have a default value. If the topic is not passed in,
	we will use open AI to get a new topic. But we will assign it in a similar way
	and just abstract the API call into its own method (found in openAI.js)
	*/
	const topic = (req.query.topic === undefined) ? await getTopic() : req.query.topic;
	/**
	 * Now, we will get a news two articles related to the topic
	 */
	let articles;
	newsapi.articles({
		source: 'associated-press', // required
		sortBy: 'top', // optional
		category: topic
	}).then(articlesResponse => {
		console.log(articlesResponse);
		/*
		  {
			status: "ok",
			source: "associated-press",
			sortBy: "top",
			articles: [...]
		  }
		 */
		articles = articlesResponse.articles;
	});
	console.log(articles)
	/**
	 * Use openAI to synthesize articles similar to the ones we pulled
	 */

	/**
	 * Respond to client with articles formatted appropriately for wordpress
	 */

}