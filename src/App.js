import React, { Component } from 'react';
import './App.css';
import Links from './components/Links';
import Headlines from './components/Headlines';
import CalEvents from './components/CalEvents';
import moment from 'moment';

var gapi = window.gapi;
var API_KEY = `${process.env.REACT_APP_GOOGLECAL_KEY}`;
var CLIENT_ID = `${process.env.REACT_APP_GOOGLECALCLIENT_KEY}`;
var DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
];
var SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

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

  // getEvents() {
  //   let that = this;
  //   function start() {
  //     gapi.client
  //       .init({
  //         apiKey: `${API_KEY}`,
  //       })
  //       .then(function() {
  //         return gapi.client.request({
  //           path: `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?maxResults=10&orderBy=startTime&showDeleted=false&singleEvents=true&timeMin=${moment()
  //             .startOf('day')
  //             .toISOString()}&timeMax=${moment()
  //             .endOf('day')
  //             .toISOString()}`,
  //         });
  //       })
  //       .then(
  //         (response) => {
  //           let events = response.result.items;
  //           that.setState({
  //             events: events,
  //           });
  //         },
  //         function(reason) {
  //           console.log(reason);
  //         }
  //       );
  //   }
  //   gapi.load('client', start);
  // }

  FetchDataFromRssFeed() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        var myObj = JSON.parse(request.responseText);
        this.setState({
          headlines: myObj.items,
        });
      }
    };
    request.open(
      'GET',
      'https://api.rss2json.com/v1/api.json?rss_url=https://www.theverge.com/rss/front-page/index.xml',
      true
    );
    request.send();
  }

  componentDidMount() {
    // this.getEvents();

    this.FetchDataFromRssFeed();

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
            this.setState({
              weatherdata: {
                temp: temp,
                description: description,
                icon: icon,
              },
            });
          })
          .catch((err) => {
            this.setState({
              error: 'Something went wrong.',
            });
          });
      }, 100);
    });
  }

  handleClick() {
    gapi.load('client:auth2', () => {
      console.log('loaded client');

      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });

      gapi.client.load('calendar', 'v3');

      gapi.auth2
        .getAuthInstance()
        .signIn()
        .then(() => {
          // get events
          gapi.client.calendar.events
            .list({
              calendarId: 'primary',
              timeMin: moment()
                .startOf('day')
                .toISOString(),
              timeMax: moment()
                .endOf('day')
                .toISOString(),
              showDeleted: false,
              singleEvents: true,
              maxResults: 10,
              orderBy: 'startTime',
            })
            .then((result) => {
              let gCalEvents = result.result.items;
              console.log(gCalEvents);
              this.setState({
                events: gCalEvents,
              });
            })
            .catch((err) => {
              this.setState({
                error: 'Something went wrong.',
              });
            });
        });
    });
  }

  render() {
    // set url for weather icon
    const iconImg = this.state.weatherdata.icon;
    const imgUrl = `https://www.weatherbit.io/static/img/icons/${iconImg}.png`;

    // map over headlines
    const headlines = this.state.headlines.map((headline, i) => {
      return <Headlines {...headline} key={i} />;
    });

    // map over calendar events
    const calEvents = this.state.events.map((calEvent, i) => {
      if (this.state.events && this.state.events.length) {
        return <CalEvents {...calEvent} key={i} />;
      } else {
        return <p>No Calendar Events Today</p>;
      }
    });

    return (
      <main className='app'>
        <button className='google-signin' onClick={this.handleClick.bind(this)}>
          Google Sign-in
        </button>
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
          {this.state.weatherdata.icon.length ? (
            <img src={imgUrl} alt={this.state.weatherdata.description} />
          ) : (
            ''
          )}
          {!this.state.weatherdata.temp.length ? (
            <h1>{this.state.weatherdata.temp}</h1>
          ) : (
            ''
          )}
          <p>{this.state.weatherdata.description}</p>
        </section>
        <section className='calendar'>
          <h2>{moment().format('ddd, MMMM Do')}</h2>
          {this.state.events && this.state.events.length ? (
            <ul>{calEvents}</ul>
          ) : (
            <p>No Calendar Events Today</p>
          )}
        </section>
        <section className='headlines'>
          <h2>Articles from The Verge</h2>
          {headlines}
        </section>
      </main>
    );
  }
}
export default App;
