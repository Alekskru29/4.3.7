const input = document.querySelector('.app__input');
const autocompleteList = document.querySelector('.app__autocomplete-list');
const resultList = document.querySelector('.result');

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

const handleInput = async function () {
    const query = this.value;
    autocompleteList.innerHTML = '';
    if (query) {
        const repos = await fetchRepositories(query);
        repos.forEach(repo => {
            const item = document.createElement('li');
            item.textContent = repo.name;
            item.classList.add('autocomplete-item');
            item.onclick = () => {
                addRepository(repo.name, repo.owner.login, repo.stargazers_count);
                autocompleteList.innerHTML = '';
                input.value = '';
            };
            autocompleteList.appendChild(item);
        });
    }
};

async function fetchRepositories(query) {
    try {
        const response = await fetch(`https://api.github.com/search/repositories?q=${query}`);
        const data = await response.json();
        return data.items.slice(0, 5);
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

input.addEventListener('input', debounce(handleInput, 300));

const addRepository = (name, owner, stars) => {
    const repoContainer = document.querySelector('.result');
    const repo = document.createElement("div");
    repo.className = 'repo';

    const deleteButton = document.createElement("button");
    deleteButton.className = 'repo__delete';
    deleteButton.innerHTML = `
<svg width="46" height="42" viewBox="0 0 46 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 40.5L44 2" stroke="#FF0000" stroke-width="4"/>
    <path d="M2 2L44 40.5" stroke="#FF0000" stroke-width="4"/>
</svg>`;

    const repoInfo = document.createElement("div");
    repoInfo.className = 'repo__info';

    const createTextElement = (text) => {
        const p = document.createElement("p");
        p.className = 'repo__text';
        p.textContent = text;
        return p;
    };

    repoInfo.appendChild(createTextElement(`Name: ${name}`));
    repoInfo.appendChild(createTextElement(`Owner: ${owner}`));
    repoInfo.appendChild(createTextElement(`Stars: ${stars}`));

    repo.appendChild(repoInfo);
    repo.appendChild(deleteButton);
    repoContainer.appendChild(repo);

    deleteButton.addEventListener('click', () => {
        repo.remove();
    });
};
