<template>
  <div>

    <div id="map">
    </div>

  </div>
</template>

<script>
let map = null;

export default {
  props: ["searchResultUpdated", "registerMap"],
  mounted: async function() {

    let mpbxgl_rsrc = await fetch("https://api.tiles.mapbox.com/mapbox-gl-js/v1.5.0/mapbox-gl.js");
    let mpbxgl_text = await mpbxgl_rsrc.text();
    eval.apply(window, [mpbxgl_text]);
    let mpbxgc_rsrc = await fetch("https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.2.0/mapbox-gl-geocoder.min.js");
    let mpbxgc_text = await mpbxgc_rsrc.text();
    eval.apply(window, [mpbxgc_text]);
    let fontsolid_rsrc = await fetch("https://use.fontawesome.com/releases/v5.0.13/js/solid.js");
    let fontsolid_text = await fontsolid_rsrc.text();
    eval.apply(window, [fontsolid_text]);
    let fontfa_rsrc = await fetch("https://use.fontawesome.com/releases/v5.0.13/js/fontawesome.js");
    let fontfa_text = await fontfa_rsrc.text();
    eval.apply(window, [fontfa_text]);
    await this.resetMap();
    this.addNavigator();
    this.addGeolocate();
    this.addGeocoder();
  },
  methods: {

    resetMap: async function(options) {
      let res = await fetch('/mapbox_token');
      let mapbox_token = await res.text();
      mapboxgl.accessToken = mapbox_token;
      map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/amitlzkpa/ck2ikd9lo30ay1cter48jeo3u',
        center: [-90.405077, 40.283965],
        zoom: 4,
        maxZoom: 18,
        preserveDrawingBuffer: true
      });
      this.$emit("registerMap", map);
    },

    addNavigator: function(options) {
      map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
    },

    addGeocoder: function() {

      let geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        marker: {
          color: 'orange'
        },
        mapboxgl: mapboxgl
      });
      
      geocoder.on('result', (res) => {
        this.$emit("searchResultUpdated", res);
      });

      map.addControl(geocoder, 'top-left');
    },

    addGeolocate: function() {
      map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
        enableHighAccuracy: true
      },
        trackUserLocation: true
      }));

    },

    update: async function() {
      
    }

  }
}
</script>

