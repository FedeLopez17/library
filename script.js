const ADD_NEW_BOOK_BUTTON = document.querySelector("button");
const BODY = document.querySelector("body");
const table = document.querySelector("main > table > tbody");

let myLibrary = [];

function Book(title, author, numOfPages, hasBeenRead){
    this.title = title;
    this.author = author;
    this.numOfPages = numOfPages;
    this.hasBeenRead = hasBeenRead;
}

Book.prototype.info = function(){
    let numberOfPages = (this.numOfPages === "Unknown") ? "unknown number of" : this.numOfPages;
    let hasBeenRead = (this.hasBeenRead) ? "Has been read!" : "Hasn't been read yet!"
    return `${this.title} by ${this.author}, ${numberOfPages} pages. ${hasBeenRead}`;
}

function addBookToLibrary(title, author, numOfPages, hasBeenRead){
    let newBook = new Book(title, author, numOfPages, hasBeenRead);
    myLibrary.push(newBook);
}

// Hard coded books for test purposes
addBookToLibrary("Harry Potter and the Philosopher's Stone", "J.K. Rowling", 223, true);
addBookToLibrary("Harry Potter and the Chamber of Secrets", "J.K. Rowling", 251, true);
addBookToLibrary("Harry Potter and the Prisoner of Azkaban", "J.K. Rowling", 317, true);
addBookToLibrary("Harry Potter and the Goblet of Fire", "J.K. Rowling", 636, true);
addBookToLibrary("Harry Potter and the Order of the Phoenix", "J.K. Rowling", 766, false);
addBookToLibrary("Harry Potter and the Half-Blood Prince", "J.K. Rowling", 607, false);
addBookToLibrary("Harry Potter and the Deathly Hallows", "J.K. Rowling", 607, false);

function displayBooks(){
    for (book of myLibrary){
        let bookInTable = document.createElement("tr");
        bookInTable.classList.add("book");
        bookInTable.setAttribute("data-index", document.querySelectorAll("tr").length - 1);
        let title = document.createElement("td");
        title.innerText = book.title;
        let author = document.createElement("td");
        author.innerText = book.author;
        let numberOfPages = document.createElement("td");
        numberOfPages.innerText = book.numOfPages;
        let hasBeenRead = document.createElement("td");
        hasBeenRead.innerText = (book.hasBeenRead) ? "Has been read!" : "Hasn't been read yet!"
        let removeButtonCell = document.createElement("td");
        let removeButton = document.createElement("button");
        removeButton.addEventListener("click", ()=>{
            let rowIndex = removeButton.parentNode.parentNode.getAttribute("data-index");
            myLibrary.splice(rowIndex, 1);
            updateBooks();
        })
        removeButtonCell.appendChild(removeButton);
        appendAllChildren(bookInTable, [title, author, numberOfPages, hasBeenRead, removeButtonCell]);
        table.appendChild(bookInTable);
    }
}
displayBooks();

function updateBooks(){
    let books = document.querySelectorAll("table > tbody > tr");
    for (let book of books){
        book.remove();
    }
    displayBooks();
}

ADD_NEW_BOOK_BUTTON.addEventListener("click", displayForm);

function setMultipleAttributes(element, attributes){
    for(let key in attributes){
        element.setAttribute(key, attributes[key]);
    }
}

function appendAllChildren(parentNode, children){
    for(let child of children){
        parentNode.appendChild(child);
    }
}

function createInput(type, id, name){
    let input = document.createElement("input");
    setMultipleAttributes(input, {"type":type, "id":id, "name":name});
    return input;
}

function createLabel(inputId, innerText){
    let label = document.createElement("label");
    label.setAttribute("for", inputId);
    label.innerText = innerText;
    return label;
}

function displayForm(){
    if (document.querySelector("form")) return;
    const FORM_MODAL = document.createElement("form");
    setMultipleAttributes(FORM_MODAL, {"method":"POST", "action":""});
    const titleInput = createInput("text", "title", "title");
    const titleLabel = createLabel("title", "Title");
    titleLabel.innerHTML += "<span title=required> * </span>";
    const authorInput = createInput("text", "author", "author");
    const authorLabel = createLabel("author", "Author");
    authorLabel.innerHTML += "<span title=required> * </span>";
    const numberOfPagesInput = createInput("number", "number-of-pages", "number-of-pages");
    const numberOfPagesLabel = createLabel("number-of-pages", "Number of pages");
    const hasBeenReadInput = createInput("checkbox", "has-been-read", "has-been-read");
    const hasBeenReadLabel = createLabel("has-been-read", "Have you read it?");
    const SUBMIT_BUTTON = document.createElement("button");
    SUBMIT_BUTTON.setAttribute("type", "button");
    SUBMIT_BUTTON.innerText = "Add book!";
    SUBMIT_BUTTON.addEventListener("click", ()=>{
        if (!titleInput.value || !authorInput.value){
           alert("Please fill the required fields!");
            return;
        }
        let title = titleInput.value;
        let author = authorInput.value;
        let numberOfPages = (numberOfPagesInput.value.length !== 0) ? numberOfPagesInput.value : "Unknown";
        let hasBeenRead = hasBeenReadInput.checked;
        addBookToLibrary(title, author, numberOfPages, hasBeenRead);
        updateBooks();
        FORM_MODAL.remove();
    })
    let formChildNodes = [titleLabel, titleInput, authorLabel, authorInput, numberOfPagesLabel, numberOfPagesInput, hasBeenReadLabel, hasBeenReadInput, SUBMIT_BUTTON];
    appendAllChildren(FORM_MODAL, formChildNodes);
    BODY.appendChild(FORM_MODAL);
}