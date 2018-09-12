const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getUserId, APP_SECRET } = require('../utils');

function createDraft(parent, { title, text }, ctx, info) {
	return ctx.db.mutation.createPost(
		{
			data: {
				title,
				text
			}
		},
		info
	);
}
function createCourse(parent, { name, description }, ctx, info) {
	const userId = getUserId(ctx);
	return ctx.db.mutation.createCourse(
		{
			data: {
				name,
				description,
				postedBy: {
					connect: {
						id: userId
					}
				}
			}
		},
		info
	);
}
function updateCourse(parent, { id, name, description }, ctx, info) {
	const userId = getUserId(ctx);
	const data = {};
	if (description) {
		data.description = description;
	}
	if (name) {
		data.name = name;
	}
	return ctx.db.mutation.updateCourse(
		{
			data,
			where: { id: id }
		},
		info
	);
}
function deletePost(parent, { id }, ctx, info) {
	return ctx.db.mutation.deletePost({ where: { id } }, info);
}
function deleteCourse(parent, { id }, ctx, info) {
	const userId = getUserId(ctx);
	return ctx.db.mutation.deleteCourse({ where: { id } }, info);
}
function publish(parent, { id }, ctx, info) {
	return ctx.db.mutation.updatePost(
		{
			where: { id },
			data: { isPublished: true }
		},
		info
	);
}
async function signup(parent, { email, password }, ctx, info) {
	const hash = await bcrypt.hash(password, 10);
	const user = await ctx.db.mutation.createUser(
		{
			data: {
				email,
				password: hash
			}
		},
		`{id}`
	);
	const token = jwt.sign(
		{ userId: user.id },
		process.env.APP_SECRET || APP_SECRET
	);
	return {
		token,
		user
	};
}
async function login(parent, { email, password }, ctx, info) {
	const user = await ctx.db.query.user({ where: { email } }, `{id password}`);
	if (!user) {
		throw new Error('No such a user');
	}
	const matched = await bcrypt.compare(password, user.password);
	if (!matched) {
		throw new Error('Invalid password');
	}
	const token = jwt.sign(
		{ userId: user.id },
		process.env.APP_SECRET || APP_SECRET
	);
	return {
		token,
		user
	};
}
module.exports = {
	createDraft,
	createCourse,
	updateCourse,
	deletePost,
	deleteCourse,
	publish,
	signup,
	login
};
