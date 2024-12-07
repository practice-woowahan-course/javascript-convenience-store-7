import { MissionUtils } from "@woowacourse/mission-utils";
import OutputController from "../controller/OutputController.mjs";

class OutputView {
    static opening(){
        MissionUtils.Console.print(`안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다.`);
    }

    static printBreak(){
        MissionUtils.Console.print('');
    }

    static showCurrentStockStatus(message){
        MissionUtils.Console.print(message);
    }

}

export default OutputView;