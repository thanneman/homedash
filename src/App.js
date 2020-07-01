import React, { Component } from 'react';
import './App.css';
import Links from './components/Links';
import Headlines from './components/Headlines';
import CalEvents from './components/CalEvents';
import moment from 'moment';

var gapi = window.gapi;
var API_KEY = `${process.env.REACT_APP_GOOGLECAL_KEY}`;
var CALENDAR_ID = `${process.env.REACT_APP_GOOGLECALID_KEY}`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      location: {
        latitude: '',
        longitude: '',
      },
      weatherdata: {
        description: '',
        icon: '',
        temp: '',
      },
      headlines: [],
      events: [],
      error: null,
    };
  }

  // update search state
  updateSearch(search) {
    this.setState({ search });
  }

  // handle search and open in new tab
  handleSubmit(e) {
    e.preventDefault();
    const usersearch = `https://www.google.com/search?q=${this.state.search}`;
    window.open(usersearch, '_blank');
  }

  getEvents() {
    let that = this;
    function start() {
      gapi.client
        .init({
          apiKey: `${API_KEY}`,
        })
        .then(function() {
          return gapi.client.request({
            path: `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?maxResults=10&orderBy=startTime&showDeleted=false&singleEvents=true&timeMin=${moment()
              .startOf('day')
              .toISOString()}&timeMax=${moment()
              .endOf('day')
              .toISOString()}`,
          });
        })
        .then(
          (response) => {
            let events = response.result.items;
            that.setState({
              events: events,
            });
          },
          function(reason) {
            console.log(reason);
          }
        );
    }
    gapi.load('client', start);
  }

  componentDidMount() {
    this.getEvents();

    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let lng = position.coords.longitude;
      this.setState({
        location: {
          latitude: lat,
          longitude: lng,
        },
      });
      setTimeout(() => {
        Promise.all([
          fetch(
            `https://api.weatherbit.io/v2.0/current?lat=${this.state.location.latitude}&lon=${this.state.location.longitude}&units=I&key=${process.env.REACT_APP_WEATHER_KEY}`
          ),
          fetch(
            `https://newsapi.org/v2/top-headlines?q=tech&apiKey=${process.env.REACT_APP_NEWS_KEY}`
          ),
        ])
          .then((res) => {
            // Get a JSON object from each of the responses
            return Promise.all(
              res.map(function(response) {
                return response.json();
              })
            );
          })
          .then((result) => {
            const { temp } = result[0].data[0];
            const { description, icon } = result[0].data[0].weather;
            const allHeadlines = result[1].articles.slice(0, 6);
            this.setState({
              weatherdata: {
                temp: temp,
                description: description,
                icon: icon,
              },
              headlines: allHeadlines,
            });
          })
          .catch((err) => {
            this.setState({
              error: 'Something went wrong.',
            });
          });
      }, 500);
    });
  }

  render() {
    // set url for weather icon
    const iconImg = this.state.weatherdata.icon;
    const imgUrl = `https://www.weatherbit.io/static/img/icons/${iconImg}.png`;

    // map over all headlines
    const headlines = this.state.headlines.map((headline, i) => {
      return <Headlines {...headline} key={i} />;
    });
    // map over all headlines
    const calEvents = this.state.events.map((calEvent, i) => {
      if (calEvent) {
        return <CalEvents {...calEvent} key={i} />;
      } else {
        return <p>No Calendar Events Today</p>;
      }
    });
    return (
      <main className='app'>
        <section className='search'>
          <form className='search-form' onSubmit={(e) => this.handleSubmit(e)}>
            <input
              type='search'
              results='3'
              id='search'
              name='search'
              placeholder='Search Google'
              onChange={(e) => this.updateSearch(e.target.value)}
            />
          </form>
        </section>
        <Links />
        <section className='weather'>
          {this.state.weatherdata.icon.length > 0 ? (
            <img src={imgUrl} alt={this.state.weatherdata.description} />
          ) : (
            ''
          )}
          {!this.state.weatherdata.temp.length > 0 ? (
            <h1>{this.state.weatherdata.temp}</h1>
          ) : (
            ''
          )}
          <p>{this.state.weatherdata.description}</p>
        </section>
        <section className='calendar'>
          <h2>{moment().format('ddd, MMMM Do')}</h2>
          <ul>{calEvents}</ul>
        </section>
        <section className='headlines'>
          <h2>Top News in Tech</h2>
          {headlines}
        </section>
      </main>
    );
  }
}
export default App;
