const ADD_NEW_BOOK_BUTTON = document.querySelector("i[title='Add new book!']");
const BODY = document.querySelector("body");
const table = document.querySelector("main > table > tbody");

let myLibrary = [];

function Book(title, author, numOfPages, readStatus){
    this.title = title;
    this.author = author;
    this.numOfPages = numOfPages;
    this.readStatus = readStatus;
}

Book.prototype.info = function(){
    let numberOfPages = (this.numOfPages === "Unknown") ? "unknown number of" : this.numOfPages;
    let readStatus = (this.readStatus) ? "Has been read!" : "Hasn't been read yet!"
    return `${this.title} by ${this.author}, ${numberOfPages} pages. ${readStatus}`;
}

function addBookToLibrary(title, author, numOfPages, readStatus){
    let newBook = new Book(title, author, numOfPages, readStatus);
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

function removeBook(book){
    let rowIndex = book.getAttribute("data-index");
    myLibrary.splice(rowIndex, 1);
}

function clearTable(){
    let books = document.querySelectorAll("table > tbody > tr");
    for (let book of books){
        book.remove();
    }
}

function updateTable(){
    clearTable()
    populateTableWithBooks();
}

function populateTableWithBooks(){
    for (book of myLibrary){
        let bookTableRow = document.createElement("tr");
        bookTableRow.classList.add("book");
        bookTableRow.setAttribute("data-index", document.querySelectorAll("tr").length - 1);
        let title = document.createElement("td");
        title.innerText = book.title;
        let author = document.createElement("td");
        author.innerText = book.author;
        let numberOfPages = document.createElement("td");
        numberOfPages.innerText = book.numOfPages;
        let readStatus = document.createElement("td");
        readStatus.innerText = (book.readStatus) ? "read" : "unread"
        let removeButtonCell = document.createElement("td");
        let removeButton = document.createElement("i");
        removeButton.classList.add("fa-solid", "fa-trash-can");
        removeButton.setAttribute("title", "Delete book");
        removeButton.addEventListener("click", ()=>{
            //There should be a confirmation modal
            removeBook(bookTableRow);
            updateTable();
        })
        removeButtonCell.appendChild(removeButton);
        appendAllChildren(bookTableRow, [title, author, numberOfPages, readStatus, removeButtonCell]);
        table.appendChild(bookTableRow);
    }
}
populateTableWithBooks();

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

function indicateInputIsRequired(input){
    input.setAttribute("placeholder", "required!");
    input.classList.toggle("red-border");
}

function clearInputsStyleToCheckAgain(inputs){
    for (let input of inputs){
        if (input.classList.contains("red-border")) input.classList.toggle("red-border");
    }
    return;
}

function toggleAnimation(element, animationName){
    element.classList.toggle(animationName);
    return;
}

function displayForm(){
    // Don't create a new form if there's one already active.
    if (document.querySelector("form")) return;

    // Create the form modal.
    const FORM_MODAL = document.createElement("form");
    FORM_MODAL.classList.add("form-modal");
    setMultipleAttributes(FORM_MODAL, {"method":"POST", "action":""});

    // Create an outer section which when clicked will close the modal.
    // This lesson by Wes Bos was super helpful regarding making the modal close. https://wesbos.com/javascript/06-serious-practice-exercises/click-outside-modal
    const OUTER_MODAL = document.createElement("div");
    OUTER_MODAL.classList.add("outer-modal");
    OUTER_MODAL.addEventListener("click", (e)=>{
        const isOutside = !e.target.closest(".form-modal");
        if (isOutside) {
            toggleAnimation(FORM_MODAL, "slide-out-to-the-left");
            setTimeout(()=>{OUTER_MODAL.remove();}, 100);
        };
    });

    // Create the inputs.
    const titleInput = createInput("text", "title", "title");
    const titleLabel = createLabel("title", "Title");
    titleLabel.innerHTML += "<span title=required> * </span>";
    const authorInput = createInput("text", "author", "author");
    const authorLabel = createLabel("author", "Author");
    authorLabel.innerHTML += "<span title=required> * </span>";
    const numberOfPagesInput = createInput("number", "number-of-pages", "number-of-pages");
    const numberOfPagesLabel = createLabel("number-of-pages", "Number of pages");
    const readStatusContainer = document.createElement("div");
    readStatusContainer.classList.add("read-status-container");
    const readStatusInput = createInput("checkbox", "read-status", "has-been-read");
    const readStatusLabel = createLabel("read-status", "Have you read it?");
    const SUBMIT_BUTTON = document.createElement("button");
    SUBMIT_BUTTON.setAttribute("type", "button");
    SUBMIT_BUTTON.innerText = "Add book!";
    SUBMIT_BUTTON.addEventListener("click", ()=>{
        // When the form is submitted, check that the required fields have been filled.
        clearInputsStyleToCheckAgain([titleInput, authorInput]);
        if (!titleInput.value || !authorInput.value){
            if(!titleInput.value){
                indicateInputIsRequired(titleInput);
            }
            if(!authorInput.value){
                indicateInputIsRequired(authorInput);
            }
            return;
        }
        // If the form was submitted successfully, push the book to the library array, update the table and remove the modal.
        let title = titleInput.value;
        let author = authorInput.value;
        let numberOfPages = (numberOfPagesInput.value.length !== 0) ? numberOfPagesInput.value : "Unknown";
        let readStatus = readStatusInput.checked;
        addBookToLibrary(title, author, numberOfPages, readStatus);
        updateTable();
        toggleAnimation(FORM_MODAL, "slide-out-to-the-left");
        setTimeout(()=>{OUTER_MODAL.remove();}, 100);
    })

    // Append the elements created
    appendAllChildren(readStatusContainer, [readStatusLabel, readStatusInput]);
    let formChildNodes = [titleLabel, titleInput, authorLabel, authorInput, numberOfPagesLabel, numberOfPagesInput, readStatusContainer, SUBMIT_BUTTON];
    appendAllChildren(FORM_MODAL, formChildNodes);
    OUTER_MODAL.appendChild(FORM_MODAL);
    BODY.appendChild(OUTER_MODAL);
}