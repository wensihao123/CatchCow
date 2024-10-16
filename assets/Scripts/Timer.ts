import { _decorator, Component, Label, Node } from "cc";
import { GameManager } from "./GameManager";
const { ccclass, property } = _decorator;

@ccclass("Timer")
export class Timer extends Component {
  @property(Node)
  timerLabel: Node = null;

  start() {
    this.schedule(this.updateTimer, 1);
  }

  update(deltaTime: number) {
    if (parseInt(this.timerLabel.getComponent(Label).string) <= 0) {
      GameManager.instance.gameOver();
    }
  }

  updateTimer() {
    let time = parseInt(this.timerLabel.getComponent(Label).string);
    time--;
    this.timerLabel.getComponent(Label).string = time.toString();
  }
}
