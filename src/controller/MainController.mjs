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
        const stockController = new StockController();
        await stockController.getProductFile();
        const messageCurrentStockStatus = stockController.outputStockData();
        OutputController.printCurrentStockStatus(messageCurrentStockStatus);
        // const productAndAmount = await InputController.getProductAmount();    
        // MissionUtils.Console.print(productAndAmount);
    }
    
}

export default MainController;