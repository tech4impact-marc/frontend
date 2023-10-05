import 'mapbox-gl/dist/mapbox-gl.css'; 

import { Box, Button } from '@mui/material';
import mapboxgl, { MapLayerMouseEvent } from 'mapbox-gl';
import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import styles from 'styles/Map.module.css';


interface Marker {
  title: string;
  description: string;
  latCoord: number;
  longCoord: number;
}

// temp data to plot
const markers: Marker[] = [
  {
    title: 'Jeju',
    description: 'Jeju',
    longCoord: 126.0843,
    latCoord: 33.1127,
  },
  {
    title: 'Jeju2',
    description: 'Jeju2',
    longCoord: 126.5820,
    latCoord: 33.3350,
  },
  {
    title: 'Jeju3',
    description: 'South Korea',
    longCoord: 126.5821,
    latCoord: 33.3351,
  },
  {
    title: 'Jeju4',
    description: 'Dolgorae',
    longCoord: 126.6600,
    latCoord: 33.1527,
  },
]

const Map: NextPage = () => {
  const mapContainer = useRef<any>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const [lng, setLng] = useState(126.5311884);
  const [lat, setLat] = useState(33.4);
  const [zoom, setZoom] = useState(8);

  // define dummy datas to plot
  const geojson: any = {
    type: 'FeatureCollection',
    features: markers.map((marker) => ({
      type: 'Feature',
      properties: {
        title: marker.title,
        description: marker.description,
      },
      geometry: {
        type: 'Point',
        coordinates: [marker.longCoord, marker.latCoord],
      }
    }))
  };

  // initialize map on mount
  useEffect(() => {
    if (map.current) return;
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY ?? '';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/hhkang/clna9zzp8009j01pydu7133n2',
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on('load', () => {    
      if (!map.current) return;
      const currentMap = map.current;

      // add the data source for new a GeoJSON feature collection
      currentMap.addSource('reports', {
        type: 'geojson',
        data: geojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // add a layer for the clusters
      currentMap.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'reports',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            10,
            '#f1f075',
            30,
            '#f28cb1',
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40,
          ],
        }
      });

      // add a layer for the cluster count labels
      currentMap.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'reports',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        }
      });

      // add a layer for the unclustered points
      currentMap.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'reports',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 10,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
        }
      });

      // show popup when clicking a point
      currentMap.on('click', 'unclustered-point', (e: MapLayerMouseEvent) => {
        if (!e.features) return;
        const geo = e.features[0].geometry;

        if (geo.type !== 'Point') return;
        const coordinates = geo.coordinates.slice();

        const description = e.features[0].properties?.description ?? "";
        const title = e.features[0].properties?.title ?? "";
        
        new mapboxgl.Popup()
          .setLngLat(coordinates as [number, number])
          .setHTML(`<h3>${title}</h3><p>${description}</p>`)
          .addTo(map.current as mapboxgl.Map);
      });

      // zomm to cluster on click
      currentMap.on('click', 'clusters', (e: MapLayerMouseEvent) => {
        const features = currentMap.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        if (!features) return;

        const clusterId = features[0].properties?.cluster_id;
        const geo = features[0].geometry;
        if (!clusterId || geo.type !== 'Point') return;

        const clusterSource = currentMap.getSource('reports');
        if (clusterSource?.type !== 'geojson') return;

        clusterSource.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
          if (err) return;

          currentMap.easeTo({
            center: geo.coordinates as [number, number],
            zoom: zoom,
          });
        });
      });
    });
  }, []);


  return (
    <div>
      <div className={`map-container ${styles.mapbox}`} ref={mapContainer}></div>
      <Box sx={{display: 'flex', justifyContent: 'flex-end', padding: 3}}>
        <Button variant='contained' color='primary' size='large'>제보하기</Button>
      </Box>
    </div>
  );
};

export default Map;