const axios = require("axios");
const { JSDOM } = require("jsdom");
const { Readability } = require("@mozilla/readability");

const openAI = require("./openAI");

// const NewsAPI = require('newsapi');
// const newsapi = new NewsAPI(process.env.NEWSAPI_API_KEY);
const https = require("https");
const options = {
  host: "financialmodelingprep.com",
  port: 443,
  path:
    "https://financialmodelingprep.com/api/v3/stock_news?limit=10&apikey=" +
    process.env.STOCK_API_KEY,
  method: "GET",
};

exports.getArticle = async function getArticle(req, res) {
  const author =
    req.query.author === undefined ? "AI Journalism" : req.query.author;


  /**
   * Get Stock News, scrape article data, generate article, return article
   */
  const request = https.request(options, (result) => {
    result.on("data", (d) => {
      process.stdout.write(d);
      let i = 0;
      parsedJSON = JSON.parse(d);
      while (true) {
        if (parsedJSON[i]["url"].includes("https://www.youtube.com")) {
          i++; // We can't parse videos
        } else {
          break; // We found something that is not a video
        }
      }
      const url = parsedJSON[i]["url"]; // Mark the url

      axios.get(url).then((code) => { // Make a request to the url
        let dom = new JSDOM(code.data, {
          url: url, // save the DOM in memory
        });

        // parse the article
        let readability = new Readability(dom.window.document);
				let parsedArticle = readability.parse();
        console.log(parsedArticle);

        // generate a new article
        openAI.newArticle(parsedArticle.textContent).then((text) => {
          // return the new article
          res.status(200).json({
            author: author,
            title: parsedJSON[i]["title"],
            content: text.data.choices[0].text,
          });
        });
      });
    });
    // Mark the end of the request
    result.on("end", () => {
      console.log("end");
    });
  });
  // mark any errors
  request.on("error", (error) => {
    console.log("Error!");
    console.log(error);
  });
  // End the request
  request.end();
};
