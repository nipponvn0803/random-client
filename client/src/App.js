import React, { Component } from "react";
import axios from "axios";
import MaterialTable from "material-table";

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

  // never let a process live forever
  // always kill a process everytime we are done using it
  // componentWillUnmount() {
  //   if (this.state.intervalIsSet) {
  //     clearInterval(this.state.intervalIsSet);
  //     this.setState({ intervalIsSet: null });
  //   }
  // }

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

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios
      .post("/api/putData", {
        id: idToBeAdded,
        message: message
      })
      .then(this.getDataFromDb);
  };

  // our delete method that uses our backend api
  // to remove existing database information
  deleteFromDB = idTodelete => {
    parseInt(idTodelete);
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id == idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios
      .delete("/api/deleteData", {
        data: {
          id: objIdToDelete
        }
      })
      .then(this.getDataFromDb);
  };

  // Get a random entry from datatbase
  // getARandomEntry = () => {
  //   let length = null;
  //   let randomID = null;
  //   fetch("/api/getData")
  //     .then(data => data.json())
  //     .then(function(response) {
  //       length = response.data.length;
  //       randomID = Math.floor(Math.random() * length);
  //     });

  //   axios
  //     .get("/api/getData", {
  //       params: {
  //         randomID: randomID
  //       }
  //     })
  //     .then(response =>
  //       this.setState({ randomQuote: response.data.data[randomID].message })
  //     );
  // };

  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    parseInt(idToUpdate);
    this.state.data.forEach(dat => {
      if (dat.id == idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios
      .post("/api/updateData", {
        id: objIdToUpdate,
        update: { message: updateToApply }
      })
      .then(this.getDataFromDb);
  };

  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {
    const { data, randomQuote } = this.state;
    return (
      <div>
        <MaterialTable
          title="For My Autumn"
          columns={this.state.columns}
          data={data}
          editable={{
            onRowAdd: newData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  this.setState({ message: newData.message }, function() {
                    this.putDataToDB(this.state.message);
                  });
                  resolve();
                }, 1000);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  this.setState(
                    { idToUpdate: oldData.id, updateToApply: newData.message },
                    function() {
                      this.updateDB(
                        this.state.idToUpdate,
                        this.state.updateToApply
                      );
                    }
                  );
                  resolve();
                }, 1000);
              }),
            onRowDelete: oldData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  this.setState({ idToDelete: oldData.id }, function() {
                    this.deleteFromDB(this.state.idToDelete);
                  });

                  resolve();
                }, 1000);
              })
          }}
        />

        {/* <div style={{ padding: "10px" }}>
          {randomQuote}
          <br />
          <button onClick={() => this.getARandomEntry()}>Random</button>
        </div> */}
      </div>
    );
  }
}

export default App;
