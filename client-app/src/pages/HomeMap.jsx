import React, { useEffect, useRef, useState } from 'react';
import { propertyService } from '../services/api';
import CompactSearchBar from '../components/CompactSearchBar/CompactSearchBar';
import Services from '../components/Services';
import RecentListings from '../components/RecentListings/RecentListings';
import Agents from '../components/Agents';
import Partners from '../components/PartnersLogos/PartnersLogos';
import LatestNews from '../components/LatestNews';
import Testimonials from '../components/Testimonials';
import CallToAction from '../components/CallToAction';
import './HomeMap.css';

const HomeMap = () => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [properties, setProperties] = useState([]);
    const [filters, setFilters] = useState({});
    const markersRef = useRef([]);
    const drawingManagerRef = useRef(null);

    // Initial load of properties
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res = await propertyService.getAll(filters);
                setProperties(res.data.properties || res.data);
            } catch (error) {
                console.error("Error fetching properties for map:", error);
            }
        };
        fetchProperties();
    }, [filters]);

    // Initialize Google Map
    useEffect(() => {
        if (!window.google) return;

        const googleMap = new window.google.maps.Map(mapRef.current, {
            center: { lat: 40.7128, lng: -74.0060 }, // New York
            zoom: 12,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            styles: [
                {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [{ "color": "#444444" }]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [{ "color": "#f2f2f2" }]
                }
            ]
        });

        const drawingManager = new window.google.maps.drawing.DrawingManager({
            drawingMode: null,
            drawingControl: true,
            drawingControlOptions: {
                position: window.google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [window.google.maps.drawing.OverlayType.POLYGON]
            },
            polygonOptions: {
                fillColor: '#1b9bff',
                fillOpacity: 0.2,
                strokeWeight: 2,
                strokeColor: '#1b9bff',
                clickable: true,
                editable: true,
                zIndex: 1
            }
        });

        drawingManager.setMap(googleMap);
        
        window.google.maps.event.addListener(drawingManager, 'overlaycomplete', (event) => {
            if (event.type === window.google.maps.drawing.OverlayType.POLYGON) {
                const polygon = event.overlay;
                const path = polygon.getPath();
                const coords = [];
                for (let i = 0; i < path.getLength(); i++) {
                    coords.push([path.getAt(i).lng(), path.getAt(i).lat()]);
                }
                
                // Update filters with boundary
                setFilters(prev => ({
                    ...prev,
                    boundary: JSON.stringify(coords)
                }));

                // Reset drawing mode
                drawingManager.setDrawingMode(null);
            }
        });

        setMap(googleMap);
        drawingManagerRef.current = drawingManager;
    }, []);

    // Update markers when properties change
    useEffect(() => {
        if (!map || !window.google) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        properties.forEach(prop => {
            if (prop.latitude && prop.longitude) {
                const marker = new window.google.maps.Marker({
                    position: { lat: prop.latitude, lng: prop.longitude },
                    map: map,
                    title: prop.title,
                    icon: {
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: "#1b9bff",
                        fillOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: "#ffffff",
                    }
                });

                const infoWindow = new window.google.maps.InfoWindow({
                    content: `<div class="map-info-window">
                        <img src="${prop.imageURL}" style="width:100px;height:auto;border-radius:4px;" />
                        <h5 style="margin:5px 0;font-size:14px;">${prop.title}</h5>
                        <p style="margin:0;color:#1b9bff;font-weight:700;">$${prop.price?.toLocaleString()}</p>
                        <a href="/property/${prop._id}" style="font-size:12px;text-decoration:none;color:#666;">View Details</a>
                    </div>`
                });

                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });

                markersRef.current.push(marker);
            }
        });

        // Center map on first property if available
        if (properties.length > 0 && properties[0].latitude) {
            map.panTo({ lat: properties[0].latitude, lng: properties[0].longitude });
        }
    }, [properties, map]);

    const handleSearch = (searchData) => {
        setFilters(prev => ({ ...prev, ...searchData }));
    };

    return (
        <div className="home-map-page">
            <section className="hero-map-section">
                <div className="fullscreen-map" ref={mapRef} style={{ height: '600px', width: '100%' }}>
                    {/* Map rendered here */}
                </div>
                <div className="map-search-overlay">
                    <div className="container">
                        <div className="search-box-container">
                            <h2 className="map-search-title">Find your <br /><span>House</span></h2>
                            <div className="map-search-form-wrap">
                                <CompactSearchBar onSearch={handleSearch} boundary={filters.boundary} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Services />
            <RecentListings filters={filters} />
            <Agents />
            <Partners />
            <LatestNews />
            <Testimonials />
            <CallToAction />
        </div>
    );
};

export default HomeMap;
