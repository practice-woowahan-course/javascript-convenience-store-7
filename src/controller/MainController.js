import { MissionUtils } from "@woowacourse/mission-utils";
import InputController from "./InputController.js";
import FileController from "./FileController.js";
import OutputController from "./OutputController.js";
import OutputView from "../view/OutputView.js";
import StockController from "./StockController.js";
import ExtraQuestionController from "./ExtraQuestionController.js";

class MainController {
    async setting() {
        const [productFile, promotionFile] = await this.loadFile();
        const stockController = StockController.getInstance();
        await stockController.allocateFile(productFile, promotionFile);       
    }

    async loadFile() {
        const fileController = new FileController();
        const productFile = await fileController.getProducts();
        const promotionFile = await fileController.getPromotions();
        return [productFile, promotionFile];
    }

    async startPurchase() {
        OutputView.openingView();
        OutputView.printBreakView();
        const stockController = StockController.getInstance();
        const messageCurrentStockStatus = stockController.outputStockData();
        const outputController = new OutputController();
        outputController.printCurrentStockStatus(messageCurrentStockStatus);
        const productAndAmountList = await InputController.getProductAmount();
        const filterRegularProducts = stockController.filterRegularProducts(productAndAmountList);
        const paymentHistory = stockController.getPaymentHistory(productAndAmountList);
        if(!(stockController.isPossiblePromotionAmount(productAndAmountList))) {
            // 현재 {상품명} {수량}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)
            for (const regularProduct of filterRegularProducts){
                const isPromotionGiveUp = await InputController.getPromotionGiveUp(regularProduct.name, regularProduct.promotionRegular + regularProduct.generalRegular );
                if(!isPromotionGiveUp) {
                    stockController.recoveryInventory(filterRegularProducts);
                }
            }
        }

        // 현재 {상품명}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)
        for (const product of stockController.isPossibleGetFree(productAndAmountList)){
           
            if(!product) continue;
            const [name, quantity, isFreePossible] = product;

            if(isFreePossible) {
                const isFreeApply = await InputController.getPromotionFreeApply(name, quantity);
                if (isFreeApply){
                    paymentHistory.push(stockController.addFreeMore(name, quantity));
                }
            }
        }
        // 화이팅 ~ 
        // 감사합니다!!!!
        const isMembershipDiscount = await InputController.getMembershipDiscount();
        let membershipDiscount = 0;
        if (isMembershipDiscount) {
            membershipDiscount += ExtraQuestionController.membershipDiscount(paymentHistory);
        }
        outputController.printReceipt(paymentHistory, membershipDiscount);
        const isContinue = await InputController.getPurchaseMore();
        if (isContinue) this.startPurchase();
    }
    
}

export default MainController;