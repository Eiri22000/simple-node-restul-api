const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

// Now we get json data from the client
app.use(express.json());
// data from URL params
app.use(express.urlencoded({extended: false}));

// Set handlebar template in use
app.engine('handlebars',exphbs.engine({defaultLayout: 'main'}));
app.set('view engine','handlebars');

app.get('/books', (req,res) => {
    res.render('contact');
});

let books = 
[
    {id: 1, name: 'Harry Potter and the Philosophers Stone', release: 1997, readed: true},
    {id: 2, name: 'Harry Potter and the Chamber of Secrets', release: 1998, readed: true},
    {id: 3, name: 'Harry Potter and the Prisoner of Azkaban', release: 1999, readed: false},
    {id: 4, name: 'Harry Potter and the Goblet of Tormentor', release: 2100, readed: true},
    {id: 5, name: 'Harry Potter and the Order of the Phoenix', release: 2003, readed: false},
    {id: 6, name: 'Harry Potter and the Half-Blood Prince', release: 2005, readed: false},
    {id: 7, name: 'Harry Potter and the Deathly Hallows', release: 2007, readed: true}
]

// Get all the books
app.get('/books', (req,res) => {
    res.json(books);
});

// Get one book
app.get('/books/:id', (req,res) => {
    const bookID = Number(req.params.id);
    const book = books.find(book => book.id === bookID);
    
    if(book)
    {
        res.status(200).json(book);
    }
    else 
    {
        res.status(404).json(
            {
                msg: "Not found"
            }
        )
    }
});

// Delete one book
app.delete('/books/:id', (req,res) => {
    const bookID = Number(req.params.id);
    // Check if we have a product with the id
    const book = books.find(book => book.id === bookID);

    if(book)
    {
        books = books.filter(book => book.id !== bookID);
        res.status(200).json(
            {
                id: bookID
            }
        )
    }
    else 
    {
        res.status(404).json(
            {
                msg: 'could not find the book'
            }
        );
    }
}); 

//Create new book
app.post('/books', (req,res) =>{

    const lastId = books[books.length-1].id;
    const newId = lastId + 1;

    newBook = {
        id: newId,
        name: req.body.name,
        release: req.body.release,
        readed: req.body.readed
    }
    books.push(newBook);
    res.location('http://localhost:5500/books/'+newId);
    res.status(201).json(newBook);
});

// Update book
app.patch('/books/:id', (req,res) => {
    const idToUpdate = Number(req.params.id);
    const newName = req.body.name;
    const newRelease = req.body.release;

    books.forEach(book => {
        if (book.id === idToUpdate) {
            book.name = newName;
            book.release = newRelease;
        }
    });

    const book = books.find(book => book.id === idToUpdate);
    if (book)
    {
        res.status(200).json(book);
    }
    else 
    {
        res.status(404).json({msg: "Update was not successful."});
    }
});

// Set the port
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));