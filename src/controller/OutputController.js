import { MissionUtils } from "@woowacourse/mission-utils";
import Parser from "../utils/Parser.js";
import OutputView from "../view/OutputView.js";
import FileController from "./FileController.js";
import StockController from "./StockController.js";

class OutputController {
    printCurrentStockStatus(outputStockDataList) {
        OutputView.printCurrentStockStatusView(outputStockDataList);
    }
    printReceipt(totalBuyProductList, membershipDiscount) {
        const buyProductList = totalBuyProductList.filter((buyProduct) => buyProduct !== undefined);
        const buyProductString = this.buyProductToString(buyProductList);
        const bonusInfo = this.bonusToString(buyProductList);
        const [totalPrice, eventDiscount, totalPay] = this.finalPaymentToString(buyProductList, membershipDiscount);

        OutputView.printReceiptDefault(buyProductString, bonusInfo, totalPrice, eventDiscount, membershipDiscount.toLocaleString(), totalPay);
    }

    buyProductToString(buyProductList) {
        const messageList = buyProductList.map((buyProduct) => {
            return `${buyProduct.name}\t${buyProduct.quantity}\t${(buyProduct.price * buyProduct.quantity).toLocaleString()}`
        })
        return messageList.join('\n');
    }
    
    bonusToString(buyProductList) {
        const messageList = buyProductList.map((buyProduct) => {
            if(buyProduct.bonus !== 0){
                return `${buyProduct.name}\t${buyProduct.bonus}`
            }
        })
        return messageList.join('\n');
    }

    finalPaymentToString(buyProductList, membershipDiscount) {
        let totalAmount = 0;
        const totalPrice = buyProductList.reduce((acc, cur) => {
            totalAmount += cur.quantity;
            return acc + cur.price * cur.quantity
        } , 0);
        const eventDiscount = buyProductList.reduce((acc, buyProduct) => acc + buyProduct.bonus * buyProduct.price, 0);
        const totalPay = totalPrice - eventDiscount - membershipDiscount;        
        return [`${totalAmount}\t${totalPrice.toLocaleString()}`,`-${eventDiscount.toLocaleString()}`,`${totalPay.toLocaleString()}`]
    }
}

export default OutputController;
