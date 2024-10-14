// App.js
import React, {useState, useEffect} from 'react';
import {Worker, Viewer} from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);  // State to store list of books
  const [title, setTitle] = useState('');  // State for the book title input
  const [pdfFile, setPdfFile] = useState(null);  // State to store the PDF file URL
  const [pdfError, setPdfError] = useState('');  // State for error messages
//   //light/dark button
//   const checkbox = document.getElementById("checkbox");
//
// // Когато чекбоксът се промени (отбележен или не), темата ще се смени
//   checkbox.addEventListener("change", () => {
//     // Превключва (toggle) класовете "dark" и "light" на тялото (body)
//     document.body.classList.toggle("dark");
//     document.body.classList.toggle("light");
//   });


  // Function to fetch all books from the API
  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/books');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setBooks(data);  // Update the state with the fetched books
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  // Handle file change event for the file input
  const handleFileChange = (e) => {
    let file = e.target.files[0];

    if (file && file.type === 'application/pdf') {
      setPdfError('');
      setPdfFile(URL.createObjectURL(file));  // Create a URL for the selected PDF file
    } else {
      setPdfError('Please select a valid PDF file.');  // Error message for invalid file
      setPdfFile(null);
    }
  };

  // Function to upload a new book to the API
  const uploadBook = async () => {
    try {
      if (!title || !pdfFile) {
        alert('Please enter a title and upload a PDF file.');  // Alert if inputs are missing
        return;
      }

      const bookData = {
        title,
        fileUrl: pdfFile,  // Prepare the data to send to the API
      };

      const response = await fetch('http://localhost:3000/api/books/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),  // Send the data as JSON
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();  // Get the response from the server
      console.log('Uploaded Book:', data);  // Log the uploaded book data
      // Clear input fields
      setTitle('');
      setPdfFile(null);
      // Refresh book list
      fetchBooks();
    } catch (error) {
      console.error('Error uploading book:', error);
      alert('Failed to upload book. Please try again.');
    }
  };

  // useEffect hook to fetch books when the component mounts
  useEffect(() => {
    fetchBooks();  // Call the fetchBooks function on mount
  }, []);

  return (
      <div className="App">
        <h1>Book Manager</h1>

        {/* Input fields for uploading a book */}
        <input
            type="text"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}  // Update the title state on change
        />
        <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}  // Handle file selection
        />
        <button onClick={uploadBook}>Upload Book</button>
        {/* Upload button */}

        {/* Error message for invalid file */}
        {pdfError && <div style={{color: 'red'}}>{pdfError}</div>}

        {/* Display the list of books */}
        <h2>Books List:</h2>
        <ul>
          {books.map((book) => (
              <li key={book.id}>
                <a href={book.fileUrl} target="_blank" rel="noopener noreferrer">{book.title}</a>
              </li>
          ))}
        </ul>

        {/* PDF Viewer */}
        {pdfFile && (
            <div style={{height: '750px'}}>
              <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                <Viewer fileUrl={pdfFile}/>
              </Worker>
            </div>
        )}
      </div>
  );
}

export default App;