function courses(parent, args, ctx, info) {
  //fetch all the courses on the based on courseID
  return ctx.db.query.courses({ where: { id_in: parent.courseIds } }, info);
}
module.exports = {
  courses
};
