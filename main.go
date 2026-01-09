package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"sync"
	"time"
)

// BlogPost represents a blog post entity
type BlogPost struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	Author    string    `json:"author"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Database simulation using in-memory storage (SawitDB concept)
type SawitDB struct {
	mu    sync.RWMutex
	posts map[int]*BlogPost
	nextID int
}

var db *SawitDB

func init() {
	db = &SawitDB{
		posts: make(map[int]*BlogPost),
		nextID: 1,
	}
}

// CRUD Operations
func (s *SawitDB) Create(post *BlogPost) *BlogPost {
	s.mu.Lock()
	defer s.mu.Unlock()
	
	post.ID = s.nextID
	post.CreatedAt = time.Now()
	post.UpdatedAt = time.Now()
	s.posts[post.ID] = post
	s.nextID++
	
	return post
}

func (s *SawitDB) GetAll() []*BlogPost {
	s.mu.RLock()
	defer s.mu.RUnlock()
	
	posts := make([]*BlogPost, 0, len(s.posts))
	for _, post := range s.posts {
		posts = append(posts, post)
	}
	return posts
}

func (s *SawitDB) GetByID(id int) *BlogPost {
	s.mu.RLock()
	defer s.mu.RUnlock()
	
	return s.posts[id]
}

func (s *SawitDB) Update(id int, post *BlogPost) *BlogPost {
	s.mu.Lock()
	defer s.mu.Unlock()
	
	existing := s.posts[id]
	if existing == nil {
		return nil
	}
	
	post.ID = id
	post.CreatedAt = existing.CreatedAt
	post.UpdatedAt = time.Now()
	s.posts[id] = post
	
	return post
}

func (s *SawitDB) Delete(id int) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	
	if s.posts[id] == nil {
		return false
	}
	
	delete(s.posts, id)
	return true
}

// HTTP Handlers (Prabogo-style routing)
func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func handlePosts(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	
	switch r.Method {
	case "GET":
		handleGetPosts(w, r)
	case "POST":
		handleCreatePost(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func handlePostByID(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	
	// Extract ID from path
	idStr := r.URL.Path[len("/api/posts/"):]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid post ID", http.StatusBadRequest)
		return
	}
	
	switch r.Method {
	case "GET":
		handleGetPost(w, r, id)
	case "PUT":
		handleUpdatePost(w, r, id)
	case "DELETE":
		handleDeletePost(w, r, id)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func handleGetPosts(w http.ResponseWriter, r *http.Request) {
	posts := db.GetAll()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(posts)
}

func handleGetPost(w http.ResponseWriter, r *http.Request, id int) {
	post := db.GetByID(id)
	if post == nil {
		http.Error(w, "Post not found", http.StatusNotFound)
		return
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(post)
}

func handleCreatePost(w http.ResponseWriter, r *http.Request) {
	var post BlogPost
	if err := json.NewDecoder(r.Body).Decode(&post); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	
	created := db.Create(&post)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(created)
}

func handleUpdatePost(w http.ResponseWriter, r *http.Request, id int) {
	var post BlogPost
	if err := json.NewDecoder(r.Body).Decode(&post); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	
	updated := db.Update(id, &post)
	if updated == nil {
		http.Error(w, "Post not found", http.StatusNotFound)
		return
	}
	
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updated)
}

func handleDeletePost(w http.ResponseWriter, r *http.Request, id int) {
	if !db.Delete(id) {
		http.Error(w, "Post not found", http.StatusNotFound)
		return
	}
	
	w.WriteHeader(http.StatusNoContent)
}

func main() {
	// Prabogo-style routing
	http.HandleFunc("/api/posts", handlePosts)
	http.HandleFunc("/api/posts/", handlePostByID)
	
	// Serve static files (JokoUI frontend)
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)
	
	port := ":8080"
	fmt.Printf("🚀 Prabogo server running on http://localhost%s\n", port)
	fmt.Println("📝 Blog CMS API ready!")
	fmt.Println("   - Frontend: http://localhost:8080")
	fmt.Println("   - API: http://localhost:8080/api/posts")
	
	log.Fatal(http.ListenAndServe(port, nil))
}
