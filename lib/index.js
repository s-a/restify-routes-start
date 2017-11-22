var restify = require('restify')

var server = restify.createServer()

function sendV1(req, res, next) {
	res.send('hello: ' + req.params.name)
	return next()
}
/*
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
	console.log('addr: ' + add);
})

return
*/
function sendV2(req, res, next) {
	res.send({
		hello: req.params.name
	})
	return next()
}

var PATH = '/hello/:name'
server.get({
	path: PATH,
	version: '1.1.3'
}, sendV1)
server.get({
	path: PATH,
	version: '2.0.0'
}, sendV2)

server.get({
	path: '/ping',
	version: '1.0.0'
}, function ping(req, res, next) {
	res.send({
		'hello': 'world'
	})
	return next()
})

server.listen(process.env.PORT || 8001)