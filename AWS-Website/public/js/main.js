const initialize = async () => {
  
  /**
   * @returns an object containing:
   * array of unix epoch times in increments of 4 hours, beginning 28 hours ago
   * array of string timestamps in increments of 4 hours, beginning 24 hours ago
   */
  function getTimestamps() {

    /**
     * Get a string form of a time
     * @param {Number} time a unix epoch time
     * @returns A string of the form 'HH:MM MM-DD'
     */
    function generateLabel(time) {
      const t = new Date(time);
      var minutes = t.getMinutes();
      var hours = t.getHours();
      var month = t.getMonth() + 1;
      var day = t.getDate();

      minutes = minutes < 10 ? '0'+minutes : minutes;
      hours = hours < 10 ? '0'+hours : hours;
      month = month < 10 ? '0'+month : month;
      day = day < 10 ? '0'+day : day;

      return `${hours}:${minutes} ${month}-${day}`
    }

    const FOUR_HOURS = 1000*60*60*4;
    const nums = [7,6,5,4,3,2,1,0];
    const currentTime = Date.now();
    const timestamps = nums.map(x => currentTime-x*FOUR_HOURS)
    const labels = timestamps.map(x => generateLabel(x).split(" "));
    labels.shift();


    return {
      timestamps: timestamps,
      labels: labels
    }
  }

  const timeIntervals = getTimestamps();
  const dataTypes = ['pressure','co2','humidity','temperature']


  /**
   * For each datatype, calculates the highs, lows, and averages for each time interval, and creates the chart for the datatype from those values.
   * 
   * TODO: move the calculation of the highs, lows, and averages serverside.
   */
  async function createCharts() {

    dataTypes.forEach(async datatype => {

      var datatypeData = {
        highs: [],
        lows: [],
        averages: []
      }

      var interval;
      for (interval = 0; interval < timeIntervals.timestamps.length - 1; interval++) {

        const timeStart = timeIntervals.timestamps[interval];
        const timeEnd = timeIntervals.timestamps[interval + 1];

        var intervalData = [];

        var sid;
        for (sid = 0; sid < 2; sid++) {

          const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
          
          query = `/sensors/${sid}/readings?dataType=${datatype}&timeStart=${timeStart}&timeEnd=${timeEnd}`

          const response = await fetch('/data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, query })
          });

          const data = await response.json();
          //console.log(data);
          intervalData = intervalData.concat(data);

        }

        datatypeData.highs.push(Math.max(...intervalData));
        datatypeData.lows.push(Math.min(...intervalData));
        let sum = 0;
        intervalData.forEach(x => {sum +=x});
        datatypeData.averages.push(intervalData.length ? sum / intervalData.length : 0)

      }

      const loader = document.querySelector(".loader");
      loader.classList.add("loader-hidden");

      new Chart(document.getElementById(`${datatype}chart`), {
        type: 'line',
        data: {
          labels: timeIntervals.labels,
          datasets: [{
            label: 'high',
            data: datatypeData.highs,
            borderWidth: 1,
            backgroundColor: '#F28C0C',
            pointBackgroundColor: '#F28C0C',
            pointRadius: 1,
            borderColor: '#F28C0C',
            borderWidth: 3
          },{
            label: 'average',
            data: datatypeData.averages,
            borderWidth: 1,
            backgroundColor: '#84C642',
            pointBackgroundColor: '#84C642',
            pointRadius: 1,
            borderColor: '#84C642',
            borderWidth: 3
          },{
            label: 'low',
            data: datatypeData.lows,
            borderWidth: 1,
            backgroundColor: '#B0C6CE',
            pointBackgroundColor: '#B0C6CE',
            pointRadius: 1,
            borderColor: '#B0C6CE',
            borderWidth: 3
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: (datatype === 'pressure' ? false : true)
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    });
  }

  await createCharts();
  /*
  const waterLevelBarChartCtx = document.getElementById('waterlevelchart');
  new Chart(waterLevelBarChartCtx, {
    type: 'bar',
    data: {
      labels: ['yesterday','today','tomorrow'],
      datasets: [{
        label: 'high',
        data: [40, 42, 42],
        borderWidth: 1,
        backgroundColor: '#F28C0C'
      },{
        label: 'average',
        data: [35, 35, 36],
        borderWidth: 1,
        backgroundColor: '#84C642'
      },{
        label: 'low',
        data: [29, 30, 29],
        borderWidth: 1,
        backgroundColor: '#B0C6CE'
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
  */
  
}



window.onload = initialize;