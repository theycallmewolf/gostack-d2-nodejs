const express = require('express');
const cors = require('cors');
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
	console.log(repositories);
	return response.json(repositories);
});

app.post('/repositories', (request, response) => {
	const { title, url, techs } = request.body;

	const newRepository = {
		id: uuid(),
		title,
		url,
		techs,
		likes: 0
	};

	repositories.push(newRepository);

	return response.json(newRepository);
});

app.put('/repositories/:id', (request, response) => {
	const { id } = request.params;

	const repositoryIndex = repositories.findIndex((repository) => repository.id === id);
	if (repositoryIndex < 0) {
		return response.status(400).json({ error: 'repository not found' });
	}

	const { title, url, techs } = request.body;
	console.log(techs);

	const editedRepository = {
		title,
		url,
		techs
	};

	repositories[repositoryIndex] = editedRepository;

	return response.json(editedRepository);
});

app.delete('/repositories/:id', (request, response) => {
	// TODO
});

app.post('/repositories/:id/like', (request, response) => {
	// TODO
});

module.exports = app;
