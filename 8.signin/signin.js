var http = require('http');
var fs = require('fs');
var url = require('url');
var queryString = require('querystring');
var database = [];

var startServer = function () {
	readData();
	createServer();
};

var readData = function() {
	fs.readFile('database.txt', 'utf8', (err, data) => {
		if (err) throw err;
		var pieces = data.split("\r\n");
		for (var i = 0; i < pieces.length; i++) {
			var info = pieces[i].split(',');
			database[i] = [];
			for (var j = 0; j < 4; j++)
				database[i].push(info[j]);
		}
	});
};

var createServer = function() {
	http.createServer(recieveRequest).listen(8080);
	console.log("Server is running at 127.0.0.1:8080");
};

var recieveRequest = function(request, response) {
	var info = "";
	request.on("data", (data) => { info += data; });
	request.on("end", () => { dealWithRequest(info, request, response); });
};

var dealWithRequest = function(info, request, response) {
	var path = url.parse(request.url).pathname;
	var query = queryString.parse(url.parse(request.url).query);
	if (url.parse(request.url).search && path == '/') {
		var index = indexOfDatabase(query);
		if (index != undefined) showInfo(response, index);
		else returnFile(response, '/html/register.html');
	} else {
		if (path == '/') path = '/html/register.html';
		if (path == '/login') {
			dealWithInfo(response, info);
		} else {
			if (path.search(/(register|jquery|info|message)/) != -1)
				returnFile(response, path);
		}
	}
};

var dealWithInfo = function(response, info) {
	var query = queryString.parse(info);
	var message = [];
	for (var i = 0; i < database.length; i++) {
		if (query['Username'] == database[i][0]) message.push('Username: '+database[i][0]+' already exists!');
		if (query['ID'] == database[i][1]) message.push('ID: '+database[i][1]+' already exists!');
		if (query['Phone'] == database[i][2]) message.push('Phone: '+database[i][2]+' already exists!');
		if (query['Email'] == database[i][3]) message.push('Email: '+database[i][3]+' already exists!');
	}
	if (message.length == 0) {
		saveData(query);
		showInfo(response, database.length-1);
	} else {
		showMessage(response, message);
	}
}

var saveData = function(query) {
	database.push([]);
	database[database.length-1].push(query['Username']);
	database[database.length-1].push(query['ID']);
	database[database.length-1].push(query['Phone']);
	database[database.length-1].push(query['Email']);
	fs.appendFile("database.txt", database[database.length-1].toString()+'\r\n', (err) => { console.log('savd data'); });
}

var returnFile = function(response, path) {
	path = '.'+path;
	var postfix = path.substr(path.lastIndexOf('.')+1, path.length);
	if (postfix == 'js') var contentType = "application/x-javascript";
	else var contentType = "text/"+postfix;
	console.log('load file: ', path);
	fs.readFile(path, 'utf8', (err, data) => {
		if (err) response.end();
		response.writeHead(200, { "Content-Type": contentType });
		response.write(data.toString());
		response.end();
	});
}

var indexOfDatabase = function(query) {
	for (var i = 0; i < database.length; i++)
		if (database[i][0] == query['username']) { return i; }
}

var showInfo = function(response, index) {
	response.writeHead(200, {"Content-Type": "text/html"});
	var body =  "<!DOCTYPE \"html\">"+
				"<html>"+
					"<head>"+
						"<title>User Information</title>"+
						"<meta charset=\"utf-8\">"+
						"<link rel=\"stylesheet\" type=\"text/css\" href=\"/css/info.css\">"+
					"</head>"+
					"<body>"+
						"<div id=\"infoContainer\">"+
							"<h1>User Information</h1>"+
							"<div class=\"info\" id=\"Username\"><p>Username: "+database[index][0]+"</p></div>"+
							"<div class=\"info\" id=\"ID\"><p>ID: "+database[index][1]+"</p></div>"+
							"<div class=\"info\" id=\"Phone\"><p>Phone: "+database[index][2]+"</p></div>"+
							"<div class=\"info\" id=\"Email\"><p>Email: "+database[index][3]+"</p></div>"+
						"</div>"+
					"</body>"+
				"</html>";
  	response.write(body);
  	response.end();
};

var showMessage = function(response, message) {
	response.writeHead(200, {"Content-Type": "text/html"});
	var body =  "<!DOCTYPE \"html\">"+
				"<html>"+
					"<head>"+
						"<title>Message</title>"+
						"<meta charset=\"utf-8\" http-equiv=\"Refresh\" content=\"6;url=/\">"+
						"<link rel=\"stylesheet\" type=\"text/css\" href=\"/css/message.css\">"+
					"</head>"+
					"<body>"+
						"<div id=\"messageContainer\">"+
							"<h1>Error</h1>"+
							"<div class=\"message\" id=\"m1\">"+(message[0] || "")+"</div>"+
							"<div class=\"message\" id=\"m2\">"+(message[1] || "")+"</div>"+
							"<div class=\"message\" id=\"m3\">"+(message[2] || "")+"</div>"+
							"<div class=\"message\" id=\"m4\">"+(message[3] || "")+"</div>"+
							"<div id=\"hint\">It will turn back to the register page after 6 seconds</div>"+
						"</div>"+
					"</body>"+
				"</html>";
  	response.write(body);
  	response.end();
};

startServer();