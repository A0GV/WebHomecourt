import { MapContainer, TileLayer, Popup, useMapEvents, Circle, CircleMarker, Marker } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import { useEffect, useState } from "react";
import type { LatLng, Map as LeafletMap } from "leaflet";
import type { Court } from "../services/apiMAP";
import { getCiudad, getCourts } from "../services/apiMAP";

function getCourtIcon(label: number | string, isSelected = false) {
  return divIcon({
    className: `hc-court-marker${isSelected ? " hc-court-marker--selected" : ""}`,
    html: `
      <div class="hc-court-marker__pin">
        <span class="hc-court-marker__label">${label}</span>
        <span class="hc-court-marker__badge"></span>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 44],
    popupAnchor: [0, -38],
  });
}




function CourtsMarkers({ courts, error, selectedCourtId, onSelectCourt }: {
  courts: Court[];
  error: string;
  selectedCourtId: number | null;
  onSelectCourt: (court: Court) => void;
}) {
  const fallbackPosition: [number, number] = [34.048408, -118.252957];

  return (
    <>
      {error ? (
        <Marker position={fallbackPosition}>
          <Popup>{error}</Popup>
        </Marker>
      ) : null}
      {courts.map((court, index) => (
        <Marker
          key={court.court_id}
          position={[court.latitude, court.longitude]}
          icon={getCourtIcon(index + 1, selectedCourtId === court.court_id)}
          eventHandlers={{
            click: () => onSelectCourt(court),
          }}
        >
          <Popup>
            <b>{court.name}</b><br/>
            {court.direction}
          </Popup>
        </Marker>
      ))}
    </>
  );
}

function LocationMarker({ locateRequest, onCityChange }: { locateRequest: number; onCityChange: (city: string) => void }) {
  const [position, setPosition] = useState<LatLng | null>(null);
  const [error, setError] = useState<string>("");

  const map = useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 15);
    },
    locationerror() {
      setError("No se pudo obtener tu ubicacion.");
      onCityChange("Ubicacion no disponible");
    },
  });

  useEffect(() => {
    map.locate({
      setView: true,
      maxZoom: 15,
      enableHighAccuracy: false,
    });
  }, [map]);

  useEffect(() => {
    if (locateRequest === 0) {
      return;
    }

    map.locate({
      setView: true,
      maxZoom: 15,
      enableHighAccuracy: false,
    });
  }, [map, locateRequest]);

  useEffect(() => {
    const currentPosition = position;

    if (currentPosition === null) {
      return;
    }

    const { lat, lng } = currentPosition;

    let isCancelled = false;

    async function loadCurrentCity() {
      try {
        const city = await getCiudad(lat, lng);
        if (!isCancelled) {
          onCityChange(city ?? "Ciudad no disponible");
        }
      } catch {
        if (!isCancelled) {
          onCityChange("Ciudad no disponible");
        }
      }
    }

    loadCurrentCity();

    return () => {
      isCancelled = true;
    };
  }, [position, onCityChange]);

  return position === null ? (
    error ? <Popup position={map.getCenter()}>{error}</Popup> : null
  ) : (
    <>
      <Circle
        center={position}
        pathOptions={{
          color: "#2b7fff",
          fillColor: "#2b7fff",
          fillOpacity: 0.15,
          weight: 1,
        }}
      />
      <CircleMarker
        center={position}
        radius={8}
        pathOptions={{
          color: "#ffffff",
          weight: 2,
          fillColor: "#2b7fff",
          fillOpacity: 1,
        }}
      >
        <Popup>Tu ubicacion actual</Popup>
      </CircleMarker>
    </>
  );
}

export default function Map() {
  const fallbackPosition: [number, number] = [34.048408, -118.252957];
  const [courts, setCourts] = useState<Court[]>([]);
  const [error, setError] = useState<string>("");
  const [locateRequest, setLocateRequest] = useState(0);
  const [currentCity, setCurrentCity] = useState("Detectando ciudad...");
  const [selectedCourtId, setSelectedCourtId] = useState<number | null>(null);
  const [map, setMap] = useState<LeafletMap | null>(null);

  useEffect(() => {
    async function loadCourts() {
      try {
        const data = await getCourts();
        console.log("Canchas obtenidas de la BD:", data);
        setCourts(data ?? []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "No se pudo cargar.");
      }
    }

    loadCourts();
  }, []);

  useEffect(() => {
    if (map === null || selectedCourtId === null) {
      return;
    }

    const selectedCourt = courts.find((court) => court.court_id === selectedCourtId);

    if (!selectedCourt) {
      return;
    }

    map.flyTo([selectedCourt.latitude, selectedCourt.longitude], Math.max(map.getZoom(), 15));
  }, [courts, map, selectedCourtId]);

  return (
    <section className="w-full max-w-[1120px] overflow-hidden rounded-[24px] border border-[#e7e6e8] bg-[#f3f2f5] shadow-[0_28px_52px_rgba(35,17,61,0.3)] max-[640px]:rounded-[18px]">
      <header className="flex items-center justify-between gap-3 border-b border-[#e7e6e8] bg-[#3b195c] px-6 py-[18px] text-[#f3f2f3] max-[900px]:flex-wrap max-[900px]:justify-center max-[640px]:p-[14px]">
        <p className="m-0 flex items-center gap-[10px] text-[0.95rem] font-bold tracking-[0.08em]">
          <span className="h-3 w-3 rounded-full bg-[#fcb136]" aria-hidden="true" />
          MAP VIEW
        </p>
        <div className="flex items-center gap-[10px]">
          <button type="button" className="rounded-full bg-[#7e57d7] px-5 py-[10px] text-[0.95rem] font-semibold text-[#e7e6e8] shadow-[0_10px_18px_rgba(20,10,44,0.35)]">Satellite</button>
          <button type="button" className="rounded-full bg-[rgba(147,130,164,0.64)] px-5 py-[10px] text-[0.95rem] font-semibold text-[rgba(169,157,182,0.83)]">List</button>
        </div>
      </header>

      <div className="hc-map-stage">
        <MapContainer center={fallbackPosition} zoom={13} className="h-[560px] w-full max-[900px]:h-[460px] max-[640px]:h-[360px]" ref={setMap}>
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker locateRequest={locateRequest} onCityChange={setCurrentCity} />
          <CourtsMarkers
            courts={courts}
            error={error}
            selectedCourtId={selectedCourtId}
            onSelectCourt={(court) => setSelectedCourtId(court.court_id)}
          />
        </MapContainer>

        <div className="hc-map-chip-base hc-map-chip--city">{currentCity}</div>
        <button
          onClick={() => setLocateRequest((prev) => prev + 1)}
          type="button"
          className="hc-map-chip-base hc-map-chip--location"
        >
          My Location
        </button>
      </div>

      <div className="hc-map-courts-strip flex items-center gap-3 overflow-x-auto border-t border-[#e7e6e8] bg-[#f3f2f5] px-5 py-4">
        {courts.length > 0 ? (
          courts.map((court) => (
            <button
              key={court.court_id}
              type="button"
              className={`hc-map-court-card-base${selectedCourtId === court.court_id ? " hc-map-court-card-base--selected" : ""}`}
              onClick={() => setSelectedCourtId(court.court_id)}
            >
              {court.name}
            </button>
          ))
        ) : (
          <button type="button" className="hc-map-court-card-base hc-map-court-card-base--disabled" disabled>
            {error ? "No se pudieron cargar las canchas" : "Cargando canchas..."}
          </button>
        )}
      </div>
    </section>
  );
}