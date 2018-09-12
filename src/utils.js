const jwt = require('jsonwebtoken');
const APP_SECRET = 'ADSADSADAD';
function getUserId(ctx) {
	const Authorization = ctx.request.get('Authorization');
	if (Authorization) {
		const token = Authorization.replace('Bearer ', ''); //Bearer akjshdkjashdkashdksad
		const { userId } = jwt.verify(token, process.env.APP_SECRET || APP_SECRET);
		return userId;
	}
	throw new Error('not authenticated');
}
module.exports = {
	getUserId,
	APP_SECRET
};
