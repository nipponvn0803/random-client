import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  // initialize our state
  state = {
    randomQuote: "",
    columns: [
      { title: "ID", field: "id", editable: "never" },
      { title: "Created at", field: "createdAt", editable: "never" },
      { title: "Message", field: "message" }
    ],
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    // if (!this.state.intervalIsSet) {
    //   let interval = setInterval(this.getDataFromDb, 1000);
    //   this.setState({ intervalIsSet: interval });
    // }
  }

  // just a note, here, in the front end, we use the id key of our data object
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify
  // data base entries

  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDb = () => {
    fetch("/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

  // Get a random entry from datatbase
  getARandomEntry = () => {
    let length = null;
    let randomID = null;
    fetch("/api/getData")
      .then(data => data.json())
      .then(function(response) {
        length = response.data.length;
        randomID = Math.floor(Math.random() * length);
      });

    axios
      .get("/api/getData", {
        params: {
          randomID: randomID
        }
      })
      .then(response =>
        this.setState({ randomQuote: response.data.data[randomID].message })
      );
  };

  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {
    const { randomQuote } = this.state;
    return (
      <div>
        <div style={{ padding: "10px" }}>
          {randomQuote}
          <br />
          <button onClick={() => this.getARandomEntry()}>Random</button>
        </div>
      </div>
    );
  }
}

export default App;
