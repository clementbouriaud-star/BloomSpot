import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getCarreaux, getBoulangeries } from "./lib/supabaseApi";

function scoreColor(score) {
  if (score >= 66) return "#22c55e";
  if (score >= 33) return "#f97316";
  return "#ef4444";
}

export default function MapScore() {
  const [geojson, setGeojson] = useState(null);
  const [boulangeries, setBoulangeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCarreaux(), getBoulangeries()]).then(([carreaux, boulangs]) => {
      setGeojson({
        type: "FeatureCollection",
        features: carreaux.map((row) => ({
          type: "Feature",
          geometry: row.geometry,
          properties: {
            score_final: row.score_final,
            score_revenu: row.score_revenu,
            score_population: row.score_population,
            score_concurrence: row.score_concurrence,
            nb_boulangeries: row.nb_boulangeries,
            revenu_moyen: row.revenu_moyen,
            population: row.population,
          },
        })),
      });
      setBoulangeries(boulangs);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ height: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
        Chargement de la carte…
      </div>
    );
  }

  return (
    <MapContainer
      center={[48.857, 2.379]}
      zoom={14}
      style={{ height: 500, width: "100%", borderRadius: 12 }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {geojson && (
        <GeoJSON
          data={geojson}
          style={(feature) => ({
            fillColor: scoreColor(feature.properties.score_final),
            fillOpacity: 0.55,
            color: "#ffffff",
            weight: 0.5,
          })}
          onEachFeature={(feature, layer) => {
            const p = feature.properties;
            layer.bindPopup(`
              <strong>Score : ${p.score_final}/100</strong><br/>
              Population : ${p.population}<br/>
              Revenu moyen : ${Math.round(p.revenu_moyen).toLocaleString("fr-FR")} €<br/>
              Boulangeries : ${p.nb_boulangeries}
            `);
          }}
        />
      )}

      {boulangeries.map((b) => (
        <CircleMarker
          key={b.siret}
          center={[b.latitude, b.longitude]}
          radius={5}
          pathOptions={{ color: "#1d4ed8", fillColor: "#3b82f6", fillOpacity: 0.9, weight: 1.5 }}
        >
          <Popup>
            <strong>{b.nom}</strong><br />{b.adresse}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
