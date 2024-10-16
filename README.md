# Planning Poker

A collaborative tool for agile teams to estimate project tasks using the Planning Poker technique. This application leverages Socket.IO for real-time communication and Redis for efficient caching, ensuring a seamless and responsive user experience.

<img src="https://i.postimg.cc/B6C36Q2d/Captura-de-tela-de-2024-10-07-20-03-27.png" style="width: 100%"/>
<img src="https://i.postimg.cc/vH2QfBCy/Captura-de-tela-de-2024-10-07-20-03-48.png" style="width: 100%"/>
<img src="https://i.postimg.cc/gjkW6FDr/Captura-de-tela-de-2024-10-07-12-04-54.png" style="width: 100%"/>
<img src="https://i.postimg.cc/BZpsfg5N/Captura-de-tela-de-2024-10-07-20-04-11.png" style="width: 100%"/>
<img src="https://i.postimg.cc/65QKWvYK/Captura-de-tela-de-2024-10-08-09-38-37.png" style="width: 100%"/>
<img src="https://i.postimg.cc/RhSBn6mc/Captura-de-tela-de-2024-10-08-10-00-24.png" style="width: 100%"/>

# Technologies Used in the Project

## 🚀 Main Technologies

| Technology   | Description                                                |
|--------------|-----------------------------------------------------------|
| **Express.js** | Express is a lightweight and flexible routing framework with minimal core features. |
| **Socket.io** | Bidirectional and low-latency communication for every platform. |
| **Bulma** | Bulma is a free, open source CSS framework based on Flexbox and built with Sass. |
| **Redis** | Redis is an open source data structure server. |
| **Chart.js** | Chart.js renders chart elements on an HTML5 canvas. |

## Setup with Docker
```
docker-compose up
```

## Setup without Docker

You need to copy and paste the file named .env.example:
```
cp .env.example .env
```

Install the dependencies:
```
npm install or yarn
```

### Run App

Start the app:
```
yarn dev or npm run dev
```

## Project Directory Structure

```
├── src                 # App Folder
│   ├── controllers     # Interface client - services
│   ├── routes          # Routes of application
│   ├── services        # Business logic layer of the application
│   ├── sockets         # Handlers and connection socket
│   ├── views           # Views of application
├── cache               # Config cache redis
├── public              # Static files
└── app.py              # Main script of project
```

## Contributing

We welcome contributions from the community! To contribute to the Planning Poker project, please follow these steps:

1. **Fork the Repository**: Click on the “Fork” button at the top right corner of the repository page to create a personal copy of the project in your GitHub account.

2. **Clone the Forked Repository**: Clone your forked repository to your local machine using the following command:
```
git clone https://github.com/your-username/planning-poker.git
```

3. **Create a New Branch**: Navigate into the project directory and create a new branch for your feature or bug fix. Use a descriptive name that reflects the task you are working on:
```
git checkout -b feature/name-task
```

4. **Make Your Changes**: Implement your changes in the code. Make sure to test your changes thoroughly to ensure everything works as expected.

5. **Commit Your Changes**: Once you are satisfied with your modifications, commit them with a clear and concise message describing the changes you made.
```
git add .
git commit -m "Add feature: description of the feature"
```

6. **Push to Your Fork**: Push your changes to your forked repository
```
git push origin feature/name-task
```

7. **Open a Pull Request (PR)**: Go to the original repository where you want to contribute. Click on the “Pull Requests” tab, then click on the “New Pull Request” button. Select your branch from the dropdown and create the pull request. Provide a detailed description of the changes you made and why they should be merged.
