function Battle(){
    
    startBattle();
    while(!finish){
	turn();
    }
    
    endBattle();
}