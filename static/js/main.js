document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const message = userInput.value;
        appendMessage(message, 'user-message');
        userInput.value = '';

        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        })
        .then(response => response.json())
        .then(data => {
            appendMessage(data.response, 'bot-message');
        })
        .catch(error => console.error('Error:', error));
    });

    function appendMessage(message, className) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${className}`;
        if (className === 'bot-message') {
            messageDiv.innerHTML = message; // Render bot response as HTML
        } else {
            messageDiv.textContent = message; // Keep user response as plain text
        }
        chatBox.appendChild(messageDiv);
    
        // Smooth scroll to bottom
        chatBox.scrollTo({
            top: chatBox.scrollHeight,
            behavior: "smooth"
        });
    }    
});
