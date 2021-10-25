/*
    Funções utilitarias. Permitem recuperar um texto apartir do id da tag HTML e recuperar uma imagem
    apartir da tag HTML
*/

class Util {
    static getTextByID(elementID) {
        var element = document.getElementById(elementID);

        if(!element) {
            console.log("Sharder " + elementID + " não encontrado ...");
            return null;
        }

        if(element.text == "") {
            console.log("Sharder " + elementID + " vazio ...");
            return null;
        }

        return element.text;
    }

    static getImageByID(elementID) {
        var element = document.getElementById(elementID);

        if(!element) {
            console.log("Image " + elementID + " não encontrado ...");
            return null;
        }

        if(element.text == "") {
            console.log("Sharder " + elementID + " vazio ...");
            return null;
        }

        return element;
    }
}