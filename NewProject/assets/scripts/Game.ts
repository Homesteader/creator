// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property({type:cc.Prefab,tooltip:"星星预制体",displayName:"星星"})
    starPrefab: cc.Prefab = null;    
    @property
    maxStarDuration : number = 0;

    @property
    minStarDuration : number = 0;

    @property(cc.Node)
    ground : cc.Node = null;

    @property(cc.Node)
    player : cc.Node = null;

    @property(cc.Label)
    scoreTx : cc.Label = null;
    
    @property(cc.Label)
    gameOverTx : cc.Label = null;

    @property(cc.Button)
    rePlayBtn : cc.Button = null;

    @property(cc.AudioClip)
    scoreAudio : cc.AudioClip = null;

    public totalScore:number = 0;

    private groundY:number = 0;

    private timer:number = 0;
    private starDuration:number = 0;

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this.gameOverTx.node.active = false;
        this.setScore(0);
        this.groundY = this.ground.y + this.ground.height/2;
        this.spawnStar();

        this.rePlayBtn.node.on(cc.Node.EventType.TOUCH_END,this.onReplay,this);
     }

    spawnStar(){

        this.timer = 0;
        this.starDuration = this.minStarDuration + Math.random()*(this.maxStarDuration - this.minStarDuration);

        var newStar = cc.instantiate(this.starPrefab);
        this.node.addChild(newStar);
        newStar.setPosition(this.getNewStarPosition());
        newStar.getComponent("Star").game = this;
        
        var act = cc.sequence(
            cc.fadeOut(this.starDuration),
            cc.callFunc(function(){
                newStar.destroy();
            })
        )
        newStar.runAction(act);
    }

    getNewStarPosition():cc.Vec2{
        var randX = 0;
        var randY = this.groundY + Math.random()*this.player.getComponent("Player").jumpHeight + 50;
        var maxX  = this.node.width/2;
        randX = (Math.random() - 0.5) * maxX;
        return cc.v2(randX,randY);
    }

    setScore(per:number){
        this.totalScore += per;
        this.scoreTx.string = "SCORE:"+this.totalScore;
        if(per > 0)
        {
            cc.audioEngine.playEffect(this.scoreAudio,false);
        }
    }

     update (dt) {
        
        if (this.timer > this.starDuration)
        {
            this.gameOver();
            return;
        }
        this.timer += dt;
     }
     
     gameOver(){
         this.gameOverTx.node.active = true;
         this.player.getComponent("Player").stop();
     }

     onReplay(){

        cc.director.loadScene("main");
     }

    //start(){}
}
