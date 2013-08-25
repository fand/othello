
var cell_address = {
	a1 : 11,
	b1 : 12,
	c1 : 13,
	d1 : 14,
	e1 : 15,
	f1 : 16,
	g1 : 17,
	h1 : 18,
	a2 : 21,
	b2 : 22,
	c2 : 23,
	d2 : 24,
	e2 : 25,
	f2 : 26,
	g2 : 27,
	h2 : 28,
	a3 : 31,
	b3 : 32,
	c3 : 33,
	d3 : 34,
	e3 : 35,
	f3 : 36,
	g3 : 37,
	h3 : 38,
	a4 : 41,
	b4 : 42,
	c4 : 43,
	d4 : 44,
	e4 : 45,
	f4 : 46,
	g4 : 47,
	h4 : 48,
	a5 : 51,
	b5 : 52,
	c5 : 53,
	d5 : 54,
	e5 : 55,
	f5 : 56,
	g5 : 57,
	h5 : 58,
	a6 : 61,
	b6 : 62,
	c6 : 63,
	d6 : 64,
	e6 : 65,
	f6 : 66,
	g6 : 67,
	h6 : 68,
	a7 : 71,
	b7 : 72,
	c7 : 73,
	d7 : 74,
	e7 : 75,
	f7 : 76,
	g7 : 77,
	h7 : 78,
	a8 : 81,
	b8 : 82,
	c8 : 83,
	d8 : 84,
	e8 : 85,
	f8 : 86,
	g8 : 87,
	h8 : 88
},

cell_name = [
    'wall','wall','wall','wall','wall','wall','wall','wall','wall','wall','wall',
	'a1','b1','c1','d1','e1','f1','g1','h1','wall','wall',
	'a2','b2','c2','d2','e2','f2','g2','h2','wall','wall',
	'a3','b3','c3','d3','e3','f3','g3','h3','wall','wall',
	'a4','b4','c4','d4','e4','f4','g4','h4','wall','wall',
	'a5','b5','c5','d5','e5','f5','g5','h5','wall','wall',
	'a6','b6','c6','d6','e6','f6','g6','h6','wall','wall',
	'a7','b7','c7','d7','e7','f7','g7','h7','wall','wall',
	'a8','b8','c8','d8','e8','f8','g8','h8'
],

board = new Array(100),
board_last = new Array(100),


player_list = [
    {
        name: "bo",
        skill: "はねる",
        weight: {
            kakutei : 1,
            playable : 1,
            gain : 1,
            openness : 1,
            position : 1
        }
    }
],

mode,
currentState = "title";

var left = {
    character: "bo",
    color : "black",
    score : 0,
    power : 0
};
var right = {
    character : "bo",
    color : "",
    score : 0,
    power : 0
};


left.character = player_list[0].name;
right.character = player_list[0].name;


var firsthand = 0,         // 先攻はどっちか.0なら左、1なら右
history = new Array(),
isBacked = true,

cpu_mode = false,            // 対CPU戦ならtrue
cpu_turn = 1,                   // CPUはどっちか。0なら黒
cpu_color = "white",
cpu_character = 0;

var stateManager = {

	vs_human : function() {
		mode = "human";
		showSelect();
		currentState = "select";
	},
    
	vs_cpu : function() {
		mode = "cpu";
		showSelect();
		currentState = "select";
        cpu_mode = true;
	},
    
	to_battle : function() {
        if(firsthand==2){
            firsthand = (Math.floor(Math.random() * 100)) % 2;
        }
        // CPU対戦モードで、且つ右先なら
        // CPUを先攻にする
        if(firsthand && cpu_turn){
            cpu_turn = 0;
            cpu_color = "black";
        }
        
		showBattle();
		currentState = "battle";        
	},
	
    undo: function(){
        history.pop();
        board = board_last;
        for(var i = 0;i<board.length; i++){
            $("#"+cell_name[i]).unbind();
            if(board[i]=="empty"){
                $("#"+cell_name[i]).empty().removeClass("playable");
            }else if(board[i]!="wall"){
                $("#"+cell_name[i]).html("<img class='stone' src='image/"+ board[i] +".png' alt=''>");
            }
        }
        $("#undo").css("top","-1000px");
        $("#undo_disabled").css("top","100px");
        time--;
        hideMenu();
    },

    undo_disabled: function(){

    },
    
    close_menu: function(){
        hideMenu();
    },
    
	battle : function() {
	}
};



$(function() {

	// 初期化
	$(".button").each(function() {
		$(this).click(function() {

			stateManager[this.id]();

			$(this).fadeOut(40).fadeIn(40).fadeOut(40).fadeIn(40).fadeOut(40).fadeIn(40);

		});
	});
	game();

});

function game() {
	showOpening();
	showTitle();

	// Battle();
}

function showOpening() {

}

function showTitle() {
	$("#title").delay(200).animate({
		top : "0px"
	}, 680, "easeOutBounce");
}

function showSelect() {
    var index_left = 0, index_right = 0;
    
	//play(se)
	$("#select").css({
		top : "0px"
	});

	$("#title").delay(440).animate({
		top : "-540px"
	}, "fast");

	$("#to_battle").delay(700).animate({
		opacity: "0.8"
	}, 500);
	$("#stand_left :first-child").delay(700).animate({
		left : "0px"
	}, 100);
	$("#stand_right :first-child").delay(700).animate({
		right : "0px"
	}, 100);

    $("#select_button_left").click(function(){
        $("#stand_left > img:eq("+ (index_left % player_list.length) +")").css("left","-500px");
        index_left++;
        $("#stand_left > img:eq("+ (index_left % player_list.length) +")").animate({
            left: "0px"
        }, 100);
        left.charactr = player_list[(index_left % player_list.length)].name;
    });
    $("#select_button_right").click(function(){
        $("#stand_right > img:eq("+ (index_right % player_list.length) +")").css("right","-500px");
        index_left++;
        $("#stand_right > img:eq("+ (index_right % player_list.length) +")").animate({
            right: "0px"
        }, 100);
        right.character = player_list[(index_right % player_list.length)].name;
    });

    $("#firsthand_button").click(function(){
        if(firsthand==0){
            firsthand=1;
            $(this).empty().html("<img src='image/firsthand_right.png'>");

        }else if(firsthand==1){
            firsthand=2;
            $(this).empty().html("<img src='image/firsthand_random.png'>");

        }else{
            firsthand=0;
            $(this).empty().html("<img src='image/firsthand_left.png'>");

        }
        $(this).css("height","0px").delay(30).animate({
            height:"100px"
        });
    });
}

function showBattle() {
	// セレクト画面を消して
	$("#select").delay(400).animate({
		opacity : "0"
	}, 400);
	$("#select").delay(1000).animate({
		"top":"-1000px"
	}, 1);
		
	// ボードと背景を表示して
	showBoard();
	// ステータスを表示して
	showStatus();
	//メニューボタンを出して
	showMenuButton();
	//合図を出す
	showStartSign();
}

function showBoard() {
	initializeBoard();
	$("#board").delay(1300).animate({
		top : "0px"
	}, 400);
}

function showStatus() {
    if(cpu_mode){
        $("#player_left").html("You");
        $("#player_right").html("CPU");
    }else{
        $("#player_left").html("1p");
        $("#player_right").html("2p");
    }
    
	$("#status").css("top", "0px");
	$("#status_left").delay(2000).animate({
		left: "0px"
	}, 270);
	$("#status_right").delay(2000).animate({
		right: "0px"
	}, 270);
	$("#gauge_left").delay(2430).animate({
		width: "550px"
	}, 600, "swing");
	$("#gauge_right").delay(2430).animate({
		width: "550px"
	}, 600, "swing");
}

function showMenuButton(){
	$("#menu_button").click(function(){
		showMenu();
	})
	.delay(3000).slideDown("fast");
}

function showStartSign(){
	//大体6000msで
	$("#sign").delay(1800).animate({
		top: "0px"
	}, 1).delay(3700).animate({
		top: "-1000px"
	}, 1);
	$("#sign_ready").delay(4400).animate({
		top: "-300px"
	}, 1);
	$("#sign_go").delay(5000).animate({
		top: "220px"
	}, 1).delay(1000).animate({
		top: "-300px"
	}, 1);
	setTimeout("turn()", 5000);
}

function showMenu(){
    $("#menu").css({
        top: "0px"
    });
    $("#menu_inner").animate({
        top: "60px",
        opacity: "0.90"
    }, 300);
    for(var i = 0;i<history.length;i++){
        $("#history").prepend(history[i]);
    }
}

function hideMenu(){
    $("#menu").animate({
        top: "-1000px"
    }, 1);
    $("#menu_inner").animate({
        top: "100px",
        opacity: "0"
    }, 300);

    turn();
    
    $("#history").empty();
}


//終了フラグ、判定勝ちフラグ、何ターン目か、残り打てるマス数、今どっちのターンか。
var finish=false,
    deadlock=false,
    time=0,
    rest=0,
    currentColor = "black";


function drawBoard() {
	//どっちのターンか調べる
	if((time%2)==0) { currentColor= "black";}
	else { currentColor="white";}
    
    //獲得枚数の表示更新
    left.score = 0, right.score = 0;
    for(var i = 0;i<board.length;i++){
        if(board[i] == "white"){ 
            if(firsthand){ left.score++;}
            else{ right.score++;}
        }else if(board[i] == "black"){
            if(firsthand){ right.score++;}
            else{ left.score++;}
        }
    }
    $("#score_left").html(left.score);
    $("#score_right").html(right.score);	
	
    //攻撃側を強調表示
    if(Math.abs((time%2)-firsthand)){ //右側のターン
        $("#status_right_bg").css({
            "box-shadow": "0px 0px 20px 10px #fE8",
            "opacity": "1"
            });
        $("#status_left_bg").css({
            "box-shadow":"0px 0px 0px 0px #000",
            "opacity":"0.65"
            });
        $("#status_right_face").css("opacity","1");
        $("#status_left_face").css("opacity","0.8");
    }else{
        $("#status_left_bg").css({
            "box-shadow": "0px 0px 20px 10px #fe8",
            "opacity": "1"
            });
        $("#status_right_bg").css({
            "box-shadow":"0px 0px 0px 0px #000",
            "opacity":"0.5"
            });
        
        $("#status_left_face").css("opacity","1");
        $("#status_right_face").css("opacity","0.8");
    }

	//石を置けるマスを表示
    rest = 0;
	for (var key in cell_address){
		if(isPlayable(board, cell_address[key], currentColor)){
			$("#"+key).addClass("playable");
            rest++;
		}	
	}
}



function turn() {
	
    drawBoard();

    //打つところがなければデッドロックのフラグをセット
    // 2ターン続けば試合終了、判定勝ちへ
    //残り1マスなら終了フラグをセット
	if (rest == 0){
        if(deadlock){
            endBattle("deadlock");
        }else{
            deadlock = true;
            time++;
            turn();
        }
    }else{
        deadlock=false;
        if (rest == 1){
            var empty_length = 0;
            for (var j =0; j<board.length;j++){
                if (board[j]=="empty") {  empty_length++;}
            }
            if (empty_length == 1){ finish = true;}
        }
    }

    	
	//ゲージが貯まってたらボタン表示
	
	


	//石を置けるマスにイベントをバインド
    if(cpu_mode && isCpuTurn()){
        setTimeout(function(){
            $(".playable").unbind();
            
            var target = cpuPlay();
            
            // ボードの保存
            board_last = board.concat();
            
		    $("#"+target).append("<img class='stone' src='image/"+currentColor+".png' alt=''>");
            board[cell_address[target]] = currentColor;
		    $(".playable").each(function(){
			    $(this).unbind().removeClass("playable");
		    });
            
            
            // 石を返し、数え、historyに追加する
            if((time%2)==0){
                if(firsthand){
                    right.power += flip(board, cell_address[target], currentColor);
                    history_html = "<div class='history_right'>"+ target.toUpperCase() +" : turn "+ time +" [black]</div>";
                }else{
                    left.power += flip(board, cell_address[target], currentColor);
                    history_html = "<div class='history_left'>turn "+ time +" [black] : "+ target.toUpperCase() +"</div>";
                }
            }else{
                if(firsthand){
                    left.power += flip(board, cell_address[target], currentColor);
                    history_html = "<div class='history_left'>turn "+ time +" [white] : "+ target.toUpperCase() +"</div>";
                }else{
                    right.power += flip(board, cell_address[target], currentColor);
                    history_html = "<div class='history_right'>"+ target.toUpperCase() +" : turn "+ time +" [white]</div>";
                }
            }
		    //historyに棋譜を追加、アンドゥの復活
            history.push(history_html);
            $("#undo").css("top","100px");
            $("#undo_disabled").css("top", "-1000px");
            
            setTimeout(function(){drawBoard();},100);
            
		    time++;		
		    if(finish){
			    endBattle("ko");
		    } else {
			    turn();
		    }
        }, (1400 + Math.floor(Math.sqrt(Math.random()*100000))));
    }
    else{
	    $(".playable").unbind().click(function(){
            
            // ボードの保存
            board_last = board.concat();
            
		    $(this).append("<img class='stone' src='image/"+currentColor+".png' alt=''>");
		    $(".playable").each(function(){
			    $(this).unbind().removeClass("playable");
		    });
            
            
            // 石を返し、数え、historyに追加する
            if((time%2)==0){
                if(firsthand){
                    right.power += flip(board, cell_address[this.id], currentColor);
                    history_html = "<div class='history_right'>"+ this.id.toUpperCase() +" : turn "+ time +" [black]</div>";
                }else{
                    left.power += flip(board, cell_address[this.id], currentColor);
                    history_html = "<div class='history_left'>turn "+ time +" [black] : "+ this.id.toUpperCase() +"</div>";
                }
            }else{
                if(firsthand){
                    left.power += flip(board, cell_address[this.id], currentColor);
                    history_html = "<div class='history_left'>turn "+ time +" [white] : "+ this.id.toUpperCase() +"</div>";
                }else{
                    right.power += flip(board, cell_address[this.id], currentColor);
                    history_html = "<div class='history_right'>"+ this.id.toUpperCase() +" : turn "+ time +" [white]</div>";
                }
            }
		    //historyに棋譜を追加、アンドゥーの復活
            history.push(history_html);
            $("#undo").css("top","100px");
            $("#undo_disabled").css("top", "-1000px");
            
		    time++;		
		    if(finish){
			    endBattle("ko");
		    } else {
			    turn();
		    }
	    });
    }
}


function isPlayable(env, index, color){
	
	if(env[index]!="empty") return false;

    var count = flip_lines(env, index, color, false, false);
    if(count>0) {   
    	return count;
	} else {
		return false;
	}
}

function flip(env, index, color){
    var count = flip_lines(env, index, color,true, true);
    if(count>0){
        env[index]=color;
	}
    return count;
}

function flip_count(env, index, color){
    var count = flip_lines(env, index, color,false, false);
    if(count>0){
        env[index]=color;
	}
    return count;
}


function flip_lines(env, index, color, flag_env, flag_html){
	var count = 0;
	
	count+=flip_line(env, index, -11, color, flag_env, flag_html);
    count+=flip_line(env, index,  -10, color, flag_env, flag_html);
    count+=flip_line(env, index,  -9, color, flag_env, flag_html);
    count+=flip_line(env, index,  -1, color, flag_env, flag_html);
    count+=flip_line(env, index,   1, color, flag_env, flag_html);
    count+=flip_line(env, index,   9, color, flag_env, flag_html);
    count+=flip_line(env, index,   10, color, flag_env, flag_html);
    count+=flip_line(env, index,  11, color, flag_env, flag_html);

    return count;
}

function flip_line(env, index, dir, color, flag_env, flag_html){	
    var i = 0;
	var target = index + dir;
	if(color == "white"){
    	while(env[target]=="black")
        	target += dir;
	} else {
		while(env[target]=="white")
			target += dir;
	}
	
    if(env[target] == color){
	    target -= dir;
    	while(target != index){
    		if(flag_env){
        		env[target] = color;
            }
            if(flag_html){
        		$("#"+cell_name[target]).empty().append("<img class='stone' src='image/"+color+".png' alt=''>")
                    .contents().each(function(){
                        $(this).css("width","0px").delay(20).animate({
                            width:"40px"
                        },100);
                    });
                
			}
		
		target -= dir;
        i++;
    	}
    }

    return i;
}


function endBattle(state) {
	//
	$("#sign").animate({
		top: "0px"
	}, 1);
    if(state==="ko"){
	    $("#sign_ko").delay(600).animate({
		    top: "220px"
	    }, 1);
        
    }else if(state==="draw"){
        $("#sign_draw").delay(600).animate({
            top: "220px"
        }, 1);
    }
	    
	setTimeout("showResult()", 2000);
	
	//BoardとStatusを隠す
	
	//Boardを初期化する
	//initializeBoard();

    //time= 0;
}

function showResult(){
    if(left.score>right.score){
        $("#result_left").html("WINNER!");
    }else if(left.score < right.score){
        $("#result_right").html("WINNER!");
    }

    $("#result_score").html(left.score + " : " + right.score);

    $("#result").css("top","0px").animate({
        "opacity": "1"
    },200);
    $("#result_wrapper").animate({
        "top" : "0px"
    }, 200);
}
    
function initializeBoard(){
	var i;
	for(i=0;i<100;i++){
		 board[i] = "empty";	 
	}
	for(i=0;i<10;i++){
		board[i] = "wall";
		board[i+90] = "wall";
		board[i*10] = "wall";
		board[i*10+9] = "wall";
	}
	
	for (i in cell_address){
		$("#"+cell_address[i]).empty();
	} 
	
	board[cell_address["d4"]]="white";
	board[cell_address["e4"]]="black";
	board[cell_address["d5"]]="black";
	board[cell_address["e5"]]="white";
	
	$("#d4").append("<img class='stone' src='image/white.png' alt=''>");
	$("#e4").append("<img class='stone' src='image/black.png' alt=''>");
	$("#d5").append("<img class='stone' src='image/black.png' alt=''>");
	$("#e5").append("<img class='stone' src='image/white.png' alt=''>");


    time=0;
    history.length=0;
}



function isCpuTurn(){
    // CPUが白なら
    if(cpu_turn){
        if(time%2) return true;
        else return false;
    }else{
        if(time%2) return false;
        else return true;
    }
}

