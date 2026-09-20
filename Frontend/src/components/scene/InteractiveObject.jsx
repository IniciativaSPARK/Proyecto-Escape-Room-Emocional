import { useState, useMemo, useRef } from 'react';
import { useGLTF, useCursor } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../store/useGameStore';
import * as THREE from 'three';

export function InteractiveObject({ modelPath, position, scale, message, id, rotation = [0, 0, 0] }) {
    const setSelectedObject = useGameStore((state) => state.setSelectedObject);
    const selectedObject = useGameStore((state) => state.selectedObject);
    
    const [hovered, setHover] = useState(false);    
    useCursor(hovered);

    const { scene } = useGLTF(modelPath);
    const clonedScene = useMemo(() => scene.clone(), [scene]);
    const groupRef = useRef();

    // Verificamos si este objeto específico es el que está seleccionado
    const isSelected = selectedObject && selectedObject.id === id;

    // Efecto de interpolación para la opacidad (materialización progresiva)
    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.traverse((child) => {
                if (child.isMesh && child.material) {
                    // Aseguramos que el material soporte transparencia
                    child.material.transparent = true;
                    
                    // Si está seleccionado, subimos la opacidad a 1. Si no, la bajamos a 0 (o dejamos un pequeño rastro, ej. 0.1)
                    // Puedes ajustar la velocidad multiplicando delta por el factor (ej. 4.0)
                    const targetOpacity = isSelected ? 1.0 : 0.0; 
                    child.material.opacity = THREE.MathUtils.lerp(
                        child.material.opacity, 
                        targetOpacity, 
                        delta * 4.0
                    );
                }
            });
        }
    });

    return (
        <group 
            ref={groupRef}
            position={position} 
            scale={scale} 
            rotation={rotation}
        >
            <primitive 
                object={clonedScene}
                onClick={(e) =>{
                    e.stopPropagation();
                    message();
                    setSelectedObject({ id, position });
                }}
                onPointerOver={(e) => { 
                    e.stopPropagation();
                    setHover(true);
                }}
                onPointerOut={() => setHover(false)}
            />
        </group>
    );
}
{/*        

    useCursor(hovered);

    const { scene } = useGLTF(modelPath);
    position={[-1.05, -1.3, 1.2]}
            rotation={[0, -1.5, 0]}
            scale={[0.8, 0.9, 0.7]} */}