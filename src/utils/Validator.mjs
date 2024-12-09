import StockController from "../controller/StockController.js";

const Validator = {
  isBigParentheses: (input) => {
    if (input[0] !== "[" && input[input.length - 1] !== "]") {
      throw new Error(`[ERROR] 상품은 [ ]로 감싸져야 합니다.`);
    }
  },
  isEmpty: (input) => {
    if (input.trim() === "") {
      throw new Error(`[ERROR] 빈값은 허용되지 않습니다.`);
    }
  },
  hasProductNumber: (input) => {
    if (parseInt(input) || parseFloat(input)) {
      throw new Error(
        `[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.`
      );
    }
  },
  isNaturalNumber: (input) => {
    if (input <= 0 || !Number.isInteger(input)) {
      throw new Error(
        `[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요111.`
      );
    }
  },
  isYorN: (input) => {
    const yn = ['Y','N']
    if (!yn.includes(input.trim())) {
      throw new Error(
          `[ERROR] 입력값은 'Y' 또는 'N'이어야합니다.`
      )
    }
  },
  isPossibleAmount: (name, quantity) => {
    const stockController = StockController.getInstance();
    const isPossible = stockController.isPossibleAmount(name, quantity);
    if (!isPossible) {
      throw new Error('[ERROR] 구매할 수 있는 수량을 초과하였습니다.')
    }
  }
};

export default Validator;
