// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property
    jumpHeight:number = 0;

    @property
    jumpDuration:number = 0;

    @property
    scaleDuration:number = 0;

    @property
    maxMoveSpeed:number = 0;

    @property
    accel:number = 0;

    @property(cc.AudioClip)
    jumpAudio : cc.AudioClip = null;

    accLeft:boolean = false;
    accRight:boolean = false;
    xSpeed:number = 0;

    private isPlay:boolean = false;
    private maxWidth:number = 0;

    setJumpAction() {

        var jumpUp = cc.moveBy(this.jumpDuration,cc.v2(0,this.jumpHeight)).easing(cc.easeCubicActionOut());
        var jumpDown = cc.moveBy(this.jumpDuration,cc.v2(0,-this.jumpHeight)).easing(cc.easeCubicActionIn());

        var scaleDown = cc.scaleTo(this.scaleDuration,1,0.6);
        var scaleUp = cc.scaleTo(this.scaleDuration,1,1.2);
        var scaleBack = cc.scaleTo(this.scaleDuration,1,1);
        var act = cc.sequence(scaleDown,scaleUp,jumpUp,scaleBack,jumpDown,cc.callFunc(function(){
            cc.audioEngine.playEffect(this.jumpAudio,false);
        },this))

        return cc.repeatForever(act);
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);
        this.maxWidth = cc.director.getWinSize().width/2 - this.node.getContentSize().width/2;
     }

    onRestPlayer(){
        this.node.active = true;
        this.node.setPosition(cc.v2(0,-120))
        let jumpAction = this.setJumpAction(); 
        this.node.runAction(jumpAction);
        this.accLeft = false;
        this.accRight = false;
        this.xSpeed = 0;
        this.isPlay = true;
    }

    onDestroy() {

        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);

     }

     onKeyDown(event) {

        switch(event.keyCode){
            case cc.macro.KEY.a:
            this.accLeft = true;
            break;
            case cc.macro.KEY.d:
            this.accRight = true;
            break;
        }
     }

     onKeyUp(event) {

        switch(event.keyCode){
            case cc.macro.KEY.a:
            this.accLeft = false;
            break;
            case cc.macro.KEY.d:
            this.accRight = false;
            break;
        }
     }

     //start(){}

     update (dt) {

        if(!this.isPlay)
            return;

        if(this.accLeft)
        {
            this.xSpeed -= this.accel * dt;
        }else if(this.accRight){
            this.xSpeed += this.accel * dt;
        }

        if(Math.abs(this.xSpeed) > this.maxMoveSpeed)
        {
            this.xSpeed = this.maxMoveSpeed * (this.xSpeed)/Math.abs(this.xSpeed);
        }

        var x = this.node.x
        x += this.xSpeed * dt;
        if(Math.abs(x) >= this.maxWidth)
        {
             x = this.maxWidth*x/Math.abs(x)
             this.xSpeed = 0;
        }
        this.node.x = x;
     }

     stop(){
        this.node.stopAllActions();
        this.accLeft = false;
        this.accRight = false;
        this.xSpeed = 0;
        this.node.active = false;
        this.isPlay = false;
     }
}
