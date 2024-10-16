import { _decorator, Collider2D, Component, Contact2DType, Game, Node } from "cc";
import { CowGenerator } from "./CowGenerator";
import { GameManager } from "./GameManager";
const { ccclass, property } = _decorator;

@ccclass("Cow")
export class Cow extends Component {
  @property
  speed: number = 100;
  @property
  score: number = 10;
  @property
  isCatched: boolean = false;
  @property
  cowType: number = 0;


  private _collider: Collider2D = null;

  start() {
    this._collider = this.getComponent(Collider2D);
    if (this._collider) {
      this._collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
  }

  protected onDestroy(): void {
    if (this._collider) {
      this._collider.off(
        Contact2DType.BEGIN_CONTACT,
        this.onBeginContact,
        this
      );
    }
  }

  update(deltaTime: number) {
    const pos = this.node.position;
    if (pos.x < -550) {
      CowGenerator.instance.removeCow(this.node);
      this.node.destroy();
    }
    if (!this.isCatched) {
      this.node.setPosition(pos.x - this.speed * deltaTime, pos.y, pos.z);
    }
  }

  onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
    console.log("Cow catched");
    this.isCatched = true;
    GameManager.instance.changeRopeSprite(this.cowType, this.score);
    this.scheduleOnce(() => {
      CowGenerator.instance.removeCow(this.node);
      this.node.destroy();
    }, 0);
  }
}
