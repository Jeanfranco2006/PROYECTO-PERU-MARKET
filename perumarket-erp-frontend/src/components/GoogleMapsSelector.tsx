import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FiMapPin, FiSearch, FiNavigation } from 'react-icons/fi';

// ==========================================
// 1. CORRECCIÓN DE ICONOS DE LEAFLET
// ==========================================
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ==========================================
// 2. COMPONENTES AUXILIARES
// ==========================================

function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>📍 Ubicación seleccionada</Popup>
    </Marker>
  );
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 16, { duration: 1.5 });
  }, [center, map]);
  return null;
}

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================

interface OpenStreetMapSelectorProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLocation?: { lat: number; lng: number };
  height?: string;
}

const OpenStreetMapSelector: React.FC<OpenStreetMapSelectorProps> = ({
  onLocationSelect,
  initialLocation,
  height = '500px' // Valor por defecto
}) => {
  const defaultCenter: [number, number] = [-12.046374, -77.042793]; // Lima

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : null
  );
  
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : defaultCenter
  );

  const [addressDisplay, setAddressDisplay] = useState('');

  useEffect(() => {
    if (initialLocation) {
      const coords: [number, number] = [initialLocation.lat, initialLocation.lng];
      setMarkerPosition(coords);
      setMapCenter(coords);
    }
  }, [initialLocation]);

  // --- Manejar Clic en Mapa ---
  const handleMapClick = (lat: number, lng: number) => {
    setMarkerPosition([lat, lng]);
    setIsLoading(true);
    
    // Usamos Nominatim para obtener la dirección (Gratis)
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`, {
      headers: { 'Accept-Language': 'es' }
    })
      .then(res => res.json())
      .then(data => {
        let display = data.display_name;
        if (data.address) {
           const { road, house_number, suburb, city, state } = data.address;
           if (road) display = `${road} ${house_number || ''}, ${suburb || city || ''}`;
        }
        setAddressDisplay(display);
        onLocationSelect(lat, lng, display);
      })
      .catch(() => {
        const coords = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        setAddressDisplay(coords);
        onLocationSelect(lat, lng, coords);
      })
      .finally(() => setIsLoading(false));
  };

  // --- Manejar Búsqueda ---
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&countrycodes=pe`, {
      headers: { 'Accept-Language': 'es' }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          
          setMarkerPosition([lat, lng]);
          setMapCenter([lat, lng]);
          setAddressDisplay(data[0].display_name);
          onLocationSelect(lat, lng, data[0].display_name);
        } else {
          alert('No se encontró la dirección.');
        }
      })
      .catch(() => alert('Error de conexión.'))
      .finally(() => setIsLoading(false));
  };

  const atajos = [
    { name: "Miraflores", coords: [-12.1111, -77.0316] },
    { name: "San Isidro", coords: [-12.0967, -77.0353] },
    { name: "Centro Lima", coords: [-12.0464, -77.0428] },
    { name: "La Molina", coords: [-12.0769, -76.9292] },
  ];

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      
      {/* Buscador y Atajos */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar dirección (ej: Av. Larco, Lima)" 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button 
            onClick={handleSearch}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? '...' : 'Buscar'}
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {atajos.map((a, i) => (
            <button 
              key={i} 
              onClick={() => {
                setMapCenter([a.coords[0], a.coords[1]]);
                handleMapClick(a.coords[0], a.coords[1]);
              }}
              className="px-3 py-1 bg-gray-100 rounded-full text-xs hover:bg-gray-200 whitespace-nowrap flex items-center gap-1"
            >
              <FiNavigation size={10} /> {a.name}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENEDOR DEL MAPA - AQUÍ ESTÁ LA CORRECCIÓN CLAVE */}
      {/* Usamos style={{ height: height }} explícitamente */}
      <div 
        className="border rounded-xl overflow-hidden relative shadow-md" 
        style={{ height: height, width: '100%', minHeight: '400px' }}
      >
        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }} // MapContainer llena el div padre
        >
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors' 
          />
          
          <MapUpdater center={mapCenter} />
          <LocationMarker onLocationSelect={handleMapClick} />
          {markerPosition && <Marker position={markerPosition} />}
        </MapContainer>

        {isLoading && (
          <div className="absolute inset-0 bg-white/50 z-[1000] flex items-center justify-center backdrop-blur-sm">
            <span className="font-bold text-blue-800 bg-white px-4 py-2 rounded-full shadow">Cargando...</span>
          </div>
        )}
      </div>

      {/* Resultado Texto */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
        <p className="text-xs font-bold text-blue-600 uppercase">Dirección seleccionada:</p>
        <p className="text-sm text-gray-800 font-medium">
          {addressDisplay || "Haz clic en el mapa para seleccionar"}
        </p>
      </div>
    </div>
  );
};

export default OpenStreetMapSelector;