// Model: Manages data and logic
const Model = {
    state: {
      joke: "Click the button to fetch a joke.",
    },
  
    async fetchJoke() {
      try {
        const response = await fetch("https://official-joke-api.appspot.com/random_joke");
        if (!response.ok) throw new Error("Failed to fetch joke.");
        const data = await response.json();
        this.state.joke = `${data.setup} - ${data.punchline}`;
      } catch (error) {
        this.state.joke = "Error fetching joke. Please try again later.";
        console.error(error);
      }
      this.notify();
    },
  
    // Observer Pattern
    observers: [],
    subscribe(observer) {
      this.observers.push(observer);
    },
    notify() {
      this.observers.forEach(observer => observer());
    },
  };
  
  // View: Updates the UI
  const View = {
    init() {
      this.jokeText = document.getElementById("joke");
      this.fetchJokeButton = document.getElementById("fetch-joke-btn");
  
      this.update(); // Initial render
    },
  
    update() {
      this.jokeText.textContent = Model.state.joke;
    },
  };
  
  // Controller: Handles user interaction
  const Controller = {
    init() {
      View.init();
  
      // Subscribe the View to Model updates
      Model.subscribe(() => View.update());
  
      // Event listener for the button
      View.fetchJokeButton.addEventListener("click", () => Model.fetchJoke());
    },
  };
  
  // Initialize the app
  Controller.init();
  