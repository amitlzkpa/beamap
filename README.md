# BeaMap

Mapping LTE networks for emergency responders.

![BeaMap](/assets/images/scr_02.jpg)

[DEMO](https://beamap.herokuapp.com/)

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