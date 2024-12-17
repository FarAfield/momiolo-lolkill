import GameTest from "@/core/gameTest";

const GameContent = {
  game: function ({ event, game, get, set, ui }) {
    function step1() {
      // 创建玩家
      ui.createPlayer();
      // 创建卡牌
      ui.createCard();
      // 洗牌
      game.washCard();
      // 选择英雄
      event.trigger("chooseHero", true);
    }
    function step2() {
      event.trigger("gameStart", true);
    }
    function step3() {
      event.trigger("gameDraw", true);
    }
    function step4() {
      event.trigger("gamePhaseLoop", true);
    }
    function step5() {
      game.over();
    }
    return {
      step1,
      step2,
      step3,
      step4,
      step5,
    };
  },
  chooseHero: function ({ event, game, get, set, ui }) {
    async function step1() {
      const [playerList, me, heroList] = [
        get.playerList(),
        get.me(),
        get.heroList(),
      ];
      game.log(`你处于【${me.seatNum}】号位`);
      // 当前玩家优先选择
      await game.delay();
      me.chooseHero(heroList[get.random(0, heroList.length - 1)]);
      game.log(`你选择了【${me.title}: ${me.name}】`);
      // 其他玩家轮流选
      for (const player of playerList) {
        // 跳过当前玩家
        if (player.seatNum === me.seatNum) {
          continue;
        }
        await game.delay();
        // 不重复选择
        const restHeroList = heroList.filter(
          (i) => !playerList.map((p) => p.id).includes(i.id)
        );
        player.chooseHero(restHeroList[get.random(0, restHeroList.length - 1)]);
        game.log(
          `${player.seatNum}号位选择了【${player.title}: ${player.name}】`
        );
      }
      event.finish();
    }
    return {
      step1,
    };
  },
  gameStart: function ({ event, game, get, set, ui }) {
    async function step1() {
      event.finish();
    }
    return {
      step1,
    };
  },
  gameDraw: function ({ event, game, get, set, ui }) {
    async function step1() {
      const [playerList, drawCardNum] = [get.playerList(), get.drawCardNum()];
      for (const player of playerList) {
        await game.delay();
        player.drawCard(drawCardNum);
      }
      event.finish();
    }
    return {
      step1,
    };
  },
  gamePhaseLoop: function ({ event, game, get, set, ui }) {
    async function step1() {
      let [round, current, playerList, maxRound] = [
        get.round(),
        get.current(),
        get.playerList(),
        get.maxRound(),
      ];
      // current为空，默认为第一个玩家
      if (!current.id) {
        set.current(playerList[0]);
        current = get.current();
      }
      // seatNum = 0 轮次+1
      const seatNum = current.seatNum;
      if (seatNum === 0) {
        set.round(round + 1);
        round = get.round();
        game.log(`第【${round}】轮`);
      }
      if (round >= maxRound) {
        game.over();
        return;
      }
      await game.delay();
      if (!current.isDie()) {
        game.log(current, "回合开始");
        event.trigger("phase");
      }
    }
    async function step2() {
      const [playerList, current] = [get.playerList(), get.current()];
      const seatNum = current.seatNum;
      const nextSeatNum = seatNum + 1 >= playerList.length ? 0 : seatNum + 1;
      set.current(playerList[nextSeatNum]);
      event.goto(1);
    }
    return {
      step1,
      step2,
    };
  },
  phase: function ({ event, game, get, set, ui }) {
    function step1() {
      event.trigger("phasePre");
    }
    function step2() {
      event.trigger("phaseJudge");
    }
    function step3() {
      event.trigger("phaseDraw");
    }
    function step4() {
      event.trigger("phaseUse");
    }
    function step5() {
      event.trigger("phaseDiscard");
    }
    function step6() {
      event.trigger("phasePost");
    }
    return {
      step1,
      step2,
      step3,
      step4,
      step5,
      step6,
    };
  },
  phaseDraw: function ({ event, game, get, set, ui }) {
    async function step1() {
      const [current, phaseCardNum] = [get.current(), get.phaseCardNum()];
      await game.delay();
      current.drawCard(phaseCardNum);
      event.finish();
    }
    return {
      step1,
    };
  },
  phaseUse: function ({ event, game, get, set, ui }) {
    async function step1() {
      const [current] = [get.current()];
      game.log(current, "进入了出牌阶段");
      // 根据触发时机过滤出能使用的法术以及卡牌
      //  event.result =  chooseToUse
      // 第二步，为true,goto(1)
      event.finish();
    }
    return {
      step1,
    };
  },
  chooseToUse: function ({ event, game, get, set, ui }) {
    async function step1() {
      // player.useResult
      // useCard  /  useSpell
    }
    return {
      step1,
    };
  },
  damage: function ({ event, game, get, set, ui }) {
    async function step1() {
      const { source, targets, cards, spell, baseDamage } = event;
      game.log(source, "对", targets, `造成${baseDamage}点伤害`);
    }
    return {
      step1,
    };
  },
  damageAfter: function ({ event, game, get, set, ui }) {
    async function step1() {
      const { source, targets, cards, spell } = event;
    }
    return {
      step1,
    };
  },
};
export default Object.assign({}, GameContent, GameTest.content);
