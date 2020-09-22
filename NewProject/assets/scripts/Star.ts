import Game from "./Game";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Star extends cc.Component {

    @property
    pickRadius : number = 0;

    @property
    score : number = 0;

    public game:Game = null;
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}

     getPlayerDistance():number {
         var playerPos = this.game.player.getPosition();
         var dis = this.node.getPosition().sub(playerPos).mag();
         return dis;
     }

     onPicked(){

        this.game.setScore(this.score,this.node.getPosition());

        this.game.spawnStar();
        this.node.destroy();
     }
    //start () {}


     update (dt) {

         if(this.getPlayerDistance() < this.pickRadius)
         {
             this.onPicked()
             return;
         }
     }
}
