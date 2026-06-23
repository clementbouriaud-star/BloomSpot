import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getCarreaux, getBoulangeries, getZonesAccessibilite } from "./lib/supabaseApi";

function scoreColor(score) {
  if (score >= 66) return "#22c55e";
  if (score >= 33) return "#f97316";
  return "#ef4444";
}

const ZONE_COLORS = {
  aire_pietonne:  { color: "#3b82f6", fillColor: "#93c5fd" },
  zone_rencontre: { color: "#16a34a", fillColor: "#86efac" },
  aire_mixte:     { color: "#ea580c", fillColor: "#fdba74" },
};

const ZONE_LABELS = {
  aire_pietonne:  "Aire piétonne",
  zone_rencontre: "Zone de rencontre",
  aire_mixte:     "Aire mixte",
};

export default function MapScore() {
  const [geojson, setGeojson] = useState(null);
  const [boulangeries, setBoulangeries] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCarreaux(), getBoulangeries(), getZonesAccessibilite()])
      .then(([carreaux, boulangs, zonesData]) => {
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
        setZones(zonesData);
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

  const zonesGeojson = {
    type: "FeatureCollection",
    features: zones.map((z) => ({
      type: "Feature",
      geometry: z.geometry,
      properties: { nom: z.nom, type_zone: z.type_zone },
    })),
  };

  return (
    <div style={{ width: "100%" }}>
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

        {zones.length > 0 && (
          <GeoJSON
            key="zones"
            data={zonesGeojson}
            style={(feature) => {
              const c = ZONE_COLORS[feature.properties.type_zone] || { color: "#888", fillColor: "#ccc" };
              return { ...c, fillOpacity: 0.35, weight: 1.5 };
            }}
            onEachFeature={(feature, layer) => {
              const label = ZONE_LABELS[feature.properties.type_zone] || "Zone";
              layer.bindTooltip(`${label} — ${feature.properties.nom}`, { sticky: true });
            }}
          />
        )}

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

      <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", fontSize: "0.8rem" }}>
        {[
          { color: "#93c5fd", border: "#3b82f6", label: "Aire piétonne" },
          { color: "#86efac", border: "#16a34a", label: "Zone de rencontre" },
          { color: "#fdba74", border: "#ea580c", label: "Aire mixte" },
        ].map(({ color, border, label }) => (
          <span key={label} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <span style={{ width: 14, height: 14, background: color, border: `2px solid ${border}`, borderRadius: 2, display: "inline-block" }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
