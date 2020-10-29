const express = require('express');
const cors = require('cors');
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//middlewares
function logRequests(request, response, next) {
	const { method, url } = request;
	const logLabel = `[${method.toUpperCase()}] ${url}`;
	console.log(logLabel);
	return next();
}

function validateId(request, response, next) {
	const { id } = request.params;
	if (!isUuid(id)) {
		return response.status(400).json({ error: 'invalid ID' });
	}

	next();
}

function verifyIfRepositoryExists(request, response, next) {
	const { id } = request.params;
	const repositoryIndex = repositories.findIndex((repository) => repository.id === id);
	if (repositoryIndex < 0) {
		return response.status(400).json({ error: 'repository not found' });
	}

	next();
}

app.use(logRequests);
app.use('/repositories/:id', validateId);
app.use('/like/:id', validateId);
app.use('/repositories/:id', verifyIfRepositoryExists);
app.use('/like/:id', verifyIfRepositoryExists);

// routes
app.get('/repositories', (request, response) => {
	console.log(repositories);
	return response.json(repositories);
});

app.post('/repositories', (request, response) => {
	const { title, url, techs } = request.body;

	const newRepository = {
		id: uuid(),
		title: title,
		url: url,
		techs: techs,
		likes: 0
	};

	repositories.push(newRepository);

	return response.json(newRepository);
});

app.put('/repositories/:id', (request, response) => {
	const { id } = request.params;
	const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

	const { title, url, techs } = request.body;
	console.log(techs);

	const editedRepository = {
		id: repositories[repositoryIndex].id,
		title: title,
		url: url,
		techs: techs,
		likes: repositories[repositoryIndex].likes
	};

	repositories[repositoryIndex] = editedRepository;

	return response.json(editedRepository);
});

app.delete('/repositories/:id', (request, response) => {
	const { id } = request.params;
	const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

	repositories.splice(repositoryIndex, 1);

	return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
	const { id } = request.params;
	const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

	const repository = repositories[repositoryIndex];

	const editedRepository = {
		id: repository.id,
		title: repository.title,
		url: repository.url,
		techs: repository.techs,
		likes: repository.likes + 1
	};

	repositories[repositoryIndex] = editedRepository;

	console.log(repositories[repositoryIndex]);

	const likesCount = repositories[repositoryIndex].likes;

	return response.json(repositories[repositoryIndex]);
});

module.exports = app;
