import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Create a custom geometry with particles positioned in a sphere
const createParticleGeometry = (count = 150, radius = 1) => {
  const positions = new Float32Array(count * 3);
  const originalPositions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    // Create a Fibonacci sphere distribution for more even spread
    const phi = Math.acos(1 - 2 * (i + 0.5) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    
    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);
    
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    
    originalPositions[i * 3] = x;
    originalPositions[i * 3 + 1] = y;
    originalPositions[i * 3 + 2] = z;
  }
  
  return { positions, originalPositions };
};

const ParticleSystem = ({ isListening, isThinking, isTalking }) => {
  const pointsRef = useRef();
  const linesRef = useRef();
  const materialRef = useRef();
  const lineMaterialRef = useRef();
  
  const particleCount = 150;
  const maxConnections = 6; // Maximum connections per particle
  const connectionDistance = 0.6; // Distance threshold for connections
  
  // Create initial geometry
  const { positions, originalPositions } = useMemo(
    () => createParticleGeometry(particleCount, 1),
    []
  );

  const [particles] = useState(() => {
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        position: new THREE.Vector3(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2]
        ),
        originalPosition: new THREE.Vector3(
          originalPositions[i * 3],
          originalPositions[i * 3 + 1],
          originalPositions[i * 3 + 2]
        ),
        velocity: new THREE.Vector3(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.4,
        connections: []
      });
    }
    return particles;
  });

  // Line geometry for connections
  const lineGeometry = useMemo(() => new THREE.BufferGeometry(), []);
  const linePositions = useMemo(() => new Float32Array(particleCount * maxConnections * 6), []); // 2 points per line, 3 coords per point

  useFrame(({ clock }) => {
    if (!pointsRef.current || !linesRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Calculate intensity for motion
    const intensity = (isListening ? 0.3 : 0) + (isThinking ? 0.2 : 0) + (isTalking ? 0.5 : 0);
    
    // Update particle positions with orbital motion
    particles.forEach((particle, i) => {
      // Orbital motion around original position
      const orbitalRadius = 0.1 + intensity * 0.15;
      const orbitalSpeed = particle.speed * (0.8 + intensity * 0.4);
      
      const x = Math.cos(time * orbitalSpeed + particle.phase) * orbitalRadius;
      const y = Math.sin(time * orbitalSpeed * 1.1 + particle.phase) * orbitalRadius;
      const z = Math.sin(time * orbitalSpeed * 0.9 + particle.phase) * orbitalRadius * 0.7;
      
      // Smooth movement to target position
      const targetX = particle.originalPosition.x + x;
      const targetY = particle.originalPosition.y + y;
      const targetZ = particle.originalPosition.z + z;
      
      particle.position.x += (targetX - particle.position.x) * 0.1;
      particle.position.y += (targetY - particle.position.y) * 0.1;
      particle.position.z += (targetZ - particle.position.z) * 0.1;
      
      // Add some noise for organic movement
      particle.position.x += Math.sin(time * 2 + i) * 0.01 * intensity;
      particle.position.y += Math.cos(time * 2.3 + i) * 0.01 * intensity;
      particle.position.z += Math.sin(time * 1.7 + i) * 0.01 * intensity;
      
      // Update points geometry
      const pointsPositions = pointsRef.current.geometry.attributes.position.array;
      pointsPositions[i * 3] = particle.position.x;
      pointsPositions[i * 3 + 1] = particle.position.y;
      pointsPositions[i * 3 + 2] = particle.position.z;
    });
    
    // Update points position attribute
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Update connections (lines) between nearby particles
    let lineIndex = 0;
    particles.forEach((particle, i) => {
      particle.connections = [];
      
      // Check for nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        if (particle.connections.length >= maxConnections) break;
        
        const otherParticle = particles[j];
        const distance = particle.position.distanceTo(otherParticle.position);
        
        if (distance < connectionDistance + intensity * 0.3) {
          particle.connections.push(j);
          
          // Add line segment
          if (lineIndex < particleCount * maxConnections * 6 - 6) {
            linePositions[lineIndex++] = particle.position.x;
            linePositions[lineIndex++] = particle.position.y;
            linePositions[lineIndex++] = particle.position.z;
            linePositions[lineIndex++] = otherParticle.position.x;
            linePositions[lineIndex++] = otherParticle.position.y;
            linePositions[lineIndex++] = otherParticle.position.z;
          }
        }
      }
    });
    
    // Update line geometry
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions.slice(0, lineIndex), 3));
    lineGeometry.setDrawRange(0, lineIndex / 3);
    
    // Update shader uniforms
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      materialRef.current.uniforms.uListeningIntensity.value = isListening ? 0.8 : 0.0;
      materialRef.current.uniforms.uThinkingIntensity.value = isThinking ? 0.8 : 0.0;
      materialRef.current.uniforms.uTalkingIntensity.value = isTalking ? 0.8 : 0.0;
    }
    
    if (lineMaterialRef.current) {
      lineMaterialRef.current.uniforms.uTime.value = time;
      lineMaterialRef.current.uniforms.uIntensity.value = intensity;
    }
  });

  const pointVertexShader = `
    uniform float uTime;
    uniform float uListeningIntensity;
    uniform float uThinkingIntensity;
    uniform float uTalkingIntensity;

    varying vec3 vPosition;

    void main() {
      vPosition = position;
      
      // Calculate total intensity
      float intensity = uListeningIntensity + uThinkingIntensity + uTalkingIntensity;
      
      // Add pulsing effect based on state
      float pulse = 1.0 + sin(uTime * 3.0 + position.x * 2.0) * 0.15 * intensity;
      
      vec3 pos = position * pulse;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = 4.0 + intensity * 3.0;
    }
  `;

  const pointFragmentShader = `
    uniform float uTime;
    uniform float uListeningIntensity;
    uniform float uThinkingIntensity;
    uniform float uTalkingIntensity;

    varying vec3 vPosition;

    void main() {
      float distanceToCenter = length(gl_PointCoord - 0.5);
      float alpha = 1.0 - smoothstep(0.3, 0.5, distanceToCenter);
      
      // Energy glow based on state
      float energy = sin(uTime * 2.5 + vPosition.x * 4.0) * 0.25 + 0.75;
      
      vec3 baseColor = vec3(0.0078, 0.9569, 0.9608);
      vec3 listeningColor = vec3(0.0, 0.8, 0.8);
      vec3 thinkingColor = vec3(0.9569, 0.7843, 0.0078);
      vec3 talkingColor = vec3(0.0, 1.0, 0.5);
      
      vec3 finalColor = mix(baseColor, listeningColor, uListeningIntensity);
      finalColor = mix(finalColor, thinkingColor, uThinkingIntensity);
      finalColor = mix(finalColor, talkingColor, uTalkingIntensity);
      
      // Add glow effect
      finalColor = mix(finalColor, vec3(1.0), energy * 0.6);
      
      // Alpha based on distance to center and state
      float stateAlpha = 0.9 + (uListeningIntensity + uThinkingIntensity + uTalkingIntensity) * 0.2;
      
      gl_FragColor = vec4(finalColor, alpha * stateAlpha);
    }
  `;

  const lineVertexShader = `
    uniform float uTime;
    uniform float uIntensity;
    
    varying float vDistance;
    varying vec3 vPosition;

    void main() {
      vPosition = position;
      
      // Calculate distance from center for fading effect
      vDistance = length(position);
      
      // Add subtle movement to lines
      float wave = sin(uTime * 1.5 + position.x * 2.0 + position.y * 2.0) * 0.02 * uIntensity;
      vec3 pos = position + normal * wave;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const lineFragmentShader = `
    uniform float uTime;
    uniform float uIntensity;
    
    varying float vDistance;
    varying vec3 vPosition;

    void main() {
      // Fade lines based on distance from center
      float distanceFade = 1.0 - smoothstep(0.5, 1.5, vDistance);
      
      // Pulsing opacity
      float pulse = 0.6 + sin(uTime * 2.0 + vPosition.x * 3.0) * 0.2 * uIntensity;
      
      // Line color with intensity-based variation
      vec3 lineColor = vec3(0.0078, 0.9569, 0.9608);
      lineColor = mix(lineColor, vec3(0.0, 1.0, 0.5), uIntensity * 0.5);
      
      // Fade at line ends
      float alpha = distanceFade * pulse * (0.3 + uIntensity * 0.4);
      
      gl_FragColor = vec4(lineColor, alpha);
    }
  `;

  // Initialize line geometry
  useEffect(() => {
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  }, [lineGeometry, linePositions]);

  return (
    <>
      {/* Points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length}
            array={new Float32Array(particles.flatMap(p => [p.position.x, p.position.y, p.position.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={pointVertexShader}
          fragmentShader={pointFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uListeningIntensity: { value: 0 },
            uThinkingIntensity: { value: 0 },
            uTalkingIntensity: { value: 0 },
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Connecting lines */}
      <lineSegments ref={linesRef}>
        <primitive object={lineGeometry} />
        <shaderMaterial
          ref={lineMaterialRef}
          vertexShader={lineVertexShader}
          fragmentShader={lineFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uIntensity: { value: 0 },
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          linewidth={1}
        />
      </lineSegments>
    </>
  );
};

const InteractiveAIAvatarLogo = () => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [response, setResponse] = useState('');
  const [displayedResponse, setDisplayedResponse] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setIsListening(true);
  };

  const handleInputBlur = () => {
    setIsListening(false);
  };

  useEffect(() => {
    if (response) {
      let i = 0;
      const intervalId = setInterval(() => {
        setDisplayedResponse(response.slice(0, i));
        i++;
        if (i > response.length) {
          clearInterval(intervalId);
          setIsTalking(false);
        }
      }, 50);

      return () => clearInterval(intervalId);
    }
  }, [response]);

  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden'
    }}>
      <div style={{ 
        width: '500px', 
        height: '500px',
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 0 40px rgba(2, 244, 245, 0.4)',
        border: '2px solid rgba(2, 244, 245, 0.3)'
      }}>
        <Canvas camera={{ position: [0, 0, 3.5], fov: 60 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[3, 3, 3]} intensity={0.8} color="#02F4F5" />
          <pointLight position={[-3, -2, -2]} intensity={0.5} color="#00ff80" />
          
          <ParticleSystem
            isListening={isListening}
            isThinking={isThinking}
            isTalking={isTalking}
          />
          
          <OrbitControls 
            enableZoom={true}
            enableRotate={true}
            zoomSpeed={0.6}
            rotateSpeed={0.5}
            minDistance={2}
            maxDistance={6}
            enableDamping
            dampingFactor={0.05}
            autoRotate={!isTalking}
            autoRotateSpeed={0.5}
          />
        </Canvas>
        
        {/* Title */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '10px 20px',
          borderRadius: '8px',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(2, 244, 245, 0.3)',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '18px',
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #02F4F5, #00ff80)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
          </h3>
        </div>
        
        {/* Status indicators */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '15px',
          borderRadius: '8px',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(2, 244, 245, 0.3)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            opacity: isListening ? 1 : 0.4,
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: isListening ? 
                'radial-gradient(circle at 30% 30%, #00ffff, #008888)' : 
                '#008888',
              boxShadow: isListening ? '0 0 15px #00cccc' : 'none',
              animation: isListening ? 'pulse 1.5s infinite' : 'none'
            }} />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Listening</span>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            opacity: isThinking ? 1 : 0.4,
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: isThinking ? 
                'radial-gradient(circle at 30% 30%, #f4c807, #a88600)' : 
                '#a88600',
              boxShadow: isThinking ? '0 0 15px #f4c807' : 'none',
              animation: isThinking ? 'pulse 1.5s infinite' : 'none'
            }} />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Thinking</span>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            opacity: isTalking ? 1 : 0.4,
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: isTalking ? 
                'radial-gradient(circle at 30% 30%, #00ff80, #008040)' : 
                '#008040',
              boxShadow: isTalking ? '0 0 15px #00ff80' : 'none',
              animation: isTalking ? 'pulse 1s infinite' : 'none'
            }} />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Talking</span>
          </div>
        </div>
        
        <style>
          {`
            @keyframes pulse {
              0%, 100% { 
                opacity: 1;
                transform: scale(1);
              }
              50% { 
                opacity: 0.7;
                transform: scale(1.1);
              }
            }
          `}
        </style>
      </div>

      <div style={{ 
        marginTop: '30px', 
        width: '500px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {displayedResponse && (
          <div style={{
            padding: '20px',
            backgroundColor: 'rgba(2, 244, 245, 0.08)',
            border: '2px solid rgba(2, 244, 245, 0.3)',
            borderRadius: '10px',
            minHeight: '100px',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 0 25px rgba(2, 244, 245, 0.3)',
            transition: 'all 0.3s ease',
            animation: 'fadeIn 0.5s ease'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              marginBottom: '10px'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, #02F4F5, #008888)',
                flexShrink: 0
              }} />
              <span style={{ 
                fontSize: '14px', 
                fontWeight: 'bold',
                color: '#02F4F5'
              }}>
                AI Response:
              </span>
            </div>
            <p style={{ 
              margin: 0, 
              lineHeight: '1.7',
              fontSize: '16px',
              fontWeight: '400'
            }}>
              {displayedResponse}
              {(isTalking || response.length > displayedResponse.length) && (
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '22px',
                  backgroundColor: '#02F4F5',
                  marginLeft: '6px',
                  animation: 'blink 1s infinite',
                  boxShadow: '0 0 10px #02F4F5',
                  borderRadius: '1px'
                }} />
              )}
            </p>
            
            <style>
              {`
                @keyframes blink {
                  0%, 100% { 
                    opacity: 1;
                    transform: scaleY(1);
                  }
                  50% { 
                    opacity: 0.3;
                    transform: scaleY(0.7);
                  }
                }
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}
            </style>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveAIAvatarLogo;