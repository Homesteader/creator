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
    maxMoveSpeed:number = 0;

    @property
    accel:number = 0;

    accLeft:boolean = false;
    accRight:boolean = false;
    xSpeed:number = 0;

    setJumpAction() {

        let jumpUp = cc.moveBy(this.jumpDuration,cc.v2(0,this.jumpHeight)).easing(cc.easeCubicActionInOut());
        let jumpDown = cc.moveBy(this.jumpDuration,cc.v2(0,-this.jumpHeight)).easing(cc.easeCubicActionInOut());
        return cc.repeatForever(cc.sequence(jumpUp,jumpDown));
    }
    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        let jumpAction = this.setJumpAction(); 
        this.node.runAction(jumpAction);

        this.accLeft = false;
        this.accRight = false;
        
        this.xSpeed = 0;
        
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);

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

         this.node.x += this.xSpeed * dt;
     }
}