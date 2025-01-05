document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const promptButtons = document.querySelectorAll('.prompt-btn');

    function createLoadingAnimation() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            loadingDiv.appendChild(dot);
        }
        return loadingDiv;
    }

    // Add click handlers for example prompt buttons
    promptButtons.forEach(button => {
        button.addEventListener('click', function () {
            const promptText = this.textContent.replace(/['"]/g, ''); // Remove quotes
            userInput.value = promptText;
            form.dispatchEvent(new Event('submit'));
        });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const message = userInput.value;
        if (!message.trim()) return; // Prevent empty messages

        appendMessage(message, 'user-message');
        userInput.value = '';

        // Add loading animation
        const loadingAnimation = createLoadingAnimation();
        chatBox.appendChild(loadingAnimation);
        chatBox.scrollTo({
            top: chatBox.scrollHeight,
            behavior: "smooth"
        });

        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        })
            .then(response => response.json())
            .then(data => {
                // Remove loading animation
                loadingAnimation.remove();
                appendMessage(data.response, 'bot-message');
            })
            .catch(error => {
                // Remove loading animation and show error
                loadingAnimation.remove();
                console.error('Error:', error);
                appendMessage('Sorry, something went wrong. Please try again.', 'bot-message');
            });
    });

    function appendMessage(message, className) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${className}`;
        if (className === 'bot-message') {
            messageDiv.innerHTML = message;
        } else {
            messageDiv.textContent = message;
        }
        chatBox.appendChild(messageDiv);

        chatBox.scrollTo({
            top: chatBox.scrollHeight,
            behavior: "smooth"
        });
    }
});
