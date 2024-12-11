import MainController from "./controller/MainController.js";


class App {
  async run() {
    const mainController = new MainController();
    await mainController.setting();
    await mainController.startPurchase();
  }
}

export default App;
