// JokoUI JavaScript Framework - Simple and Powerful

const JokoUI = {
    // API Base URL
    apiBase: '/api',
    
    // Show notification
    showNotification(message, type = 'success') {
        const alert = document.createElement('div');
        alert.className = `joko-alert joko-alert-${type}`;
        alert.textContent = message;
        
        const main = document.querySelector('.joko-main');
        main.insertBefore(alert, main.firstChild);
        
        setTimeout(() => {
            alert.remove();
        }, 3000);
    },
    
    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('id-ID', options);
    },
    
    // Fetch helper with error handling
    async fetch(url, options = {}) {
        try {
            const response = await fetch(this.apiBase + url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Handle 204 No Content
            if (response.status === 204) {
                return null;
            }
            
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }
};

// Export for use in other files
window.JokoUI = JokoUI;
