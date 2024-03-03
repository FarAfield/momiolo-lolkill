import { EventManager } from "@/core/gameEvent";

function createOpportunityEvent(name) {
  return ["Before", "Begin", "End", "After"].map((i) => `${name}${i}`);
}
const globalEvent = [
  "globalGameStart", // 所有人都展示武将牌后
  "globalGameDraw", // 游戏开始阶段
  "globalRound",
  "globalGameEnd",
];
const globalGameDrawEvent = createOpportunityEvent("globalGameDraw");
const globalRoundEvent = ["roundBegin", "phaseLoop", "roundEnd"];
const phaseLoopEvent = [
  "phaseStart", // 开始
  "phaseJudge", // 判定
  "phaseDrawCard", // 摸牌
  "phaseUseCard", // 出牌
  "phasedDisCard", // 弃牌
  "phaseChange", // 阶段变更
];
const phaseStartEvent = createOpportunityEvent("phaseStart");
const phaseJudgeEvent = createOpportunityEvent("phaseJudge");
const phaseDrawCardEvent = createOpportunityEvent("phaseDrawCard");
const phaseUseCardEvent = createOpportunityEvent("phaseUseCard");
const phasedDisCardEvent = createOpportunityEvent("phasedDisCard");

const GameContent = {
  game: function ({ event }) {
    event.hasNext = true;
    event.next = globalEvent;
  },
  globalGameStart: function ({ event }) {
    event.finish();
  },
  globalGameDraw: function ({ event }) {
    event.hasNext = true;
    event.next = globalGameDrawEvent;
  },
  globalRound: function ({ event }) {
    event.finish();
  },
  globalGameEnd: function ({ event }) {
    event.finish();
  },
  globalGameDrawBefore: function ({ event }) {
    event.finish();
  },
  globalGameDrawBegin: function ({ event }) {
    event.finish();
  },
  globalGameDrawEnd: function ({ event }) {
    event.finish();
  },
  globalGameDrawAfter: function ({ event }) {
    // event.finish();
    event.triggerAsync("extraDraw");
  },
};

export default GameContent;
