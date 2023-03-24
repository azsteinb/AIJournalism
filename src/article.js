/**
 * Calls the News API and returns a topic relevant to the passed in date.
 * @param {Date} when Date Object that the topic will be relevant too
 * @returns Topic String
 */
async function grabTopic(when){

}

async function getArticle(req, res){
	// Check if any optional parameters were passed in.
	// Author, Topic, Max Words
	const author = (req.query.author === undefined) ? "Something Inc." : req.query.author;
	const maxWords = (req.query.maxWords === undefined) ? 300: req.query.maxWords;

	/* Topic can't just have a default value. If the topic is not passed in,
	we will use the News API to get a new topic. But we will assign it in a similar way
	and just abstract the API call into its own method
	*/
}

export default getArticle