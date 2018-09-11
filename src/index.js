const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');
require('dotenv').config();
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const AuthPayload = require('./resolvers/AuthPayload');
const CourseFeed = require('./resolvers/CourseFeed');

const resolvers = {
	Query,
	Mutation,
	AuthPayload,
	CourseFeed
};

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers,
	context: req => ({
		...req,
		db: new Prisma({
			typeDefs: 'src/generated/prisma.graphql', // the auto-generated GraphQL schema of the Prisma API
			endpoint: 'https://heroku-prisma-server.herokuapp.com/prismaDB/dev', // the endpoint of the Prisma API
			debug: false, // log all GraphQL queries & mutations sent to the Prisma API
			secret: 'mASDASDFSD' // only needed if specified in `database/prisma.yml`
		})
	})
});

server.start(() => console.log('Server is running on http://localhost:4000'));
