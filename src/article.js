const axios = require('axios');
const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');

const openAI = require('./openAI');

const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWSAPI_API_KEY);

exports.getArticle = async function getArticle(req, res) {
	// Check if any optional parameters were passed in.
	// Author, Topic, Max Words
	const author = (req.query.author === undefined) ? "Something Inc." : req.query.author;
	const maxWords = (req.query.maxWords === undefined) ? 300 : req.query.maxWords;
	const offset = (req.query.offset === undefined) ? 0 : req.query.offset;

	/* Topic can't just have a default value. If the topic is not passed in,
	we will use open AI to get a new topic. But we will assign it in a similar way
	and just abstract the API call into its own method (found in openAI.js)
	*/
	const topic = (req.query.topic === undefined) ? await getTopic() : req.query.topic;
	/**
	 * Now, we will get a news two articles related to the topic
	 */
	let article;
	newsapi.v2.everything({
		source: 'associated-press', // required
		q: topic,
		sortBy: 'relevancy',
		language: 'en'
	}).then(articlesResponse => {
		article = articlesResponse.articles[offset];

		// Download HTML
		axios.get(article.url).then(function(code) {
			let dom = new JSDOM(code.data, {
				url: article.url
			});

			let parsedArticle = new Readability(dom.window.document).parse();

			// Now that we have the parsedArticle from the web scraper, we can use openAI.
			
			openAI.newArticle(parsedArticle.textContent).then(
				text => {
					console.log(text.data);
					res.status(200).json({author: author, title: article.title, publishDate: article.publishedAt, content: text.data.choices[0].text});
				}
			);
		});
	});
	
	

	/**
	 * Respond to client with articles formatted appropriately for wordpress
	 */

}