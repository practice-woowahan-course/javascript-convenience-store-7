import MainController from "./controller/MainController.mjs";


class App {
  async run() {
    const mainController = new MainController();
    await mainController.start(); 
  }
}

export default App;
