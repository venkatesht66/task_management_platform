Task Management Platform  

Overview  

This is a Task Management Platform built using the MERN Stack (MongoDB, Express.js, React.js, Node.js).  
It allows users to create, assign, manage, and track tasks, upload related files, comment on tasks, and view analytics dashboards.  
The project follows the MVC architecture for scalability and maintainability.  


Tech Stack  

Frontend  
	•	React.js  
	•	React Router  
	•	Context API (for authentication state management)  
	•	Tailwind / Custom CSS  

Backend  
	•	Node.js  
	•	Express.js  
	•	MongoDB with Mongoose  
	•	Multer (for file uploads)  
	•	JSON Web Tokens (JWT)  
	•	Bcrypt.js (for password hashing)  


Folder Structure  

Backend:  
backend/  
├── server.js  
├── config/  
│   └── db.js  
├── controllers/  
│   ├── authController.js  
│   ├── taskController.js  
│   ├── fileController.js  
│   ├── commentController.js  
│   └── analyticsController.js  
├── models/  
│   ├── User.js  
│   ├── Task.js  
│   ├── File.js  
│   └── Comment.js  
├── middlewares/
│   ├── auth.js  
│   └── errorHandler.js  
├── routes/  
│   ├── authRoutes.js  
│   ├── taskRoutes.js  
│   ├── fileRoutes.js  
│   ├── commentRoutes.js  
│   └── analyticsRoutes.js  
├── uploads/  
└── utils/  
    ├── hash.js  
    └── jwt.js  



Frontend:  
frontend/  
├── src/  
│   ├── index.js  
│   ├── App.js  
│   ├── api/  
│   │   └── client.js  
│   ├── context/  
│   │   └── AuthContext.js  
│   ├── components/  
│   │   ├── TaskCard.js  
│   │   ├── FileUpload.js  
│   │   ├── Loader.js  
│   │   └── Navbar.js  
│   └── pages/  
│       ├── Login.js  
│       ├── Register.js  
│       ├── Tasks.js  
│       ├── TaskDetail.js  
│       ├── Analytics.js  
│       └── Profile.js  


Installation and Setup  


Backend:  

cd backend  
npm install  
npm start  

(optional)Create a .env file in the backend/ folder:  

PORT=4000  
MONGO_URI=mongodb+srv://venkatesht6:venky457146@clusterelection.hewacgw.mongodb.net/?retryWrites=true&w=majority&appName=ClusterElection  
JWT_SECRET=supersecret  
UPLOAD_DIR=uploads  
  

  
Frontend:  

cd frontend  
npm install  
npm start   
 
  
The app will start at:  
Frontend: http://localhost:3000  
Backend: http://localhost:4000  

  
API Documentation  

You can test all APIs in Postman.  

Postman Collection Includes:  
	•	Authentication → /api/auth  
	•	Tasks → /api/tasks  
	•	Comments → /api/comments  
	•	Files → /api/files  
	•	Analytics → /api/analytics  

Once ready, publish your Postman documentation and add the link below   

API DOCs: https://www.postman.com/docking-module-cosmologist-62619236/task-management-platform/collection/1okmiss/task-management-platform-api?action=share&creator=41983922  

