const Book = require("../model/Book");

exports.getAllBooks = (req, res, next) => {

}

exports.getBookById = (req, res, next) => {
    
}

exports.getBestRatedBooks = (req, res, next) => {
    
}

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Thing({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`
    });
  
    book.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })}) 
}

exports.modifyBook = (req, res, next) => {
    
}

exports.deleteBook = (req, res, next) => {
    
}

exports.rateBook = (req, res, next) => {
    
}