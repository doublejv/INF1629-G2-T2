import './App.css';
import { post } from 'axios';
import React from "react";

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      termFile: null,
      selectedBlackListFile: null,
      termFrequencyResult: null,
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
  }

  onFormSubmit(e){
    e.preventDefault() // Stop form submit
    this.fileUpload(this.state.termFile, this.state.blackListFile)
      .then((response)=>{
        this.setState({ termFrequencyResult: response.data});
      })
  }

  onChange(event) {
    if (event.target.name === 'Input') {
      this.setState({ termFile: event.target.files[0] });
    } else {
      this.setState({ blackListFile: event.target.files[0] });
    }
  }

  fileUpload(selectedTermFile, selectedBlackListFile){
    const url = 'http://localhost:8000/execute';
    const formData = new FormData();
    formData.append('termFile', selectedTermFile)
    formData.append('blackListFile', selectedBlackListFile);
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return  post(url, formData,config)
  }

  render() {
    return (
      <div className="App">
        <h1>Online Term Frequency Calculator</h1>
        <form>
          <div>
            <h2>Input File:</h2>
            <input
              type="file"
              name = "Input"
              onChange={this.onChange}
            />
          </div>
          <div>
            <h2>Word Blacklist File:</h2>
            <input
              type="file"
              name = "Blacklist"
              onChange={this.onChange}
            />
          </div>
          <button onClick={this.onFormSubmit}> 
            Go! 
          </button>
        </form>
        { this.state.termFrequencyResult && 
          <h3>{this.state.termFrequencyResult}</h3>}
      </div>
    );
  }
}

export default App;
