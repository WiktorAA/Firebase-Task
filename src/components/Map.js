import React from 'react'
import { useEffect, useState } from 'react'

import { db } from '../firebase'

import L from 'leaflet'
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'


//adds leaflet css with working images{
import 'leaflet/dist/leaflet.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';

import { useAuth } from '../context/AuthContext.js'

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,

    //fixes marker inaccuracy
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;
// }

export default function Map() {
    const { currentUser } = useAuth();

    const [users, setUsers] = useState([])

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
            setUsers(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
        })
        return () => {
            unsubscribe();
        }
    }, [])

    const [loading, setLoading] = useState(true);
    /*
        navigator.geolocation.watchPosition((pos) => {
    
            //upload your location and then display everyone's marks from db
            if (currentUser) {
    
    
    
                updateDoc(doc(db, 'users', currentUser.uid), {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                })
            }
    
        }, (error) => {
            if (error.code == error.PERMISSION_DENIED) {
                updateDoc(doc(db, 'users', currentUser.uid), {
                    latitude: null,
                    longitude: null
                })
    
    
            }
        })
    */
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
            setUsers(snapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
            setLoading(false)
        })

        return () => {
            unsubscribe();
        }
    }, [])

    return (
        <div className='map-component' >
            <MapContainer center={[54.54, 15.19]} zoom={4} worldCopyJump={true} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {loading && <div style={{ margin: 'auto', position: 'absolute', top: 0, left: '50px', zIndex: 1000 }} >Loading...</div>}

                {users && users.map((user) => (
                    <MarkerContainer key={user.id} lat={user.data.latitude} long={user.data.longitude} username={user.data.username} userStatus={user.data.loggedIn} />
                ))}

                {/* <Marker position={[51.505, -0.09]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
                <Marker position={[52.505, -0.09]}></Marker> */}
            </MapContainer>
        </div >
    )
}

function MarkerContainer(props) {
    if (props.lat && props.long && props.userStatus) {
        return (
            <Marker position={[props.lat, props.long]} >
                <Popup>
                    {props.username}
                </Popup>
            </Marker>
        )
    }
}