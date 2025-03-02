# Anonymous Messaging App

Welcome to the **Anonymous Messaging App**, a full-stack application built using **Next.js**. This project is inspired by the Chai aur Code tutorial and allows users to send anonymous messages securely.

## 🚀 Features
- 🔒 **User Authentication** (OTP-based login)
- 📩 **Anonymous Messaging** (Send messages without revealing identity)
- 🛡️ **Secure Backend** (Protected APIs & Database Integration)
- 📊 **Real-time Updates** (WebSockets for instant messaging)
- 🎨 **Responsive UI** (Built with Tailwind CSS)

## 🛠️ Tech Stack
- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB (with Mongoose)
- **Authentication:** OTP-based (Email Verification)
- **Deployment:** Vercel

## ⚙️ Installation
Follow these steps to run the project locally:

```bash
# Clone the repository
git clone https://github.com/your-username/anonymous-messaging-app.git

# Navigate to the project folder
cd anonymous-messaging-app

# Install dependencies
npm install  # or yarn install

# Set up environment variables (Refer to .env.example)

# Start the development server
npm run dev  # or yarn dev
```

## 📌 Environment Variables
Create a `.env.local` file and add the following:

```env
NEXT_PUBLIC_MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_EMAIL_API_KEY=your_email_service_key
```

## 🏗️ Folder Structure
```
📂 anonymous-messaging-app
 ┣ 📂 components    # UI Components
 ┣ 📂 pages         # Next.js Pages & API Routes
 ┣ 📂 models        # Database Models (Mongoose)
 ┣ 📂 utils         # Helper Functions
 ┣ 📜 .env.local    # Environment Variables
 ┣ 📜 package.json  # Dependencies & Scripts
 ┗ 📜 README.md     # Documentation
```

## 🛣️ Roadmap
- [ ] Implement Message Encryption
- [ ] Add Dark Mode Support
- [ ] Improve UI/UX with Animations

## 🤝 Contributing
Contributions are welcome! Feel free to fork this repo and submit a pull request.

## 📜 License
This project is licensed under the **MIT License**.

## 💡 Acknowledgements
Special thanks to [Chai aur Code](https://www.youtube.com/@chaiaurcode) for the tutorial and inspiration!

---
🚀 **Happy Coding!** 🎉
