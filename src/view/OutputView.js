import { MissionUtils } from "@woowacourse/mission-utils";
import OutputController from "../controller/OutputController.js";

class OutputView {
  static openingView() {
    MissionUtils.Console.print(
      `안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다.`
    );
  }

  static printBreakView() {
    MissionUtils.Console.print("");
  }

  static showCurrentStockStatusView(message) {
    MissionUtils.Console.print(message);
  }

  static printCurrentStockStatusView(outputStockDataList) {
    outputStockDataList.forEach((message) => {
      MissionUtils.Console.print(message);
    });
  }

  static printReceiptDefault(buyProductList, bonusInfo, totalPrice, eventDiscount, membershipDiscount, totalPay) {
    MissionUtils.Console.print(`
===========W 편의점=============
상품명\t\t수량\t금액
${buyProductList}
===========증	정=============
${bonusInfo}
==============================
총구매액\t\t${totalPrice}
행사할인\t${eventDiscount}
멤버십할인\t-${membershipDiscount}
내실돈\t${totalPay}
`);
  }
}

export default OutputView;
