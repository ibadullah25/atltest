document.addEventListener("DOMContentLoaded", function() {
	const searchForm = document.getElementById("searchForm");
	const searchInput = document.getElementById("search-input");
	const resultsDiv = document.getElementById("results");
	const spinner = document.getElementById("loading");
    const loadMoreButton = document.getElementById("loadMoreButton");
    const goBackButton = document.getElementById("goBackButton");  // New Go Back Button

    const postsPerPage = 9; // Number of posts per page.
    let page = 1;
    let totalPosts = 0;  // This will be set after API call

    searchForm.addEventListener("submit", function(event) {
        event.preventDefault();
        resultsDiv.innerHTML = ""; // Clear previous results
        page = 1; // Reset to first page
        spinner.style.display = 'block';
        loadMoreButton.style.display = 'none';
        goBackButton.style.display = 'none';
        fetchResults();
    });

    // Function to fetch and display data
    function fetchResults() {
        const query = searchInput.value.trim();
        const offset = (page - 1) * postsPerPage;

        fetch(`product-search.php?product_name=${encodeURIComponent(query)}&limit=${postsPerPage}&offset=${offset}`)
            .then(response => response.json())
            .then(data => {
                spinner.style.display = "none";
                // Check if the API returned an error
                if (data.err_desc) {
                    resultsDiv.innerHTML = `<p class='text-warning'>${data.err_desc}</p>`;
                    return; // Stop execution
                }
                totalPosts = data.meta.total_count;
                displayResults(data);
            })
            .catch(error => {
                spinner.style.display = "none";
                resultsDiv.innerHTML = `<p class='text-danger'>Error: Unable to fetch data, please check the API.</p>`;
            });
    }

    function displayResults(data) {
        outputResult = '<div class="row">';
        data.data.forEach(product => {
            outputResult += `
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card bg-secondary text-white h-100">
                        <img src="${product.img_sml}" class="card-img-top" alt="${product.title}">
                        <div class="card-body">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text">Destination: ${product.dest}</p>
                        </div>
                    </div>
                </div>`;
        });
        outputResult += '</div>';

        resultsDiv.innerHTML = outputResult;

        if ((page * postsPerPage) < totalPosts) {
            loadMoreButton.style.display = 'block';
        } else {
            loadMoreButton.style.display = 'none';
        }


        if (page > 1) {
            goBackButton.style.display = 'block';
        } else {
            goBackButton.style.display = 'none';
        }

    }

    loadMoreButton.addEventListener("click", function() {
        page++;
        loadMoreButton.style.display = 'none';
        spinner.style.display = 'block';
        fetchResults();
    });

    goBackButton.addEventListener("click", function(){
        if (page > 1) {
            page--;
            loadMoreButton.style.display = 'block';
            spinner.style.display = 'block';
            fetchResults();
        }
    })
});