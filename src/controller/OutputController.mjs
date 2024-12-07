import { MissionUtils } from "@woowacourse/mission-utils";
import Parser from "../utils/Parser.mjs";
import OutputView from "../view/OutputView.mjs";
import FileController from "./FileController.mjs";
import StockController from "./StockController.js";

class OutputController {
    
    static printCurrentStockStatus(outputStockDataList) {
        outputStockDataList.forEach((message) => {
            MissionUtils.Console.print(message)
        })
    }
}

export default OutputController;
