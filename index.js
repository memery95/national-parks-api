'use strict'

const apiKey = 'api_key=MKjTuU0Sud51CpNITPYyNYZDeI3IwwRc85fA3C8b';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}` )
    return queryItems.join('&');
}

function displayResults(responseJson) {
    console.log(responseJson);
    for (let i = 0; i < responseJson.data.length; i++ ) {
        $('#results-list').append(
        ` <hr><li>
            <h3>${responseJson.data[i].fullName}</h3>
            <p><a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a></p>
            <p><b>Address:</b> ${responseJson.data[i].addresses[0].line1} ${responseJson.data[i].addresses[0].line2} ${responseJson.data[i].addresses[0].line3}  ${responseJson.data[i].states}, ${responseJson.data[i].addresses[0].postalCode}</p>
            <p><b>Directions:</b> ${responseJson.data[i].directionsInfo}</p>
            <p><b>Description:</b> ${responseJson.data[i].description}</p>
        </li>`
         )};
    $('#results').removeClass('hidden');
}
  

function getNationalParks(query, maxResults) {
    const params = {
        stateCode: query,
        limit: maxResults
    };
  
    const queryString = formatQueryParams(params);
    const url =  `${searchURL}?${queryString}&${apiKey}`;
  
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        $('#results-list').empty();
        throw new Error( 'State not Found.' );
      })
      .then(responseJson => {
        console.log(responseJson)
  
        $('#results-list').empty();
        displayResults(responseJson, maxResults);
        $('.error-message').empty();
      })
      .catch( error => {
        $('#js-error-message').text(`Something went wrong:  ${error.message}`);
        $('#results-list').empty();
      });
  }

  function watchForm() {
    $('form').submit( event => {
        console.log('running watchForm')
        event.preventDefault();
        const searchTerm = $('#js-search-park').val();
        const maxResults = $('#js-max-results').val();
        getNationalParks( searchTerm, maxResults );
    });
  }

$(watchForm);
