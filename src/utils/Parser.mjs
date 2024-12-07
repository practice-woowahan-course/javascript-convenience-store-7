import Product from "../model/Product.mjs";
import StockProduct from "../model/StockProduct.mjs";
import Validator from "./Validator.mjs";

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
}
export default Parser;
