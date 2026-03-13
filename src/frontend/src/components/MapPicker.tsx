import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, MapPin } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface MapPickerProps {
  title: string;
  initialCoords?: { lat: number; lon: number };
  onConfirm: (lat: number, lon: number, address: string) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    L: any;
  }
}

export default function MapPicker({
  title,
  initialCoords,
  onConfirm,
  onClose,
}: MapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const initialCoordsRef = useRef(initialCoords);
  const [address, setAddress] = useState("");
  const [fetchingAddress, setFetchingAddress] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [leafletReady, setLeafletReady] = useState(false);

  // Load Leaflet CSS + JS from CDN
  useEffect(() => {
    const cssId = "leaflet-css";
    const jsId = "leaflet-js";

    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    if (window.L) {
      setLeafletReady(true);
      return;
    }

    const existingScript = document.getElementById(
      jsId,
    ) as HTMLScriptElement | null;
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = jsId;
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => setLeafletReady(true);
      document.head.appendChild(script);
    } else {
      existingScript.addEventListener("load", () => setLeafletReady(true));
    }
  }, []);

  // Reverse geocode helper (stable via useCallback)
  const doFetchAddress = useCallback(async (lat: number, lon: number) => {
    setFetchingAddress(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
        { headers: { "Accept-Language": "en" } },
      );
      if (!res.ok) throw new Error("Geocoding failed");
      const data = await res.json();
      setAddress(data.display_name as string);
    } catch {
      setAddress("Could not fetch address");
    } finally {
      setFetchingAddress(false);
    }
  }, []);

  // Keep a ref so the map event handlers (closures) can call the latest version
  const fetchAddressRef = useRef(doFetchAddress);
  fetchAddressRef.current = doFetchAddress;

  // Initialize map once Leaflet is ready
  useEffect(() => {
    if (!leafletReady || !mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const L = window.L;
    const coords = initialCoordsRef.current;
    const defaultCenter: [number, number] = coords
      ? [coords.lat, coords.lon]
      : [20.5937, 78.9629];
    const defaultZoom = coords ? 14 : 5;

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: defaultZoom,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "\u00a9 OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    const icon = L.divIcon({
      html: `<div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#e11d48"/></svg></div>`,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    const marker = L.marker(defaultCenter, { draggable: true, icon }).addTo(
      map,
    );
    markerRef.current = marker;
    mapInstanceRef.current = map;

    setCurrentCoords({ lat: defaultCenter[0], lon: defaultCenter[1] });
    fetchAddressRef.current(defaultCenter[0], defaultCenter[1]);

    marker.on("dragend", (e: any) => {
      const { lat, lng } = e.target.getLatLng();
      setCurrentCoords({ lat, lon: lng });
      fetchAddressRef.current(lat, lng);
    });

    map.on("click", (e: any) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      setCurrentCoords({ lat, lon: lng });
      fetchAddressRef.current(lat, lng);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, [leafletReady]);

  const handleConfirm = () => {
    if (currentCoords && address && !fetchingAddress) {
      onConfirm(currentCoords.lat, currentCoords.lon, address);
    }
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="max-w-2xl w-full p-0 overflow-hidden"
        data-ocid="map_picker.dialog"
      >
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-rose-500" />
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Map container */}
        <div
          ref={mapContainerRef}
          style={{ height: "60vh", width: "100%", position: "relative" }}
          data-ocid="map_picker.map_marker"
        >
          {!leafletReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-sm">Loading map...</span>
              </div>
            </div>
          )}
        </div>

        {/* Address preview + actions */}
        <div className="px-4 py-3 space-y-3 border-t bg-background">
          <div className="min-h-[2.5rem] flex items-start gap-2">
            {fetchingAddress ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Fetching address...
              </div>
            ) : address ? (
              <div className="text-sm text-foreground leading-snug">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-0.5">
                  Selected location
                </span>
                {address}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Tap or drag the pin to select a location
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={handleConfirm}
              disabled={!address || fetchingAddress || !currentCoords}
              data-ocid="map_picker.confirm_button"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Confirm Location
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              data-ocid="map_picker.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
