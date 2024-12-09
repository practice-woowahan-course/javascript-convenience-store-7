import { MissionUtils } from "@woowacourse/mission-utils";
import Parser from "../utils/Parser.mjs"
import InputView from "../view/InputView.mjs"
import StockController from "./StockController.js";

class InputController{
    static async getProductAmount(){
        try {
            const inputProductAmount = await InputView.inputBuyProductNameAndAmount();
            const stockController = StockController.getInstance();
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

    static async getPromotionFreeApply(){
        try {
            const inputPromotionFreeApply = await InputView.inputPromotionFreeApply();
            return Parser.parseTrueOrFalseYN(inputPromotionFreeApply);
        } catch (error) {
            MissionUtils.Console.print(error.message);
            return this.getPromotionFreeApply();
        }
    }

    static async getPromotionGiveUp(){
        try {
            const inputPromotionGiveUp = await InputView.inputPromotionGiveUp();
            return Parser.parseProductAmount(inputPromotionGiveUp);
        } catch (error) {
            MissionUtils.Console.print(error.message);
            return this.getPromotionGiveUp();
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