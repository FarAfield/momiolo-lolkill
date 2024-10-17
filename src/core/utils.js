const AsyncFunction = async function () {}["constructor"];
// 判断是否是async函数
function isAsyncFunction(fn) {
  return typeof fn === "function" && fn instanceof AsyncFunction;
}
const GeneratorFunction = function* () {}["constructor"];
// 判断是否是generator函数
function isGeneratorFunction(fn) {
  return typeof fn === "function" && fn instanceof GeneratorFunction;
}
// 延时函数，参数毫秒
function delay(ms = 3000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 自动执行Generator函数（同步）
function runGen(gen) {
  if (!isGeneratorFunction(gen)) {
    console.error("The function is not a generator function.");
    return;
  }
  const g = gen();
  let res = g.next();
  while (!res.done) {
    res = g.next(res.value);
  }
  return res.value;
}
// 自动执行Generator函数（异步）
function runGenAsync(gen) {
  if (!isGeneratorFunction(gen)) {
    console.error("The function is not a generator function.");
    return;
  }
  const g = gen();
  function next(data) {
    var result = g.next(data);
    if (result.done) {
      return result.value;
    }
    result.value.then(function (data) {
      next(data);
    });
  }
  next();
}
function createSeedRadom(initSeed) {
  function seedRadom(seed) {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }
  let seed = initSeed;
  return () => {
    const result = seedRadom(seed);
    seed += result;
    return result;
  };
}
function getRadomBySeed(seed, count) {
  const radom = createSeedRadom(seed);
  let result = undefined;
  for (let i = 0; i < count; i++) {
    result = radom();
  }
  return result;
}

function gameLog() {
  console.log(...arguments);
}

// 动态导入模块,此处的路径是相对路径
function dynamicImportModule(path) {
  return new Promise((resolve, reject) => {
    import(`../gamePackage/${path}.js`)
      .then((module) => {
        resolve(module);
      })
      .catch((err) => reject(err));
  });
}

export {
  AsyncFunction,
  isAsyncFunction,
  GeneratorFunction,
  isGeneratorFunction,
  delay,
  runGen,
  runGenAsync,
  createSeedRadom,
  getRadomBySeed,
  gameLog,
  dynamicImportModule,
};

// 无法被实例化类(不可使用new关键字)
export class UnInstantiated {
  constructor() {
    throw new Error("This class cannot be instantiated.");
  }
}
