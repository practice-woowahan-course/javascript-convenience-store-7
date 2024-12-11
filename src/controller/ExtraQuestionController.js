import StockController from "./StockController.js";

export default class ExtraQuestionController {
  static membershipDiscount(buyProductList) {
    const discountPrice = buyProductList
      .filter((buyProduct) => {
        return buyProduct !== undefined && buyProduct.bonus === 0;
      })
      .reduce((acc, cur) => {
        return acc + cur.quantity * cur.price;
      }, 0);
    return Math.min(discountPrice * 0.3, 8000);
  }

  // 현재 {상품명} {수량}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)
  // paymentHistory : List<BuyProduct {name, quantity, price, bonus}>
  // 이 리스트에 bonus 0개 이면서 같은 이름 바이프로덕트의 bonus가 1이상인 프로덕트가 있으면 bonus 0개의 quantity만큼 정가결제됨.
  // output: 정가결제되는 name, quantity
  
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


  static regularPrice(paymentHistory) {
    const stockController = StockController.getInstance();

    const regularQuantity = paymentHistory.filter((buyProduct) => buyProduct.bonus === 0).map((buyProduct) => buyProduct.quantity);
  }

  // 현재 {상품명}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)
  static getFreeMore() {

  }
}

/*
- 콜라 1,000원 7개 탄산2+1
- 콜라 1,000원 10개
- 사이다 1,000원 8개 탄산2+1
- 사이다 1,000원 7개
- 오렌지주스 1,800원 9개 MD추천상품
- 오렌지주스 1,800원 재고 없음
- 탄산수 1,200원 5개 탄산2+1
- 탄산수 1,200원 재고 없음
- 물 500원 10개
- 비타민워터 1,500원 6개
- 감자칩 1,500원 5개 반짝할인
- 감자칩 1,500원 5개
- 초코바 1,200원 5개 MD추천상품
- 초코바 1,200원 5개
- 에너지바 2,000원 재고 없음
- 정식도시락 6,400원 8개
- 컵라면 1,700원 1개 MD추천상품
- 컵라면 1,700원 10개

구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])
[콜라-10]

현재 콜라 4개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)
Y

*/