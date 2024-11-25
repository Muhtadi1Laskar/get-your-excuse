const makeAPICall = async (url) => {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = response.json();
            return data
        } else {
            console.error(`Error fetching data: ${response.error}`);
        }
    } catch (e) {
        return e;
    }
}

const cleanResponseData = (data) => {
    if (data.length === 0) {
        return null;
    }
    return data.map(elem => {
        return {
            excuse: elem.excuse,
            category: elem.category
        }
    });
}

// (async() => {
//     const URL = "https://excuser-three.vercel.app/v1/excuse/developers/4";
//     const responseData = await makeAPICall(URL);
//     const execuses = cleanResponseData(responseData);

//     console.log(execuses);
// })();

const Model = {
    state: {
        excuses: []
    },

    async fetchData(URL) {
        try {
            console.log(URL);
            const response = await fetch(URL);
            if(!response.ok) {
                throw new Error("Failed to fetch excuses");
            }
            const data = await response.json();
            this.state.excuses = data.map(elem => {
                return {
                    excuse: elem.excuse,
                    category: elem.category
                }
            })
        } catch (error) {
            this.state.excuses = "Error fetching joke";
            console.error(error);
        }
        this.notify();
    },
    buildURL(type, totalExcuses) {
        return `https://excuser-three.vercel.app/v1/excuse/${type}/${totalExcuses}`;
    },

    observers: [],
    subscribe(observer) {
        this.observers.push(observer);
    },

    notify() {
        this.observers.forEach(observer => observer());
    }
};

const View = {
    init() {
        this.excusesTag = document.getElementById('excuse-list');
        this.numberTag = document.getElementById('number-of-execuse');
        this.fetchButton = document.getElementById('btn');
        this.clearButton = document.getElementById('reset');
        this.displayTag = document.getElementById('display-excuses');
        this.renderOptions();
    },

    renderOptions() {
        ExcuseOptions.forEach(elem => {
            const optionTag = document.createElement('option');

            optionTag.value = elem.value;
            optionTag.text = elem.text;

            this.excusesTag.appendChild(optionTag);
        });
    },

    update() {
        this.clearUI();
        Model.state.excuses.forEach(elem => {
            const newDiv = document.createElement('div');

            newDiv.innerText = elem.excuse;

            this.displayTag.appendChild(newDiv);
        })
    },

    clearUI() {
        this.displayTag.innerHTML = '';
    }
}

const Controller = {
    init() {
        View.init();

        Model.subscribe(() => View.update());

        View.fetchButton.addEventListener('click', () => Model.fetchData(Model.buildURL("developers", 10)));
        View.clearButton.addEventListener('click', () => View.clearUI());
    }
}

Controller.init();