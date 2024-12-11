import BuyProduct from "../model/BuyProduct.js";
import Product from "../model/Product.js";
import RecoveryProduct from "../model/RecoveryProduct.js";
import Stock from "../model/Stock.js";
import Parser from "../utils/Parser.js";
import FileController from "./FileController.js";
import { DateTimes } from "@woowacourse/mission-utils";

class StockController {
  #stock;
  #promotionList;
  static #instance = null;

  constructor() {
    if (StockController.#instance) {
      return StockController.#instance;
    }
    StockController.#instance = this;
  }

  getStock(){
    return console.log(this.#stock);
  }

  static getInstance() {
    if (!StockController.#instance) {
      StockController.#instance = new StockController();
    }
    return StockController.#instance;
  }

  async allocateFile(productFile, promotionFile) {
    await this.getProductFile(productFile);
    await this.getPromotionFile(promotionFile);
  }

  async getProductFile(productFile) {
    this.#stock = [...Parser.parseProductsFile(productFile)];
  }

  async getPromotionFile(promotionFile) {
    this.#promotionList = [...Parser.parsePromotionFile(promotionFile)];
  }

  isPossibleAmount(name, amount) {
    let sum = 0;
    this.#stock.forEach((product) => {
      if(product.name === name) {
        sum += product.quantity;
      }})
    return sum >= amount;
  }

  // productAndAmountList : 구매하려고 하는 상품 [사이다-2],[감자칩-1]
  // List<Product(name, quantity)>
  // 구매하려고 하는 상품 리스트를 가지고 살려는 상품개수가 프로모션 재고보다 많거나 같은지만 체크
  // 프로모션 재고가 더 많으면 True

  //  현재 {상품명}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)
  // 즉, 프로모션 적용이 가능한 상품에 대해 고객이 해당 수량보다 적게 가져온 경우. 이면서 재고가 줄 수 있는 경우.
  // 2+1인데 2개를 갖고온 경우
    // 2+1인데 5개를 갖고온 경우 => willBuy % 덩이 === promotion.buy && 프로모션 재고보다 적을 경우
    // 1+1인데 1개를 갖고온 경우=>
  // output: name, promotion.get

  // 현재 콜라 4개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)
  // [콜라-10] name, quantity

  isPossibleGetFree(productAndAmountList) {
    return productAndAmountList
      .filter((p) => p !== undefined)
      .map((product) => {
        const stockPromotionProduct = this.#stock.find(
          (stockProduct) =>
            stockProduct.name === product.name && stockProduct.promotion !== "null"
        );
        if (stockPromotionProduct === undefined) return;
  
        const applyPromotion = this.#promotionList.find(
          (promotion) => promotion.name === stockPromotionProduct.promotion
        );
  
        const isFreePossible =
          (product.quantity % (applyPromotion.buy + applyPromotion.get) === applyPromotion.buy) &&
          (product.quantity <= stockPromotionProduct.quantity) &&
          (product.quantity % (applyPromotion.buy + applyPromotion.get) !== 0);
        console.log(isFreePossible);
        return [product.name, applyPromotion.get, isFreePossible];
      });
  }
  
  
  isPossiblePromotionAmount(productAndAmountList) {
    const b = productAndAmountList.filter((product) => product !== undefined).every((product) => {
      const a = this.#stock.filter((stockProduct) => stockProduct.name === product.name && stockProduct.promotion !== 'null' && stockProduct.quantity > product.quantity)
      return a;
    })
    return b;
  }

  addFreeMore(name, quantity) {
    const stockPromotionProduct = this.#stock.filter((stockProduct) => stockProduct !== undefined).find((stockProduct) => stockProduct.name === name && stockProduct.promotion !== 'null');
    stockPromotionProduct.quantity -= quantity;
    return new BuyProduct(name, quantity, stockPromotionProduct.price, quantity);
  }


  // 입력이 콜라 10인데 
  // 창고에서 프로모션 적용 가능한 개수 파악
  // 사려는 개수가 창고 프로모션 개수보다 많으면 
  // (창고 프로모션 재고 - 프로모션 적용 개수) -> 나머지1
  // (사려는 개수 - 창고 프로모션 재고) -> 나머지2
  // -> 만큼이 할인이 적용되지 않는다 하고 다시 묻기?
  
  // 창고 프로모션 재고 : 7개
  // 프로모션 적용 개수 : 6개
  // -> 나머지1 : 1
  // 사려는 개수 : 10개
  // 
  // -> 나머지2 : 3

  // applyPromotion.get *
  // Math.floor(
  //   willBuy / (applyPromotion.buy + applyPromotion.get)
  // )
  // input : List<Product(name, quantity)>
  // output: 정가 구매해야하는 List<Product(name, quantity)> 
  
  // 현재 {상품명} {수량}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)

  // 2+1, 2+1 , promotionRegular -> 2 = 8
  // 11 - promtion재고 = 3
  filterRegularProducts(paymentHistory) {
    return  paymentHistory.map((product) => {
      const stockPromotionProduct = this.#stock.find((stockProduct) => stockProduct.name === product.name && stockProduct.promotion !== 'null')
      //console.log(stockPromotionProduct);
      if(stockPromotionProduct === undefined)return;
      const applyPromotion = this.#promotionList.find((promotion) => promotion.name === stockPromotionProduct.promotion);
      const promotionLoaf = applyPromotion.get * Math.floor( product.quantity / (applyPromotion.buy + applyPromotion.get));
      const remainder1 = stockPromotionProduct.quantity - promotionLoaf * applyPromotion.buy;
      const remainder2 = product.quantity - stockPromotionProduct.quantity;
      return new RecoveryProduct(product.name, remainder1, remainder2);
    }).filter((p) => p !== undefined);
  }

  outputStockData() {
    const onlyPromotion = this.checkStockOnlyPromotion();
    const resultMessage = this.#stock.map((stockProduct) => {
      const stockPrice = String(stockProduct.price.toLocaleString());
      const stockQuantity = this.checkNoMoreQuantity(stockProduct);
      const stockPromotion = this.checkNullPromotion(stockProduct);
      let message = `- ${stockProduct.name} ${stockPrice}원 ${stockQuantity}개 ${stockPromotion}`;
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

  getPaymentHistory(productAndAmountList) {
    return productAndAmountList.map((productWillBuy) => {
      const inventoryList = this.#stock.filter(
        (stockProduct) => productWillBuy.name === stockProduct.name
      );
      return inventoryList.map((stockProduct) => {
        if (productWillBuy.quantity <= 0)
          return
        const [inPeriod, promotionInfo] = this.isPromotionPeriod(stockProduct);
        if (inPeriod) {
          return this.usePromotionInventory(productWillBuy,stockProduct,promotionInfo);
        } else {
            return this.useNormalInventory(productWillBuy, stockProduct);
        }
      });
    }).flat().filter((product)=>product !== undefined);
  }

  // filterRegularProducts => List<RecoveryProduct{'콜라', 1, 3}>
  recoveryInventory(filterRegularProducts) {
    filterRegularProducts.forEach((recoveryProduct) => {
      this.#stock.forEach((stockProduct) => {
        if(recoveryProduct.name === stockProduct.name && stockProduct.promotion !== 'null'){
          stockProduct.quantity += recoveryProduct.promotionRegular;
        }
        if(recoveryProduct.name === stockProduct.name && stockProduct.promotion === 'null'){
          stockProduct.quantity += recoveryProduct.generalRegular;
        }
      })
    })
  }

  isPromotionPeriod(stockProduct) {
    if (stockProduct.promotion === "null") {
      return [false, ""];
    }
    const currentTime = DateTimes.now();
    const promotion = this.#promotionList.filter(
      (promotion) => stockProduct.promotion === promotion.name
    )[0];
    return [
      promotion.start_date <= currentTime && promotion.end_date >= currentTime,
      promotion,
    ];
  }

  usePromotionInventory(productWillBuy, stockProduct, applyPromotion) {
      const willBuy = Math.min(productWillBuy.quantity, stockProduct.quantity);
      stockProduct.quantity -= willBuy;
      productWillBuy.quantity -= willBuy;
      return new BuyProduct(
        productWillBuy.name,
        willBuy,
        stockProduct.price,
        applyPromotion.get *
          Math.floor(
            willBuy / (applyPromotion.buy + applyPromotion.get)
          )
      );
    }

  useNormalInventory(productWillBuy, stockProduct) {
    const willBuy = Math.min(productWillBuy.quantity, stockProduct.quantity);
    stockProduct.quantity -= willBuy;
    productWillBuy.quantity -= willBuy;
    
    return new BuyProduct(
      productWillBuy.name,
      willBuy,
      stockProduct.price,
      0
    )
  }
}
export default StockController;
