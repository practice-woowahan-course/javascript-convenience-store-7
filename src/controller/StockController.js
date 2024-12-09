import BuyProduct from "../model/BuyProduct.mjs";
import Product from "../model/Product.mjs";
import Stock from "../model/Stock.mjs";
import Parser from "../utils/Parser.mjs";
import FileController from "./FileController.mjs";
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

  /*
  input : [ Product { name: '사이다', quantity: 2 },  Product { name: '콜라', quantity: 2 } ,  Product { name: '마운틴듀', quantity: 2 } ]
  
  1. 프로모션 기간인지 확인
  1-1. 프로모션 기간
    -> 프로모션 재고부터 처리 
        -> usePromotionInventory():
          프로모션 기간일 때 프로모션 적용해서 프로모션 재고 차감
      -> 프로모션 재고보다 양이 많은 경우 나머지 일반재고에서 차감

  1-2. 프로모션 기간이 아닌 경우 
    -> 프로모션 재고에서 먼저 차감하고 나머지 일반재고에서 차감(프로모션 적용x)(총 재고가 프로모션+일반)
      -> 프로모션 적용하지 않고 프로모션 재고 차감
        -> (만약 더 많으면) 일반 재고 차감 
   
  output : [{상품명, 영수증에 찍힐 수량, 개별 금액, 증정}, {상품명, 영수증에 찍힐 수량, 개별 금액, 증정}, {상품명, 영수증에 찍힐 수량, 개별 금액, 증정} ]
  */
  getPaymentHistory(productAndAmountList) {
    productAndAmountList.forEach((productWillBuy) => {
      const inventoryList = this.#stock.filter(
        (stockProduct) => productWillBuy.name === stockProduct.name
      );
      inventoryList.map((stockProduct) => {
        if (productWillBuy.quantity <= 0)
          return

        const [inPeriod, promotionInfo] = this.isPromotionPeriod(stockProduct);

        // 프로모션 기간일 때
        if (inPeriod) {
          // 프로모션 적용
          // return 

          // 구매하려는 개수가 프로모션 재고 내에 있으면
          this.usePromotionInventory(
            productWillBuy,
            stockProduct,
            promotionInfo
          );
        } else {

          // 일반 재고처리 
          if (productWillBuy.quantity > 0) {
            this.useNormalInventory(productWillBuy, stockProduct);
          }
          // if (productWillBuy.quantity > stockProduct.quantity) {
          //   console.log(productWillBuy, stockProduct);
            
          //   return this.useNormalInventory(productWillBuy, stockProduct);
          // } 
          // this.useNormalInventory(stockProduct);
        }
      });
    });
    return;
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

  /*
    (재고가 5개인데 2+1 제품의 입력값이 2이 들어온 경우 => 1개 무료로 받을지 물어봄) 현재 {상품명}은(는) {qunatity}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)
    (재고가 5개인데 2+1 제품의 입력값이 3이 들어온 경우 => 그냥 결제) 
    (재고가 5개인데 2+1 제품의 입력값이 4가 들어온 경우 => 3개 결제 1개 무료증정)
    (재고가 5개인데 2+1 제품의 입력값이 5가 들어온 경우 => 그냥 결제)
    (재고가 5개인데 2+1 제품의 입력값이 6이 들어온 경우 => 현재 {상품명} {qunatity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)(이 부분은 정가재고도 함께 차감))

    3 + 1
    Promotion.buy (3) > productWillBuy (1 or 2) -> 그냥 결제
    Promotion.buy (3) == productWillBuy (3) -> 현재 Promotion.get 개 더 받을 수 있다.
    Promotion.buy (3) < productWillBuy (4) -> 그냥 결제
    Promotion.buy (3) < productWillBuy (5) -> 그냥 결제

    - 콜라 1,000원 10개 탄산2+1  productWillBuy = 7

    고객
      - 구매할 개수 : 3
      - 증정 개수 :  1
      - 결제 개수 : 2
      
      -> 7 // (2 + 1)

    productWillBuy // (Promotion.buy + Promotion.get)
    
    (Promotion.buy + Promotion.get) -> 덩이

    1덩이 -> Promotion.buy + Promotion.get
    증정 -> Promotion.get

    2덩이 -> (Promotion.buy + Promotion.get) * 2 
    나머지 1 -> 일반 결제

    구매할 개수 : 7 (2+1, 2+1, 1)
    증정할 개수 : 2
    결재 개수 : 5 (Promotion.buy * 2) + 나머지 1
    
    - 콜라 1,000원 10개 탄산2+1  productWillBuy = 9

    9 // (2+1) -> 3덩이
    나머지 0

    구매할 개수 : 9 (2+1, 2+1, 2+1)
    증정할 개수 : 3 (Promotion.get * 3덩이)
    결재 개수 : 6 (Promotion.buy * 3덩이)

  10개가 있는데 11 ~ 
  수식대로 처리하고 나머지 개수를 useNormalInventory()

  */

  // productWillBuy : 살려고하는 거 -> Product { name: '사이다', quantity: 2 }
  // stockProduct: 재고 현황 ->   StockProduct { name: '콜라', price: 1000, quantity: 10, promotion: '탄산2+1}
  // applyPromotion: 적용될 프로모션 정보 Promotion { name,buy,get,start_date,end_date }

  // output : class BuyProduct
  usePromotionInventory(productWillBuy, stockProduct, applyPromotion) {
      const willBuy = Math.min(productWillBuy.quantity, stockProduct.quantity);
      stockProduct.quantity -= willBuy;
      productWillBuy.quantity -= willBuy;
      return new BuyProduct(
        productWillBuy.name,
        productWillBuy.quantity,
        stockProduct.price,
        applyPromotion.get *
          Math.floor(
            productWillBuy.quantity / (applyPromotion.buy + applyPromotion.get)
          )
      );
    }

  useNormalInventory(productWillBuy, stockProduct) {
    console.log('stockProduct qua', stockProduct);
    stockProduct.quantity -= productWillBuy.quantity;

    return new BuyProduct(
      productWillBuy.name,
      productWillBuy.quantity,
      stockProduct.price,
      0
    )
  }

  /*
  input : [{상품명, 수량, 개별 금액, 증정}, {상품명, 수량, 개별 금액, 증정}, {상품명, 수량, 개별 금액, 증정} ]

  output : {
      상품리스트 : ['상품명\t수량\t금액', '상품명\t수량\t금액' , '상품명\t수량\t금액'] ,
      증정 : ['상품명\t수량'],
      결과 : []
      }
  ===========W 편의점=============
  상품명		수량	금액
  콜라		3 	3,000
  에너지바 		5 	10,000
  ===========증	정=============
  콜라		1
  ==============================
  총구매액		8	13,000
  행사할인			-1,000
  멤버십할인			-3,000
  내실돈			 9,000
*/
}
export default StockController;
