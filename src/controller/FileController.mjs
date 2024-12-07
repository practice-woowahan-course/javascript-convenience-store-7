import fs from 'fs/promises';

class FileController {

    async getFile(filePath) {
        const file = await fs.readFile(filePath, 'utf-8');
        return file;
    }

    async getProducts(){
        return this.getFile('./public/products.md');
    }

    async getPromotions(){
        return this.getFile('./public/promotions.md');
    }
}

export default FileController;