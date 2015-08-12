$(document).ready(function(){

    var socket = io.connect('http://localhost:9080/');

    var col_num;
    var row_num;
    var margin;
    var id_num;
    var rand_box;
    var rand_img;
    var full_box=0;
    var fill_time;
    var trans_time;
    var box_effect;
    var fill = [];

    var list;

    var $box_bg = [];

    var timeoutObject = -1;

    socket.on ('start_sign', function (data){
        //first message received after server connection

        //config data from config.json
        list = data.list;
        row_num = data.box[0];
        col_num = data.box[1];
        margin = data.box[2];
        fill_time_default = data.box[3];
        trans_time_default = data.box[4];
        fill_time_other = data.box[6];
        trans_time_other = data.box[7];
        box_effect = data.box[5];

        if (timeoutObject != -1){
            clearTimeout(timeoutObject);
        }
        
        start();
    });

    socket.on ('toggle_speed', function(data){
        //received after 'a' key pressed

        //toggle between two set of value from config file
        if (fill_time == fill_time_default){
            fill_time = fill_time_other;
            trans_time = trans_time_other;
        }else{
            fill_time = fill_time_default;
            trans_time = trans_time_default;
        }
    })

    function start(){
        //lanciata con la connessione al server o quando si deve ritornare alla schermata iniziale
        //disegna i box se non ci sono o li visualizza, lancia fill_box per il riempimento dei box
        //after server connection
        //call drawbox & fillbox
        $('#body').css('backgroundImage', 'none');

        a=$(".box");
        if (a.length==0){
            //start with default behaviour
            fill_time = fill_time_default;
            trans_time = trans_time_default;
            drawBox();    
        }
        fill[0]='on';
        fillBox();
    }

    function drawBox(){
        //lanciata solo all'inizio per creare i box e half box
        
        function createDiv (wi, idd, cla){
            $("<div>").addClass("float box "+cla).css({
                width: wi,
                height: box_h-margin*2,
                "marginTop": margin,
                "marginRight": margin,
                "marginBottom": margin,
                "marginLeft": margin
            }).attr("id", idd)
            .appendTo("body");    
        }
        id_num=0;
        w = window.innerWidth;
        h = window.innerHeight;
        if (row_num > 1) box_w = parseInt(w/(col_num+0.5));
        else box_w = parseInt(w/(col_num));
        box_h = parseInt(h/row_num);
        for (var z = 0; z < row_num; z++) {
            for (var i = 0; i < col_num; i++) {
                if (((z==0 || (z %2) == 0) && i == 0) && row_num > 1) {
                    createDiv (w-(box_w*col_num)-1-margin*2, id_num, "half");
                    id_num++;
                }
                
                createDiv (box_w-margin*2, id_num, "full");

                if ( (((z %2) == 1)  && (i==(col_num-1))) && row_num > 1){
                    id_num++;
                    createDiv (w-(box_w*col_num)-1-margin*2, id_num, "half");
                }
                id_num++;   
            };    
        };
    }

    function getRandomInt(min, max) {
        //ritorna in casuale fra min e max
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function assignBg (id, img){
        //call bgswitcher on #id, load image img
        $box_bg[id] = $("#"+id).bgswitcher({
            images: img,
            interval: 00,
            loop:false,
            duration: trans_time,
            effect: box_effect,
            start: false
        });
    }

    function fillBox(){
        //if box are empty, fill box with image from server list, then restart after fill_time millisecond
        //if box are filled choose a random box, then fill it with a random image and restart
        if (fill[0]=='off') return;
        if (list.length>0){
            if ( fill[1] != "filled" ){
                for (var i = 0; i < id_num; i++) {
                    rand_img = getRandomInt (0, list.length);
                    r_img = ['../pic/sample/'+list[rand_img]];
                    assignBg(i, r_img);
                    fill[1] = "filled";
                };
            }
            rand_box = getRandomInt (0, id_num);
            rand_img = getRandomInt (0, list.length);
            $box_bg[rand_box].bgswitcher("stop");
            $box_bg[rand_box].bgswitcher("img_add",['../pic/sample/'+list[rand_img]]);
            $box_bg[rand_box].bgswitcher("change_duration", trans_time);
            $box_bg[rand_box].bgswitcher("reset");
            $box_bg[rand_box].bgswitcher("start");
        }
        
        timeoutObject = setTimeout(function(){
            fillBox();
        },fill_time);
    }


 
    //-----------------------

    document.addEventListener("keyup", function (event){
        //key d-> (green button) 68
        if (event.keyCode == 68){
            socket.emit('key-pressed',{'button':'green'});
            return;
        }

        //key a-> (red button) 65
        if (event.keyCode == 65){
            socket.emit('key-pressed',{'button':'red'});
            return;
        }
    });

    window.addEventListener('resize', function(event){
        
        w = $("body").innerWidth();
        h = window.innerHeight;
        if (row_num > 1) box_w = parseInt(w/(col_num+0.5))-margin*2;
        else box_w = parseInt(w/col_num)-margin*2;
        box_h = parseInt(h/row_num)-margin*2;        
        half_box_w = (w-((box_w+margin*2)*col_num)-1-margin*2);
        half_box_h = box_h;
        
        $(".half").css({width: half_box_w, height: half_box_h});
        $(".full").css({width: box_w, height: box_h});
    });

});