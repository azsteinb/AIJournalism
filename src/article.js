// const aimodel = require('./openAI.js');
const openAI = require('./openAI');

const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWSAPI_API_KEY);

exports.getArticle = async function getArticle(req, res) {
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
	let article;
	newsapi.articles({
		source: 'associated-press', // required
		sortBy: 'top', // optional
	}).then(articlesResponse => {
		console.log(articlesResponse.articles[0]);
		/*
		  {
			status: "ok",
			source: "associated-press",
			sortBy: "top",
			articles: [...]
		  }
		 */
		article = articlesResponse.articles[0];
		// res.status(200).json({author: author, title: 'test title', publishDate: article.publishedAt, content: 'test'});
		
		/**
	 	* Use openAI to synthesize articles similar to the ones we pulled
	 	*/
		openAI.newArticle(article.description).then(
			text => {
				console.log(text.data.choices);
				res.status(200).json({author: author, title: 'test title', publishDate: article.publishedAt, content: text.data.choices[0].text});
			}
		);
	});
	
	

	/**
	 * Respond to client with articles formatted appropriately for wordpress
	 */

}