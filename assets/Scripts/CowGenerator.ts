import { _decorator, Component, instantiate, Node, Prefab } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CowGenerator")
export class CowGenerator extends Component {
  private static _instance: CowGenerator = null;

  public static get instance(): CowGenerator {
    return CowGenerator._instance;
  }

  @property(Prefab)
  cowPrefab1: Prefab = null;
  @property(Prefab)
  cowPrefab2: Prefab = null;
  @property(Prefab)
  cowPrefab3: Prefab = null;
  @property
  cowGenerateRate: number = 5;
  @property([Node])
  cowList: Node[] = [];

  private _cowPrefabList: Prefab[] = [];
  private _timer: number = 0;
  private _currentCow: Node = null;

  protected onLoad(): void {
    CowGenerator._instance = this;
    this._cowPrefabList.push(this.cowPrefab1);
    this._cowPrefabList.push(this.cowPrefab2);
    this._cowPrefabList.push(this.cowPrefab3);
  }

  start() {
    this.schedule(this.generateCow, this.cowGenerateRate);
  }

  update(deltaTime: number) {}

  // Add random number generator from 0 to 2
  generateRandomNumber() {
    return Math.floor(Math.random() * 3);
  }

  // Add generateCow function at each cowGnerateTimer
  generateCow() {
    const cowPrefab = this._cowPrefabList[this.generateRandomNumber()];
    const cow = instantiate(cowPrefab);
    this.cowList.push(cow);
    this.node.addChild(cow);
    cow.setPosition(544, -60, 0);
  }

  // Remove the cow from cowList
  removeCow(cow: Node) {
    const index = this.cowList.indexOf(cow);
    if (index > -1) {
      this.cowList.splice(index, 1);
    }
  }

  removeAllCow() {
    this.cowList.forEach((cow) => {
      cow.destroy();
    });
    this.cowList = [];
  }
}
