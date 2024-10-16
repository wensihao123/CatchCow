import {
  _decorator,
  Component,
  director,
  Label,
  Node,
  Sprite,
  SpriteFrame,
  tween,
  Vec3,
} from "cc";
import { CowGenerator } from "./CowGenerator";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  private static _instance: GameManager = null;

  public static get instance(): GameManager {
    return GameManager._instance;
  }

  @property
  throwTime: number = 0.5;
  @property
  backTime: number = 0.5;
  @property(Node)
  rope: Node = null;
  @property(SpriteFrame)
  originalRope: SpriteFrame = null;
  @property(SpriteFrame)
  ropeCow1: SpriteFrame = null;
  @property(SpriteFrame)
  ropeCow2: SpriteFrame = null;
  @property(SpriteFrame)
  ropeCow3: SpriteFrame = null;
  @property(Node)
  scoreLabel: Node = null;
  @property(Node)
  timerLabel: Node = null;
  @property(Node)
  scoreBoard: Node = null;
  @property(Node)
  scoreBoardLabel: Node = null;

  private _isThrowing: boolean = false;

  protected onLoad(): void {
    GameManager._instance = this;
  }

  start() {
    this.initGame();
    this.rope.setPosition(0, -700, 0);
  }

  update(deltaTime: number) {}

  onThrowClick() {
    if (this._isThrowing) return;
    this._isThrowing = true;
    tween(this.rope)
      .to(this.throwTime, { position: new Vec3(0, 0, 0) }, { easing: "sineIn" })
      .call(() => {
        this.onReachLimit();
      })
      .start();
  }

  onReachLimit() {
    this.scheduleOnce(() => {
      tween(this.rope)
        .to(
          this.backTime,
          { position: new Vec3(0, -700, 0) },
          { easing: "smooth" }
        )
        .call(() => {
          this._isThrowing = false;
          this.backTime = 0.5;
          this.rope.getComponent(Sprite).spriteFrame = this.originalRope;
        })
        .start();
    }, 0.02);
  }

  changeRopeSprite(cowType: number, score: number) {
    this.backTime = 2;
    const currentScore = parseInt(this.scoreLabel.getComponent(Label).string);
    this.scoreLabel.getComponent(Label).string = (
      currentScore + score
    ).toString();
    switch (cowType) {
      case 1:
        this.rope.getComponent(Sprite).spriteFrame = this.ropeCow1;
        break;
      case 2:
        this.rope.getComponent(Sprite).spriteFrame = this.ropeCow2;
        break;
      case 3:
        this.rope.getComponent(Sprite).spriteFrame = this.ropeCow3;
        break;
    }
  }

  initGame() {
    director.resume();
    this.scoreBoard.active = false;
    this.scoreLabel.getComponent(Label).string = "0";
    this.timerLabel.getComponent(Label).string = "60";
  }

  gameOver() {
    director.pause();
    CowGenerator.instance.removeAllCow();
    this.scoreBoardLabel.getComponent(Label).string = this.scoreLabel.getComponent(
      Label
    ).string;
    this.scoreBoard.active = true;
  }
}
