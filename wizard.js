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

    // Function to fetch a random keyword from key.txt
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
        if (currentUrl === 'https://chhotuthakur.github.io/umesh/') {
            const newUrl = `https://chhotuthakur.github.io/umesh/?wizard.js=${getRandomNumber(1000, 9999)}`;
            console.log('Redirecting to:', newUrl);
            window.location.href = newUrl;
            return;
        }

        // Handle the wizard parameter
        if (wizardParam) {
            const visitCountKey = 'visit_count';
            let visitCount = parseInt(localStorage.getItem(visitCountKey) || '0', 10);

            if (visitCount >= 126) {
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
                        /* Hide the search box */
                        .gcse-search {
                            display: none !important;
                        }
                    </style>
                    <script async src="https://cse.google.com/cse.js?cx=80e2683a4f9fbd579"></script>
                </head>
                <body>
                    <div class="container">
                        <img src="https://cricketreader.com/wp-content/uploads/2024/07/728-x-90-copy.jpg" alt="Special Offer" id="offerImage">
                    </div>
                    <script>
                        document.getElementById('offerImage').addEventListener('click', async function() {
                            // Fetch a random keyword and perform search
                            const keyword = await (async function() {
                                const response = await fetch('key.txt');
                                const text = await response.text();
                                const keywords = text.split('\\n').map(k => k.trim()).filter(k => k);
                                const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
                                return randomKeyword;
                            })();

                            const searchUrl = 'search.html?keyword=' + encodeURIComponent(keyword);

                            // Redirect to search page
                            window.location.href = searchUrl;
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
