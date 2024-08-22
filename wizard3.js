(function() {
    // Function to get URL query parameter
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Function to generate a random number between 1000 and 9999
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to fetch random keyword from key.txt
    async function getRandomKeyword() {
        try {
            const response = await fetch('key.txt'); // Fetch the key.txt file
            const text = await response.text();
            const keywords = text.split('\n').map(k => k.trim()).filter(k => k);
            const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
            return randomKeyword;
        } catch (error) {
            console.error('Error fetching keywords:', error);
            return null;
        }
    }

    // Function to handle the redirection logic
    async function handleRedirection() {
        const wizardParam = getQueryParam('wizard.js');
        const currentUrl = window.location.href;

        // Redirect from base URL
        if (currentUrl === 'http://127.0.0.1:5500/') {
            const newUrl = `http://127.0.0.1:5500/?wizard.js=${getRandomNumber(1000, 9999)}`;
            console.log('Redirecting to:', newUrl);
            window.location.href = newUrl;
            return;
        }

        // Handle the wizard parameter
        if (wizardParam) {
            const visitCountKey = 'visit_count';
            let visitCount = parseInt(localStorage.getItem(visitCountKey) || '0', 10);

            if (visitCount >= 26) {
                console.log('Redirecting to YouTube video due to visit limit.');
                window.location.href = 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID'; // Replace with your YouTube video URL
                return;
            }

            localStorage.setItem(visitCountKey, visitCount + 1);

            const randomKeyword = await getRandomKeyword();
            const searchUrl = `search.html?keyword=${encodeURIComponent(randomKeyword)}`;

            // Create a new HTML document for displaying image and text
            document.open();
            document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Special Offer</title>
                    <style>
                        body {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                            text-align: center;
                            background-color: #f4f4f4;
                        }
                        .container {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                        }
                        #offerImage {
                            width: 100%;
                            max-width: 728px;
                            cursor: pointer;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <img src="https://cricketreader.com/wp-content/uploads/2024/07/728-x-90-copy.jpg" alt="Special Offer" id="offerImage">
                    </div>
                    <script>
                        document.getElementById('offerImage').addEventListener('click', function() {
                            window.location.href = '${searchUrl}'; // Redirect to search.html with the random keyword
                        });
                    </script>
                </body>
                </html>
            `);
            document.close();
        }
    }

    // Execute functions
    handleRedirection();
})();
