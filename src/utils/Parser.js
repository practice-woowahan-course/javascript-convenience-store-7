import Product from "../model/Product.js";
import StockProduct from "../model/StockProduct.js";
import Validator from "./Validator.js";
import Promotion from "../model/Promotion.js";

function splitComma(input) {
  return input.split(",");
}

function splitBigParentheses(input) {
  return input.slice(1, input.length - 1);
}

function splitHyphen(input) {
  return input.split("-");
}

function splitLine(input) {
  return input.trim().split("\n").slice(1);
}

function getProductAndAmountList(productList) {
  return productList.map((product) => {
    Validator.isBigParentheses(product);
    Validator.isEmpty(product);
    return splitBigParentheses(product);
  });
}

class Parser {
  static parseProductAmount(input) {
    const productList = splitComma(input);
    const productAndAmountList = getProductAndAmountList(productList);
    return productAndAmountList.map((productAndAmount) => {
      const [name, quantity] = splitHyphen(productAndAmount);
      const numberQuantity = Number(quantity);
      Validator.hasProductNumber(name);
      Validator.isNaturalNumber(numberQuantity);
      Validator.isPossibleAmount(name, numberQuantity);
      return new Product(name, numberQuantity);
    });
    
  }

  static parseProductsFile(input) {
    const splittedLine = splitLine(String(input));
    return splittedLine.map((line) => {
      const [name, price, quantity, promotion] = splitComma(line);
      return new StockProduct(name, Number(price), Number(quantity), promotion);
    });
  }

  static parsePromotionFile(input) {
    const splittedLine = splitLine(String(input));
    return splittedLine.map((line) => {
      const [name,buy,get,start_date, end_date] = splitComma(line);
      return new Promotion(name, parseInt(buy), parseInt(get),new Date(start_date), new Date(end_date))
    })
    
  }

  static parseTrueOrFalseYN(input) {
    Validator.isYorN(input);
    if(input.trim() === 'Y') {
      return true;
    }
    if(input.trim() === 'N') {
      return false;
    }
  }
}
export default Parser;
