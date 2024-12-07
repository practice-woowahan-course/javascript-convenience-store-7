import Stock from "../model/Stock.mjs";
import Parser from "../utils/Parser.mjs";
import FileController from "./FileController.mjs";

class StockController {
  #stock;

  constructor() {
    this.#stock = [];
  }

  async getProductFile() {
    const fileController = new FileController();
    const fileProductData = await fileController.getProducts();
    const parsedProduct = Parser.parseProductsFile(fileProductData);
    this.#stock.push(...parsedProduct);
  }

  outputStockData() {
    const onlyPromotion = this.checkStockOnlyPromotion();
    const resultMessage = this.#stock.map((stockProduct) => {
      const stockPrice = String(stockProduct.price.toLocaleString());
      const stockQuantity = this.checkNoMoreQuantity(stockProduct);
      const stockPromotion = this.checkNullPromotion(stockProduct);
      let message = `- ${stockProduct.name} ${stockPrice}원 ${stockQuantity}개${stockPromotion}`;
      if (onlyPromotion.includes(stockProduct.name)) {
        message += `\n- ${stockProduct.name} ${stockPrice}원 재고 없음`;
      }
      return message;
    });
    return resultMessage;
  }

  checkNullPromotion(stockProduct) {
    if (stockProduct.promotion === "null") {
      return "";
    }
    return stockProduct.promotion;
  }

  checkNoMoreQuantity(stockProduct) {
    if (stockProduct.quantity === 0) {
      return "재고 없음";
    }
    return String(stockProduct.quantity.toLocaleString());
  }

  checkStockOnlyPromotion() {
    const answer = [];
    const exist = {};
    this.#stock.forEach((stockProduct) => {
      if (stockProduct.name in exist) {
        delete exist[stockProduct.name];
      } else {
        exist[stockProduct.name] = stockProduct.promotion;
      }
    });
    for (const [key, value] of Object.entries(exist)) {
      if (value !== "null") {
        answer.push(key);
      }
    }
    return answer;
  }
}
export default StockController;
