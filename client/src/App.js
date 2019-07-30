import React, { Component } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";

const bounceInLeft = keyframes`
from,
  60%,
  75%,
  90%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    -webkit-transform: translate3d(-150px, 0, 0);
    transform: translate3d(-150px, 0, 0);
  }

  60% {
    opacity: 1;
    -webkit-transform: translate3d(25px, 0, 0);
    transform: translate3d(25px, 0, 0);
  }

  75% {
    -webkit-transform: translate3d(-10px, 0, 0);
    transform: translate3d(-10px, 0, 0);
  }

  90% {
    -webkit-transform: translate3d(5px, 0, 0);
    transform: translate3d(5px, 0, 0);
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
`;

const bounceInRight = keyframes`
from,
60%,
75%,
90%,
to {
  -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}

from {
  opacity: 0;
  -webkit-transform: translate3d(150px, 0, 0);
  transform: translate3d(150px, 0, 0);
}

60% {
  opacity: 1;
  -webkit-transform: translate3d(-25px, 0, 0);
  transform: translate3d(-25px, 0, 0);
}

75% {
  -webkit-transform: translate3d(10px, 0, 0);
  transform: translate3d(10px, 0, 0);
}

90% {
  -webkit-transform: translate3d(-5px, 0, 0);
  transform: translate3d(-5px, 0, 0);
}

to {
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}
`;

const FullDiv = styled.div`
  width: 500px;
  min-height: 150px;
  background-color: white;
  position: absolute;
  top: calc(50% - 75px);
  right: calc(50% - 250px);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 14px;

  @media (max-width: 600px) {
    width: 300px;
    right: calc(50% - 150px);
  }
`;

const QuoteDiv = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  padding: 10px;
  padding-bottom: 20px;
`;

const RealQuoteDiv = styled.div`
  min-height: 100px;
  font-family: Open Sans, sans-serif;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  text-align: center;
`;

const AnimatedText = styled.p`
  animation: ${bounceInLeft} 1s linear;
`;

const RandomButton = styled.button`
  border-radius: 10px;
  background-color: #7289da;
  border: none;
  box-shadow: none;
  padding: 10px;
  color: white;
  font-family: Open Sans, sans-serif;
  font-size: 15px;
  width: 200px;
  cursor: pointer;
  outline: none;
  ::-moz-focus-inner {
    border: 0;
  }
`;

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
    this.getARandomEntry();
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

  // AddEmoji(params) {
  //   const emojiArray = ["🚗", "✈️", "🚀"];
  //   let randomEmoji = emojiArray[Math.floor(Math.random() * emojiArray.length)];
  //   return randomEmoji;
  // }

  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {
    const { randomQuote } = this.state;
    return (
      <FullDiv>
        <QuoteDiv>
          <RealQuoteDiv>
            <AnimatedText>{randomQuote || "Feeling luckyyy"}</AnimatedText>
          </RealQuoteDiv>
          <br />
          <RandomButton onClick={() => this.getARandomEntry()}>
            Get a random quote
          </RandomButton>
        </QuoteDiv>
      </FullDiv>
    );
  }
}

export default App;
