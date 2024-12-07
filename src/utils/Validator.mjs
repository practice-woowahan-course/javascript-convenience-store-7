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
};

export default Validator;
