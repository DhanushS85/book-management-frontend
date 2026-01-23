Book Management – Frontend

 A modern React frontend for the Book Management system. This app allows users to view, add and delete books through a clean UI and communicates with a Spring Boot backend via REST APIs.
 Built with React + Vite, deployed easily on Vercel

Features
 1.Add new book
 2.View all books
 3.Delete books
 4.API integration with Spring Boot backend
 5.Upload Book Cover image 

Tech Stack
 React
 Vite
 JavaScript (ES6+)
 Bootstrap
 Axios / Fetch API (for API calls)
 Vercel (deployment)

Project Structure
 book-management-frontend/
├── src/
│ ├── components 
│ ├── pages
│ ├── App.jsx 
│ ├── main.jsx 
│ └── index.css 
├── public/
├── vite.config.js
├── package.json
└── README.md

Environment Variables
 VITE_API_BASE_URL=https://your-backend-url/api

Deployment (Vercel)
 1.Push your code to GitHub
 2.Import the repo in Vercel
 3.Set environment variables in Vercel:VITE_API_BASE_URL=https://your-backend-url/api
 4.Deploy 

Running Locally
 git clone <your-frontend-repo-link>
 cd <your-frontend-folder>
 npm run dev

