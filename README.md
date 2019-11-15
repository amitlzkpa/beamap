# BeaMap

Mapping LTE networks for emergency responders.

![BeaMap](/assets/images/scr_02.jpg)

[DEMO](https://beamap.herokuapp.com/)

Beamap is a mapping application to estimate and visualize LTE services and quality.
It accepts configuration information about the service like antenna location, strength, height and uses it to calculate expected signal strength and quality.
It visualizes this data as a heatmap overlaid over an interactive georaphical map.
You can zoom in to find out more details about service quality and strength by clicking on indivdual points.
The application also accepts recorded data about service quality in the same region and uses it to enhance its prediction.

It runs as a progressive web app which means anyone can install it by going to a certain URL.
The app can be installed on any phone, tablet or PC.
It is platform runs like a native application on chosen device.

You can cache the maps and application before going out to site and have the full service accessible without an internet connection.

The application accepts inputs in CSV format and uses the link budget equation to estimate signal strength at locations.
It can accepts multiple data sources and the user can add/remove datasets to be visualized on the fly.



BeaMap is a offline ready mapping application to help first responders map LTE services available.

It creates a heatmap visualizing the expected network availability and quality using the link budget equation to estimate signal strength at locations.  
It accepts datasets of recorded signal strengths and improves its own estimates of the network availability.


## Screenshots
![BeaMap](/assets/images/scr_01.jpg)

![BeaMap](/assets/images/scr_03.jpg)

![BeaMap](/assets/images/scr_04.jpg)

![BeaMap](/assets/images/scr_05.jpg)

![BeaMap](/assets/images/scr_06.jpg)

## Features
- A web app which can accept, process and visualize coverage data.
- Fully interactive.
- Add multiple datasets.
- It runs in the browser so is platform independent.
- Works across tablets, phones, desktops etc.
- Easy easy install.
- Pretty looking maps.
- Runs without a backend.

## Development
Project setup
```
npm install
```
Start development environment
```
npm run serve
```
Build for production
```
npm run build
```

## Credits
- [Mapbox](https://www.mapbox.com)
- [FileSaver](https://github.com/eligrey/FileSaver.js)
- [Seedrandom](https://github.com/davidbau/seedrandom)