var http = require('http');
var fs = require('fs');
var url=require ('url');
var s = require('socket.io');

var cli;

var server, path, io;

var events = require('events');

var config = require('./config.json');

//config data from config.json, passed to the client
//Effect can be: fade, blind, clip, slide, drop, scale
var box_data = [];
box_data[0] = config.box_per_col;               //number of row
box_data[1] = config.full_box_per_row;          //number of column (full box)
box_data[2] = config.box_margin;                //box margin    
box_data[3] = config.box_time_default;          //time in ms between two transition, default value
box_data[4] = config.box_transition_default;    //transition duration in ms, default value
box_data[5] = config.box_effect;                //image transition effect: fade, blind, clip, slide, drop, scale
box_data[6] = config.box_time_other;            //time between two transition, second choice
box_data[7] = config.box_transition_other;      //transition duration, second choice

var img_list;

startServer();

function sampleList(callback){
    //return an array with 'pic_' file in pic/sample
    fil = [];
    ind=0;
    var files = fs.readdirSync(__dirname+"/pic/sample/");

    if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
            //http://stackoverflow.com/questions/4234589/validation-of-file-extension-before-uploading-file
            if ( files[i].search('pic_') == 0 ) {
                fil[ind] = files[i];
                console.log(fil[ind]);
                ind++;
            }
        }
        img_list = fil;
        callback(fil);
    }
}

function sock (socket){
    //start on client connection
    //listener for client message
    cli=socket;
    console.log("Client connected");
    sampleList(function(data){
        cli.emit('start_sign',{list: data, box: box_data});
    });

    cli.on ("key-pressed", function(puls){
        data = puls.button;
        console.log("Client say: ",data);
        if (data == "green"){
            sampleList(function(data){
                cli.emit('start_sign',{list: data, box: box_data});
            });            
        }
        if (data == "red"){
            cli.emit('toggle_speed',"ok");
        }
    });
}

function startServer(){
    //start http server on localhost:9080
    //send index.html to client
    server = http.createServer( function(request, response){
        path=url.parse(request.url,true).pathname;

        fs.readFile(__dirname+path, function(err, data){
            if (err) {
                if (path=="" || path=="/"){
                    fs.readFile(__dirname +"/index.html", function(err,data) {
                        response.writeHead(200);
                        response.write(data);
                        response.end();     
                    });
                } else { 
                    response.writeHead(404);
                    response.end();
                }
            } else {
                response.writeHead(200);
                response.write(data);
                response.end();
            }
        });
    });

    server.listen(9080);

    io = s.listen(server);
    console.log('Http server listen on localhost:9080');

    io.sockets.on('connection', function(socket){
        sock(socket);
    });
}