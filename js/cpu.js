var score_map = [
    0,0,0,0,0,0,0,0,0,0,0,
    100, -40, 20,  5,  5, 20, -40, 100,0,0,
        -40, -80, -1, -1, -1, -1, -80, -40,0,0,
    20,  -1,  5,  1,  1,  5,  -1,  20,0,0,
    5,  -1,  1,  0,  0,  1,   1,   5,0,0,
    5,  -1,  1,  0,  0,  1,   1,   5,0,0,
    20,  -1,  5,  1,  1,  5,  -1,  20,0,0,
        -40, -80, -1, -1, -1, -1, -80, -40,0,0,
    100, -40, 20,  5,  5, 20, -40, 100,0,
    0,0,0,0,0,0,0,0,0,0
];

var alpha = 0, beta = 0;



function cpuPlay(){
    var depth = 0, limit = 15;

    var answer = evalPhase(board, depth, limit);

    return answer[0][0];
}

//順序付け + Scout法
function evalPhase(env, depth, limit){
    var score = 0, kakutei = 0, playable = 0, gain = 0, position = 0;
    var flag_playable;
    var score_light = 0;
    var new_score = 0;
    var child;

    
    var candidates = [];
    for (var key in cell_address){
        flag_playable = isPlayable(env, cell_address[key], cpu_color);
        gain += flag_playable;
        if(flag_playable){
            score_light = gain* player_list[cpu_character].weight.gain;
            score_light += score_map[ cell_address[key] ]* player_list[cpu_character].weight.position;
            candidates.push([key,score_light]); // 番号とスコア
        }
    }

    // スコアで降順にソート
    candidates.sort(function(a, b) {
        return ((a[1] - b[1])*-1);
    }); 

    
    if(depth%2 == 0){            // 自分(CPU)のターンのとき
        var evals = [];
        var beta_is_tmp = false;
        
        for(var i = 0; i<candidates.length; i++){
            if (depth != limit){

                child = evalPhase(getNextBoard(env,candidates[i][0]), depth+1, limit);
                if (beta_is_tmp){ beta_is_tmp = false; } 
                
                evals.push(child[1]);
                alpha = Math.max.apply(null, evals);
                if(alpha >= beta) {
                    return [candidates[i], beta];
                }else{
                    beta = alpha+1;
                    beta_is_tmp = true;
                }    
                    
            }else{ // 末端

                var weights = player_list[cpu_character].weight;
                
                //隅に石があれば
                if(env[cell_address[a1]]==cpu_color) kakutei++;
                if(env[cell_address[a8]]==cpu_color) kakutei++;
                if(env[cell_address[h1]]==cpu_color) kakutei++;
                if(env[cell_address[h8]]==cpu_color) kakutei++;
                
                for(var i = 0; i<env.length;i++){
                    if(isPlayable(env, i, cpu_color)){
                        playable++;
                    }
                }
                
                position = score_map[ candidates[i] ];

                score = kakutei * weights['kakutei']
                    + playable * weights['playable']
                    + gain * weights['gain']
                    + position * weights['position'];
                
                return [ candidates[i], score ];
            }
            return [ candidates[i], Math.max.apply(null, evals) ];
        }
                
    }else{                 // 相手のターンのとき
        
        evals = [];
        var alpha_is_tmp = false;
        for (i = 0; i<candidates.length; i++){
            if(depth != limit){
                child = evalPhase(getNextBoard(env,candidates[i][0]), depth+1, limit);
                if(alpha_is_tmp){ alpha_is_tmp = false; }
                
                evals.push(child[1]);
                beta = Math.min.apply(null, evals);
                if(beta <= alpha){
                    return [candidates[i], alpha];
                }else{
                    alpha = beta-1;
                    alpha_is_tmp = true;
                }
                
            }else{ // 末端
                
                weights = player_list[cpu_character].weight;
                
                //隅に石があれば
                if(env[cell_address[a1]]==cpu_color) kakutei++;
                if(env[cell_address[a8]]==cpu_color) kakutei++;
                if(env[cell_address[h1]]==cpu_color) kakutei++;
                if(env[cell_address[h8]]==cpu_color) kakutei++;
                
                for(i = 0; i<env.length;i++){
                    if(isPlayable(env, i, cpu_color)){
                        playable++;
                    }
                }
                
                position = score_map[ candidates[i] ];
                
                score = kakutei * weights['kakutei']
                    + playable * weights['playable']
                    + gain * weights['gain']
                    + position * weights['position'];
                
                return [ candidates[i], score ];
                
            }
            
            return [ candidates[i], Math.min.apply(null, evals) ];
        }
    }
}



function getNextBoard(env,index){
    var board_new = env.concat();

    if(flip_lines(board_new, index, cpu_color, true, false)>0){
        board_new[index] = cpu_color;
    }

    return board_new;
}



