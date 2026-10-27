import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StationsMap({ stations, userPoint }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const navigate = useNavigate();
  const [apiReady, setApiReady] = useState(Boolean(window.ymaps));

  useEffect(() => {
    if (window.ymaps) {
      setApiReady(true);
      return;
    }
    const timer = setInterval(() => {
      if (window.ymaps) {
        setApiReady(true);
        clearInterval(timer);
      }
    }, 200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!apiReady || !mapRef.current) {
      return;
    }

    window.ymaps.ready(() => {
      if (!instanceRef.current) {
        instanceRef.current = new window.ymaps.Map(mapRef.current, {
          center: [55.75, 37.62],
          zoom: 10,
        });
      }

      const map = instanceRef.current;
      map.geoObjects.removeAll();

      stations.forEach((station) => {
        const mark = new window.ymaps.Placemark(
          [station.lat, station.lng],
          { balloonContent: station.name }
        );
        mark.events.add("click", () => navigate(`/stations/${station.id}`));
        map.geoObjects.add(mark);
      });

      if (userPoint) {
        map.geoObjects.add(
          new window.ymaps.Placemark(
            [userPoint.lat, userPoint.lng],
            { balloonContent: "Вы здесь" },
            { preset: "islands#blueCircleDotIcon" }
          )
        );
      }
    });
  }, [apiReady, stations, userPoint, navigate]);

  if (!apiReady) {
    return <p className="hint">Загрузка карты…</p>;
  }

  return <div ref={mapRef} className="map" />;
}
