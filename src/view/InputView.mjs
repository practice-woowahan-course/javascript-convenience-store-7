import { MissionUtils } from "@woowacourse/mission-utils";

class InputView {
  static async inputBuyProductNameAndAmount() {
    const inputProductAmount = await MissionUtils.Console.readLineAsync(
      `구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])`
    );
    return inputProductAmount;
  }


}

export default InputView;
