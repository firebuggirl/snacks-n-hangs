import axios from 'axios';//a Promise-based HTTP client for JavaScript which can be used in your front-end application and in your Node.js backend. send asynchronous HTTP request to REST endpoints and perform CRUD operations.
 //instead of 'requiring' Axios, use 'import'...works because we're using "Webpack" to convert to CommonJS first....gets compiled for us...keep consistent with es6 on front-end, but compiling to CommonJS because Node does not have ES6 modules yet
import dompurify from 'dompurify'; //prevent XSS attacks...use anywhere you are setting HTML, like on lines 36 and 40!!!!


function searchResultsHTML(stores) {
  return stores.map(store => {
    return `
      <a href="/store/${store.slug}" class="search__result">
        <strong>${store.name}</strong>

      </a>
    `;
  }).join('');//return string
}

function typeAhead(search) {
  if (!search) return;

  const searchInput = search.querySelector('input[name="search"]');
  const searchResults = search.querySelector('.search__results');

  searchInput.on('input', function() {
    // if there is no value, quit it!
    if (!this.value) {
      searchResults.style.display = 'none';
      return; // stop!
    }

    // show the search results!
    searchResults.style.display = 'block';
    //searchResults.innerHTML = "";

    axios
      .get(`/api/search?q=${this.value}`)
      .then(res => {
        if (res.data.length) {
          searchResults.innerHTML = dompurify.sanitize(searchResultsHTML(res.data));//prevent XSS attacks w/dompurify.sanitize
          return;
        }
        // tell them nothing came back
        searchResults.innerHTML = dompurify.sanitize(`<div class="search__result">No results for ${this.value}</div>`); ////prevent XSS attacks w/dompurify.sanitize
      })
      .catch(err => {
        console.error(err);
      });
  });

  // handle keyboard inputs
  searchInput.on('keyup', (e) => {
    console.log(e.keyCode);
    // if they aren't pressing up, down or enter, who cares!
    if (![38, 40, 13].includes(e.keyCode)) {
      return; // nah
    }
    const activeClass = 'search__result--active';
    const current = search.querySelector(`.${activeClass}`);
    const items = search.querySelectorAll('.search__result');//look for all search results
    let next; // set to 'let' because there will be changes/updates
    if (e.keyCode === 40 && current) {//press down and one is already selected, then
      next = current.nextElementSibling || items[0]; //next one is going to be current or fall back to first item in array
    } else if (e.keyCode === 40) {
      next = items[0];
    } else if (e.keyCode === 38 && current) { //if pressing up, opposite of above
      next = current.previousElementSibling || items[items.length - 1]; //previous element or last elemant in array
    } else if (e.keyCode === 38) {
      next = items[items.length - 1];
    } else if (e.keyCode === 13 && current.href) {//enter key
      console.log('Changing pages');
      console.log(current);
      window.location = current.href;
      return;
    }
    if (current) {
      current.classList.remove(activeClass);
    }
    next.classList.add(activeClass);
  });
}

export default typeAhead;
