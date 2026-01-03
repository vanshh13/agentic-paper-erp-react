import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

const ParticleSystem = ({ isListening, isThinking, isTalking }) => {
  const meshRef = useRef(null)
  const materialRef = useRef(null)

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  const vertexShader = `
    uniform float uTime;
    uniform float uListeningIntensity;
    uniform float uThinkingIntensity;
    uniform float uTalkingIntensity;

    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      
      // Noise-based motion
      float noiseEffect = sin(uTime * 0.5 + position.y * 2.0) * 0.03;
      
      // Subtle wave motion
      float motionEffect = sin(uTime * 0.3 + position.x * 2.0) * 0.02;
      
      // Softened pulsation effect
      float pulsation = 1.0 + sin(uTime * 0.2) * 0.01;

      // Adjust movement
      vec3 pos = position * pulsation;
      pos += normal * noiseEffect;
      pos += normal * motionEffect;

      vPosition = pos;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = 2.0 + uListeningIntensity * 0.3 + uThinkingIntensity * 0.5 + uTalkingIntensity * 0.7;
    }
  `

  const fragmentShader = `
    uniform float uTime;
    uniform float uListeningIntensity;
    uniform float uThinkingIntensity;
    uniform float uTalkingIntensity;

    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      float distanceToCenter = length(gl_PointCoord - 0.5);
      float alpha = 1.0 - smoothstep(0.45, 0.5, distanceToCenter);
      
      // Softer energy glow
      float energy = sin(uTime * 0.3 + vPosition.x * 2.0) * 0.2 + 0.8;
      
      vec3 baseColor = vec3(0.0078, 0.9569, 0.9608); // #02F4F5
      vec3 listeningColor = vec3(0.0, 0.8, 0.8); // Darker cyan
      vec3 thinkingColor = vec3(0.9569, 0.7843, 0.0078); // Complementary yellow
      vec3 talkingColor = vec3(0.0, 1.0, 0.5); // Cyan-green
      
      vec3 finalColor = mix(baseColor, listeningColor, uListeningIntensity);
      finalColor = mix(finalColor, thinkingColor, uThinkingIntensity);
      finalColor = mix(finalColor, talkingColor, uTalkingIntensity);
      finalColor = mix(finalColor, vec3(1.0), energy * 0.3);

      gl_FragColor = vec4(finalColor, alpha * (0.8 + uListeningIntensity * 0.1 + uThinkingIntensity * 0.2 + uTalkingIntensity * 0.2));
    }
  `

  return (
    <points ref={meshRef}>
      <sphereGeometry args={[1, 20, 10]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uListeningIntensity: { value: isListening ? 0.8 : 0.0 },
          uThinkingIntensity: { value: isThinking ? 0.8 : 0.0 },
          uTalkingIntensity: { value: isTalking ? 0.8 : 0.0 },
        }}
        transparent
        depthWrite={false}
      />
    </points>
  )
}

// Safe OrbitControls wrapper that ensures DOM is ready
const SafeOrbitControls = () => {
  const { gl } = useThree()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Ensure the WebGL context and DOM element are ready
    if (gl && gl.domElement) {
      let retryCount = 0
      const maxRetries = 20 // Maximum 1 second of retries (20 * 50ms)

      // Double-check that the DOM element is actually in the document
      const checkReady = () => {
        if (
          gl.domElement &&
          gl.domElement.parentElement &&
          document.contains(gl.domElement)
        ) {
          setIsReady(true)
        } else if (retryCount < maxRetries) {
          retryCount++
          // Retry after a short delay for low-end devices
          setTimeout(checkReady, 50)
        }
      }

      // Use requestAnimationFrame to ensure DOM is fully ready
      const timer = requestAnimationFrame(() => {
        checkReady()
      })
      return () => cancelAnimationFrame(timer)
    }
  }, [gl])

  if (!isReady) {
    return null
  }

  try {
    return <OrbitControls enableZoom={false} enableRotate={false} />
  } catch (error) {
    console.warn('OrbitControls initialization error:', error)
    return null
  }
}

const InteractiveAIAvatar = () => {
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [isTalking, setIsTalking] = useState(false)
  const [response, setResponse] = useState('')
  const [displayedResponse, setDisplayedResponse] = useState('')

  const handleInputChange = (e) => {
    setInput(e.target.value)
    setIsListening(true)
  }

  const handleInputBlur = () => {
    setIsListening(false)
  }

  useEffect(() => {
    if (response) {
      let i = 0
      const intervalId = setInterval(() => {
        setDisplayedResponse(response.slice(0, i))
        i++
        if (i > response.length) {
          clearInterval(intervalId)
          setIsTalking(false)
        }
      }, 50) // Typing effect speed

      return () => clearInterval(intervalId)
    }
  }, [response])

  return (
    <div className="w-full h-48 relative">
      <Canvas 
        camera={{ position: [0, 0, 2] }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false
        }}
      >
        <ambientLight args={[0x404040, 0.5]} />
        <ParticleSystem
          isListening={isListening}
          isThinking={isThinking}
          isTalking={isTalking}
        />
        <SafeOrbitControls />
      </Canvas>
    </div>
  )
}

export default InteractiveAIAvatar

