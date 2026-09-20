import { Canvas } from '@react-three/fiber';
import { SceneBackground } from '../scene/SceneBackground';
import { ChatUI } from '../ui/ChatUI';
import { Suspense, useState, useEffect, useRef } from 'react';
import { CameraControls } from '@react-three/drei';
import { InteractiveObject } from '../scene/InteractiveObject';
import { useGameStore } from '../../store/useGameStore';

export default function PatientExperience({ user, onLogout }) {
  const [data, setData] = useState(null);
  const [isRoomLoading, setIsRoomLoading] = useState(true);
  const roomToLoad = "living_room_01";
  
  const cameraControlRef = useRef();
  const selectedObject = useGameStore((state) => state.selectedObject);
  const clearSelectedObject = useGameStore((state) => state.clearSelectedObject);
  
  useEffect(() => {
    fetch(`http://localhost:3000/api/rooms/${roomToLoad}`)        
      .then(res => res.json())
      .then(json => {
        setData(json);
        setIsRoomLoading(false);
      })
      .catch(err => {
        console.error("Error fetching room:", err);
        setIsRoomLoading(false);
      });
  }, [roomToLoad]);

  useEffect(() => {
    if (cameraControlRef.current) {
      if (selectedObject) {
        const [x, y, z] = selectedObject.position;
        cameraControlRef.current.setLookAt(
          x, y + 0.5, z + 2.5, 
          x, y, z,          
          true              
        );
      } else {
        cameraControlRef.current.setLookAt(
          0, 0, 5,
          0, 0, 0,
          true
        );
      }
    }
  }, [selectedObject]);

  if (isRoomLoading || !data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#111', color: '#fff' }}>
        <h2>Cargando experiencia para {user?.name || 'Paciente'}...</h2>
        <p style={{ color: '#aaa', margin: '10px 0' }}>Preparando entorno virtual</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Botón temporal de Cerrar Sesión en la esquina */}
      <button 
        onClick={onLogout}
        style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1100, padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
      >
        Cerrar Sesión
      </button>

      {/* 1. CAPA DE FONDO HTML CON BLUR DINÁMICO */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(/src/assets/scene1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: selectedObject ? 'blur(8px)' : 'blur(0px)',
        transition: 'filter 0.6s ease-in-out',
        zIndex: 0
      }} />

      {/* 2. CAPA 3D */}
      <Canvas 
        camera={{ position: [0, 0, 5] }} 
        gl={{ alpha: true, antialias: true }} 
        style={{ position: 'absolute', zIndex: 1, pointerEvents: 'auto' }}
      > 
        <ambientLight intensity={0.7} /> 
        
        <CameraControls 
          ref={cameraControlRef} 
          minDistance={2}
          maxDistance={6}
        />

        <Suspense fallback={null}>
          <SceneBackground />
          {data.map(item => {
            const isSelected = selectedObject && selectedObject.id === item.id;

            if (selectedObject && !isSelected) {
              return null;
            }

            return (
              <InteractiveObject 
                key={item.id}
                modelPath={item.modelPath}
                position={item.position}
                scale={item.scale}
                rotation={item.rotation || [0, 0, 0]}
                id={item.id}
                message={() => {}}
              />
            );
          })}
        </Suspense>
      </Canvas>

      {/* 3. CAPA DE INTERFAZ Y BOTONES */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <ChatUI />
            
          {selectedObject && (
            <button
              onClick={clearSelectedObject}
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                padding: '10px 20px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                zIndex: 1000,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
              }}
            >
              Volver a la habitación
            </button>
          )}
        </div>
      </div>

    </div>
  );
}