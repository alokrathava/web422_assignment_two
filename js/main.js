/*********************************************************************************
 *  WEB422 – Assignment 2
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Alokkumar Rathava Student ID: 145877205 Date: Jun 1. 2023
 *
 ********************************************************************************/

let page = 1;
let perPage = 10;

function loadMovieData(title = null) {

    if (title !== null) {
        url = `https://long-cyan-panther-vest.cyclic.app/api/movies?page=page&perPage=perPage&title=title`;
        page = 1;
        document.querySelector('.pagination').classList.add('d-none');
    } else {
        url = `https://long-cyan-panther-vest.cyclic.app/api/movies?page=page&perPage=perPage`;
        document.querySelector('.pagination').classList.remove('d-none');
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.forEach(movie => {
                let movieRow = `<tr data-id="${movie._id}">
                            <td>${movie.year}</td>
                            <td>${movie.title}</td>
                            <td>${movie.plot}</td>
                            <td>${movie.rated}</td>
                            <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60).toString().padStart(2, '0')}</td>
                            </tr>`;
                document.querySelector('#moviesTable tbody').innerHTML += movieRow;
            })
        }).catch(error => console.log(error));


    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = movieRows.join('');

    const currentPageElement = document.querySelector('#current-page');
    currentPageElement.textContent = page;

    const movieRows = document.querySelectorAll('#moviesTable tbody tr');
    movieRows.forEach(row => {
        row.addEventListener('click', () => {
            const movieId = row.getAttribute('data-id');
            const url = `https://long-cyan-panther-vest.cyclic.app/api/movies/${movieId}`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const modalTitle = document.querySelector('#detailsModal .modal-title');
                    const modalBody = document.querySelector('#detailsModal .modal-body');

                    modalTitle.textContent = data.title; // Set modal title

                    const modalContent = `
                    <img class="img-fluid w-100" src="${data.poster}"><br><br>
                    <strong>Directed By:</strong> ${data.directors.join(', ')}<br><br>
                    <p>${data.fullplot}</p>
                    <strong>Cast:</strong> ${data.cast.length > 0 ? data.cast.join(', ') : 'N/A'}<br><br>
                    <strong>Awards:</strong> ${data.awards.text}<br>
                    <strong>IMDB Rating:</strong> ${data.imdb.rating} (${data.imdb.votes} votes)
                `;

                    modalBody.innerHTML = modalContent;

                    // Show the modal
                    const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
                    detailsModal.show();
                })
                .catch(error => console.log(error));
        });
    });

    // Click event for the "previous page" pagination button:
    const previousPageButton = document.querySelector('#previous-page');
    previousPageButton.addEventListener('click', () => {
        if (page > 1) {
            page--;
            loadMovieData();
        }
    });

    // Click event for the "next page" pagination button:
    const nextPageButton = document.querySelector('#next-page');
    nextPageButton.addEventListener('click', () => {
        page++;
        loadMovieData();
    });
    // Search form submit event:
    const searchForm = document.querySelector('#searchForm');
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.querySelector('#title').value;
        loadMovieData(title);
    });

    // Clear search form event:
    const clearSearchButton = document.querySelector('#clearSearch');
    clearSearchButton.addEventListener('click', () => {
        document.querySelector('#title').value = '';
        loadMovieData();
    });
}

loadMovieData();