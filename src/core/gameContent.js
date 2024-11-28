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
      event.trigger("chooseHero");
    }
    function step2() {
      event.trigger("gameStart");
    }
    function step3() {
      event.trigger("gameDraw");
    }
    function step4() {
      event.trigger("gamePhaseLoop");
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
      game.log(`你处于【${me.playerSeatNum}】号位`);
      // 当前玩家优先选择
      await game.delay(3000);
      me.chooseHero(heroList[get.random(0, heroList.length - 1)]);
      game.log(`【你选择了${me.playerTitle}: ${me.playerName}】`);
      // 其他玩家轮流选
      for (let i = 0; i < playerList.length; i++) {
        // 跳过当前玩家
        if (playerList[i].playerSeatNum === me.playerSeatNum) {
          continue;
        }
        await game.delay(3000);
        // 不重复选择
        const restHeroList = heroList.filter(
          (i) => !playerList.map((p) => p.playerId).includes(i.id)
        );
        const hero = restHeroList[get.random(0, restHeroList.length - 1)];
        playerList[i].chooseHero(hero);
        game.log(
          `【${playerList[i].playerSeatNum}号位选择了${playerList[i].playerTitle}: ${playerList[i].playerName}】`
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
      const [playerList, cardPile] = [get.playerList(), get.cardPile()];
      for (let i = 0; i < playerList.length; i++) {
        await game.delay(3000);
        playerList[i].handCards = cardPile.splice(0, 2);
        const cardNames = playerList[i].handCards
          .map((i) => i.cardName)
          .join(",");
        game.log(`玩家【${playerList[i].playerName}】获得两张牌:${cardNames}`);
      }
      event.finish();
    }
    return {
      step1,
    };
  },
  gamePhaseLoop: function ({ event, game, get, set, ui }) {
    async function step1() {
      let [round, playerList, current] = [
        get.round(),
        get.playerList(),
        get.current(),
      ];
      // current为空，默认为第一个玩家
      if (!current.playerId) {
        set.current(playerList[0]);
        current = get.current();
      }
      // playerSeatNum = 0 轮次+1
      const playerSeatNum = current.playerSeatNum;
      if (playerSeatNum === 0) {
        set.round(round + 1);
        round = get.round();
        game.log(`第【${round}】轮`);
      }
      if (round > 3) {
        game.over();
        return;
      }
      await game.delay(3000);
      game.log(`【${current.playerName}】的回合开始`);
      // todo die跳过
      event.trigger("phase");
    }
    async function step2() {
      const [playerList, current] = [get.playerList(), get.current()];
      const playerSeatNum = current.playerSeatNum;
      const nextSeatNum =
        playerSeatNum + 1 >= playerList.length ? 0 : playerSeatNum + 1;
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
};

export default GameContent;
