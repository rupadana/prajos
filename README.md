# 📝 PRAJOS - Fullstack Blog CMS

PRAJOS adalah proyek open-source fullstack web development yang menggabungkan kekuatan Prabogo, JokoUI, dan SawitDB ke dalam satu ekosistem yang scalable, modular, dan meme-ready.

## 🚀 Tech Stack

- **Prabogo** (Backend) - Lightweight Go web framework untuk routing dan API handling
- **JokoUI** (Frontend) - Modern CSS framework dengan komponen siap pakai
- **SawitDB** (Database) - In-memory database implementation untuk manajemen data

## ✨ Features

- ✅ Create, Read, Update, Delete (CRUD) blog posts
- ✅ RESTful API dengan Go
- ✅ Modern responsive UI
- ✅ Real-time data updates
- ✅ In-memory data storage (SawitDB concept)
- ✅ CORS enabled untuk development
- ✅ Simple dan mudah di-deploy

## 📦 Installation

### Prerequisites

- Go 1.21 atau lebih tinggi
- Git

### Quick Start

1. Clone repository:
```bash
git clone https://github.com/rupadana/prajos.git
cd prajos
```

2. Jalankan aplikasi:
```bash
go run main.go
```

3. Buka browser dan akses:
```
http://localhost:8080
```

## 🐳 Docker Deployment

Build dan jalankan dengan Docker:

```bash
docker-compose up -d
```

Atau build manual:

```bash
docker build -t prajos .
docker run -p 8080:8080 prajos
```

## 📚 API Documentation

### Endpoints

#### Get All Posts
```
GET /api/posts
```

Response:
```json
[
  {
    "id": 1,
    "title": "My First Post",
    "content": "This is the content",
    "author": "John Doe",
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  }
]
```

#### Get Single Post
```
GET /api/posts/{id}
```

#### Create Post
```
POST /api/posts
Content-Type: application/json

{
  "title": "New Post",
  "content": "Post content here",
  "author": "Author Name"
}
```

#### Update Post
```
PUT /api/posts/{id}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "author": "Author Name"
}
```

#### Delete Post
```
DELETE /api/posts/{id}
```

## 🎨 Frontend Structure

```
static/
├── index.html          # Main HTML file
├── css/
│   └── jokoui.css     # JokoUI styling framework
└── js/
    ├── jokoui.js      # JokoUI JavaScript utilities
    └── app.js         # Main application logic
```

## 🏗️ Architecture

### Backend (Prabogo)
- **main.go** - Server utama dengan routing dan handlers
- In-memory database dengan mutex untuk thread-safety
- RESTful API implementation
- CORS middleware

### Frontend (JokoUI)
- Responsive design dengan CSS custom properties
- Vanilla JavaScript (no frameworks)
- Fetch API untuk komunikasi dengan backend
- Modern UI/UX dengan animasi

### Database (SawitDB)
- In-memory storage menggunakan Go maps
- Thread-safe dengan sync.RWMutex
- Auto-incrementing IDs
- CRUD operations

## 🛠️ Development

### Project Structure

```
prajos/
├── main.go              # Backend server
├── go.mod              # Go dependencies
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose setup
├── .gitignore         # Git ignore rules
├── README.md          # Documentation
└── static/            # Frontend files
    ├── index.html
    ├── css/
    │   └── jokoui.css
    └── js/
        ├── jokoui.js
        └── app.js
```

### Running Tests

```bash
go test ./...
```

### Building

```bash
go build -o prajos main.go
./prajos
```

## 🤝 Contributing

Contributions are welcome! Silakan buat Pull Request atau buka Issue untuk bug reports dan feature requests.

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Credits

- Inspired by Prabogo, JokoUI, and SawitDB projects
- Built with ❤️ untuk komunitas developer Indonesia

---

**Made with ❤️ by the PRAJOS Team**
