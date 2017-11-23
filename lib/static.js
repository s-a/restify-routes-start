'use strict'

const fs = require('fs')
const path = require('path')
const testFolder = path.join(__dirname, '../public/')
const semver = require('semver')
var restify = require('restify')

const semverRegexUrl = function () {
	return /\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?\/?.*\b/ig
}
var StaticServer = function (server) {
	this.server = server
	return this
}

function sortVersionDesc(a, b) {
	return semver.gt(b, a)
}

StaticServer.prototype.getApplicationVersions = function (done) {
	var versions = []
	fs.readdir(testFolder, (err, files) => {
		if (err) throw err
		files.forEach(file => {
			if (semver.valid(file)) {
				versions.push(file)
			}
		})
		done(versions.sort(sortVersionDesc))
	})
}

StaticServer.prototype.serveStaticApplicationVersions = function (done) {
	var self = this

	this.getApplicationVersions(function (availableVersions) {
		console.log('available static page versions', availableVersions)

		// serve all available versions based on semver regular expression
		self.server.get(
			semverRegexUrl(),
			restify.plugins.serveStatic({
				directory: path.join(__dirname, '../public/'),
				default: 'index.html'
			})
		)

		// redirect root request to latest version
		self.server.get('/', function (req, res, next) {
			res.redirect('/' + availableVersions[0] + '/', next)
		})
	})
}

module.exports = StaticServer