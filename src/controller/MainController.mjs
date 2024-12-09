import { MissionUtils } from "@woowacourse/mission-utils";
import InputController from "./InputController.mjs";
import FileController from "./FileController.mjs";
import OutputController from "./OutputController.mjs";
import OutputView from "../view/OutputView.mjs";
import StockController from "./StockController.js";

class MainController {
    async start() {
        OutputView.opening();
        OutputView.printBreak();
        const fileController = new FileController();
        const productFile = await fileController.getProducts();
        const promotionFile = await fileController.getPromotions();
        const stockController = StockController.getInstance();
        await stockController.allocateFile(productFile, promotionFile);

        const messageCurrentStockStatus = stockController.outputStockData();
        OutputController.printCurrentStockStatus(messageCurrentStockStatus);
        const productAndAmountList = await InputController.getProductAmount();

        stockController.getPaymentHistory(productAndAmountList);
        stockController.getStock();

        // const membershipDiscount = await InputController.getMembershipDiscount();
    }
    
}

export default MainController;