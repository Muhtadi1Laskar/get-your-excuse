const ExcuseOptions = [
    { value: "family", text: "Family" },
    { value: "office", text: "Office" },
    { value: "children", text: "Children" },
    { value: "college", text: "College" },
    { value: "party", text: "Party" },
    { value: "funny", text: "funny" },
    { value: "unbelievable", text: "Unbelievable" },
    { value: "developers", text: "Developers" },
    { value: "gaming", text: "Gaming" },

];

const ExcuseNumber = Array.from({ length: 10 }, (_, i) => ({
    value: i + 1,
    text: `${i + 1}`,
}));

const Model = {
    state: {
        excuses: [],
    },

    async fetchData(URL) {
        try {
            const response = await fetch(URL);
            if (!response.ok) {
                throw new Error("Failed to fetch excuses");
            }
            const data = await response.json();
            this.state.excuses = data.map((elem) => ({
                excuse: elem.excuse,
                category: elem.category,
            }));
        } catch (error) {
            this.state.excuses = [];
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
        this.observers.forEach((observer) => observer());
    },
};

const View = {
    init() {
        this.excusesTag = document.getElementById("excuse-list");
        this.numberTag = document.getElementById("total-excuse");
        this.fetchButton = document.getElementById("btn");
        this.clearButton = document.getElementById("reset");
        this.displayTag = document.getElementById("display-excuses");

        this.renderOptions(this.excusesTag, ExcuseOptions);
        this.renderOptions(this.numberTag, ExcuseNumber);
    },

    renderOptions(tag, options) {
        options.forEach((elem) => {
            const optionTag = document.createElement("option");
            optionTag.value = elem.value;
            optionTag.text = elem.text;
            tag.appendChild(optionTag);
        });
    },

    update() {
        this.clearUI();
        Model.state.excuses.forEach((elem) => {
            const newDiv = document.createElement("div");
            newDiv.innerText = `${elem.excuse}`;
            this.displayTag.appendChild(newDiv);
        });
        this.displayTag.style.visibility  = "visible";
    },

    clearUI() {
        this.displayTag.innerHTML = "";
        this.displayTag.style.visibility  = "hidden";
    },
};

const Controller = {
    init() {
        View.init();

        Model.subscribe(() => View.update());

        View.fetchButton.addEventListener("click", () => {
            const selectedType = View.excusesTag.value;
            const totalExcuses = View.numberTag.value || 1;
            const url = Model.buildURL(selectedType, totalExcuses);
            Model.fetchData(url);
        });

        View.clearButton.addEventListener("click", () => View.clearUI());
    },
};

Controller.init();