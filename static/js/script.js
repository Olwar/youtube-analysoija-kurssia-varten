document.addEventListener('DOMContentLoaded', function() {
    const processBtn = document.getElementById('process-btn');
    const videoUrlInput = document.getElementById('video-url');
    const resultDiv = document.getElementById('result');
    const wordList = document.getElementById('word-list');
    const loadingDiv = document.getElementById('loading');

    processBtn.addEventListener('click', function() {
        const videoUrl = videoUrlInput.value.trim();
        if (videoUrl) {
            resultDiv.classList.add('hidden');
            loadingDiv.classList.remove('hidden');

            fetch('/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `video_url=${encodeURIComponent(videoUrl)}`
            })
            .then(response => response.json())
            .then(data => {
                loadingDiv.classList.add('hidden');
                if (data.success) {
                    wordList.innerHTML = '';
                    data.result.forEach(([word, count]) => {
                        const li = document.createElement('li');
                        li.textContent = `${word}: ${count}`;
                        wordList.appendChild(li);
                    });
                    resultDiv.classList.remove('hidden');
                } else {
                    alert(data.error);
                }
            })
            .catch(error => {
                loadingDiv.classList.add('hidden');
                alert('Virhe käsittelyssä: ' + error);
            });
        } else {
            alert('Syötä validi YouTube URL.');
        }
    });

    particlesJS.load('particles-js', '/static/particles.json', function() {
        console.log('callback - particles.js config loaded');
    });
});