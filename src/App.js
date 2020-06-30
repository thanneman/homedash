import React, { Component } from 'react';
import './App.css';
import Links from './components/Links';

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
        city_name: '',
        description: '',
        icon: '',
        temp: '',
      },
      headlines: [],
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

  componentDidMount() {
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
        fetch(
          `http://api.weatherbit.io/v2.0/current?lat=${this.state.location.latitude}&lon=${this.state.location.longitude}&units=I&key=${process.env.REACT_APP_WEATHER_KEY}`,
          {
            method: 'GET',
          }
        )
          .then((res) => {
            if (!res.ok) {
              throw new Error(res.statusText);
            }
            return res.json();
          })
          .then((result) => {
            //console.log(result.data[0].weather.icon);
            const { temp, city_name } = result.data[0];
            const { description, icon } = result.data[0].weather;
            this.setState({
              weatherdata: {
                city_name,
                description,
                icon,
                temp: temp.toFixed(1),
              },
            });
          })
          .catch((err) => {
            this.setState({
              error: 'Something went wrong. Please try a different search.',
            });
          });
      }, 100);
    });
  }

  render() {
    const iconImg = this.state.weatherdata.icon;
    const imgUrl = `https://www.weatherbit.io/static/img/icons/${iconImg}.png`;
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
          {this.state.weatherdata.temp.length > 0 ? (
            <h1>{this.state.weatherdata.temp + '°'}</h1>
          ) : (
            ''
          )}
          <p>{this.state.weatherdata.description}</p>
        </section>
        <section className='headlines'></section>
      </main>
    );
  }
}
export default App;
