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
    playBtn : cc.Button = null;

    @property(cc.AudioClip)
    scoreAudio : cc.AudioClip = null;

    @property(cc.Label)
    deltaScoreTx : cc.Label = null;

    public totalScore:number = 0;

    private groundY:number = 0;

    private timer:number = 0;
    private starDuration:number = 0;
    private isPlaying:boolean = false;

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this.deltaScoreTx.node.active = false;
        this.gameOverTx.node.active = false;
        this.groundY = this.ground.y + this.ground.height/2;
        this.playBtn.node.on(cc.Node.EventType.TOUCH_END,this.startGame,this);
        
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

    setScore(per:number,pos:cc.Vec2){
        this.totalScore += per;
        this.scoreTx.string = "SCORE:"+this.totalScore;
        if(per > 0)
        {
            cc.audioEngine.playEffect(this.scoreAudio,false);
            if(pos != null)
            {
                this.floatScore(per,pos)
            }
        }
    }

    floatScore(score:number,pos:cc.Vec2)
    {
        this.deltaScoreTx.string = "+"+score;
        this.deltaScoreTx.node.active = true;
        this.deltaScoreTx.node.setPosition(pos);

        this.deltaScoreTx.node.stopAllActions();
        var moveAct = cc.moveBy(0.2,cc.v2(0,15)).easing(cc.easeCubicActionOut());
        var fadeAct = cc.fadeIn(0.2);
        var spawnAct = cc.spawn(moveAct,fadeAct);
        var act = cc.sequence(spawnAct,cc.callFunc(function(){
            this.deltaScoreTx.node.active = false;
        },this));
        this.deltaScoreTx.node.runAction(act);
    }

    update (dt) {
        
        if(!this.isPlaying)
        return;
        if (this.timer > this.starDuration)
        {
            this.gameOver();
            return;
        }
        this.timer += dt;
    }
     
    gameOver(){
        this.playBtn.node.active = true;
        this.gameOverTx.node.active = true;
        this.player.getComponent("Player").stop();
        this.isPlaying = false;
    }
    
    startGame(){
        this.isPlaying = true;
        this.playBtn.node.active = false;
        this.gameOverTx.node.active = false;
        this.setScore(0,null);
        this.spawnStar();
        this.player.getComponent("Player").onRestPlayer();
    }
    
    //start(){}
}
