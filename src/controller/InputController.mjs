import { MissionUtils } from "@woowacourse/mission-utils";
import Parser from "../utils/Parser.mjs"
import InputView from "../view/InputView.mjs"



class InputController{
    static async getProductAmount(){
        try {
            const inputProductAmount = await InputView.inputBuyProductNameAndAmount();
            return Parser.parseProductAmount(inputProductAmount);
        } catch (error) {
            MissionUtils.Console.print(error.message);
            return this.getProductAmount();
        }
    }
}

export default InputController;