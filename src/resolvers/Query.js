function feed(parent, args, ctx, info) {
	return ctx.db.query.posts({ where: { isPublished: true } }, info);
}
function drafts(parent, args, ctx, info) {
	return ctx.db.query.posts({ where: { isPublished: false } }, info);
}
function post(parent, { id }, ctx, info) {
	return ctx.db.query.post({ where: { id } }, info);
}
async function courseFeed(parent, { skip, first, filter, orderBy }, ctx, info) {
	const where = filter
		? {
				OR: [{ name_contains: filter }, { description_contains: filter }]
		  }
		: {};
	const courses = await ctx.db.query.courses(
		{ where, skip, first, orderBy },
		`{id}`
	);
	const selectionField = `{
   aggregate{
     count
   }
 }`;
	const courseConnection = await ctx.db.query.coursesConnection(
		{},
		selectionField
	);
	return {
		courseIds: courses.map(course => course.id),
		count: courseConnection.aggregate.count
	};
}
function course(parent, { id }, ctx, info) {
	return ctx.db.query.course({ where: { id } }, info);
}
module.exports = {
	feed,
	drafts,
	post,
	courseFeed,
	course
};
