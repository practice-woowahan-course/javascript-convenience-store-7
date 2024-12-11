import { MissionUtils } from "@woowacourse/mission-utils";
import Parser from "../utils/Parser.js"
import InputView from "../view/InputView.js"
import StockController from "./StockController.js";

class InputController{
    static async getProductAmount(){
        try {
            const inputProductAmount = await InputView.inputBuyProductNameAndAmount();
            const parsedProductAmount = Parser.parseProductAmount(inputProductAmount);

            return parsedProductAmount;
        } catch (error) {
            MissionUtils.Console.print(error.message);
            return this.getProductAmount();
        }
    }

    static async getMembershipDiscount(){
        try {
            const inputMembershipDiscount = await InputView.inputMembershipDiscount();
            return Parser.parseTrueOrFalseYN(inputMembershipDiscount);
        } catch (error) {
            MissionUtils.Console.print(error.message);
            return this.getMembershipDiscount();
        }
    }

    static async getPromotionFreeApply(name, quantity){
        try {
            const inputPromotionFreeApply = await InputView.inputPromotionFreeApply(name, quantity);
            return Parser.parseTrueOrFalseYN(inputPromotionFreeApply);
        } catch (error) {
            MissionUtils.Console.print(error.message);
            return this.getPromotionFreeApply(name, quantity);
        }
    }

    static async getPromotionGiveUp(name, amount){
        try {
            const inputPromotionGiveUp = await InputView.inputPromotionGiveUp(name, amount);
            return Parser.parseTrueOrFalseYN(inputPromotionGiveUp);
        } catch (error) {
            MissionUtils.Console.print(error.message);
            return this.getPromotionGiveUp(name, amount);
        }
    }

    static async getPurchaseMore(){
        try {
            const inputPurchaseMore = await InputView.inputPurchaseMore();
            return Parser.parseTrueOrFalseYN(inputPurchaseMore);
        } catch (error) {
            MissionUtils.Console.print(error.message);
            return this.getPurchaseMore();
        }
    }
}

export default InputController;