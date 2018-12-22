(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    const responseContainer = document.querySelector('#response-container');
    let searchedForText;

    const unsplashApiKey = '9cdf400171389d03f96ad7b5852181dd72d4478dfd7975c0e98d4702923540a1';
    const nytimesApiKey = 'e64e14b0fe134df3911e18aa871b47e7';
    
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
		    headers: {
		        Authorization: `Client-ID ${unsplashApiKey}`
		    }
		}).then(response => response.json())
		.then(addImage)
		.catch(e => requestError(e, 'image'));

		fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=${nytimesApiKey}`)
		.then(response => response.json())
		.then(addArticles)
		.catch(e => requestError(e, 'article'));
    });

    function addImage(data) {
        let htmlContent = '';

        if (data && data.results && data.results[0]) {
            const firstImage = data.results[0];
            htmlContent = `<figure>
		        	<img src="${firstImage.urls.regular}" alt="${searchedForText}">
		        	<figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
	        	</figure>`;
        } else {
            htmlContent = '<div class="error-no-image">No images available</div>';
        }

        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function addArticles(data) {
        let htmlContent = '';

        if (data.response && data.response.docs && data.response.docs.length > 1) {
            htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
	            	<h2><a href="${article.web_url}">${article.headline.main}</a></h2>
	            	<p>${article.snippet}</p>
	            </li>`
            ).join('') + '</ul>';
        } else {
            htmlContent = '<div class="error-no-articles">No articles available</div>';
        }

        responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    }

    function requestError(e, part) {
	    console.log(e);
	    responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
	}
})();
