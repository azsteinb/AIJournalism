const express = require('express');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');
const fs = require('fs');
const app = express();
const article = require('./article');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const apiSpec = path.join(__dirname, '../api/openapi.yaml');
const apidoc = yaml.load(fs.readFileSync(apiSpec, 'utf8'));
app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));

app.get('/v0/article', article.getArticle);


app.use(
	OpenApiValidator.middleware({
		apiSpec: apiSpec,
		validateRequests: true,
		validateResponses: true,
	}),
);


app.use((err, req, res, next) => {
	res.status(err.status).json({
		message: err.message,
		errors: err.errors,
		status: err.status,
	});
});

module.exports = app;
