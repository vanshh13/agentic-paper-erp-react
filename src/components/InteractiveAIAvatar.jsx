import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// Trading Chart Component - Continuous smooth flow underneath
const TradingChartFlow = () => {
  const chartRef = useRef(null)
  const chartDataRef = useRef([])
  const [chartData, setChartData] = useState([])
  const scrollOffsetRef = useRef(0)

  // Generate continuous trading chart data with upward trend
  useEffect(() => {
    // Initialize with upward trending data
    let basePrice = 60
    const initialData = Array.from({ length: 80 }, (_, i) => {
      // Create upward trend with some volatility
      const trend = i * 0.3 // Upward trend
      const volatility = (Math.sin(i * 0.2) + Math.cos(i * 0.15)) * 8
      const random = (Math.random() - 0.5) * 5
      const price = basePrice + trend + volatility + random
      basePrice = price
      return {
        x: i,
        y: Math.max(40, Math.min(160, price)),
        open: price - (Math.random() - 0.5) * 3,
        close: price + (Math.random() - 0.5) * 3,
        high: price + Math.abs(Math.random() * 4),
        low: price - Math.abs(Math.random() * 4),
        volume: Math.random() * 40 + 15
      }
    })
    chartDataRef.current = initialData
    setChartData(initialData)

    // Continuously update chart data (like live trading)
    const interval = setInterval(() => {
      // Update existing points with smooth movement
      chartDataRef.current = chartDataRef.current.map((point, index) => {
        // Smooth upward trend with volatility
        const trend = 0.15 // Continuous upward movement
        const volatility = (Math.sin(index * 0.1 + Date.now() * 0.001) + 
                          Math.cos(index * 0.08 + Date.now() * 0.0015)) * 2
        const random = (Math.random() - 0.48) * 3 // Slight upward bias
        const newY = Math.max(40, Math.min(160, point.y + trend + volatility + random))
        
        return {
          ...point,
          y: newY,
          open: newY - (Math.random() - 0.5) * 2.5,
          close: newY + (Math.random() - 0.5) * 2.5,
          high: newY + Math.abs(Math.random() * 3.5),
          low: newY - Math.abs(Math.random() * 3.5),
          volume: Math.random() * 35 + 18
        }
      })
      
      // Add new data point with upward trend
      const lastPoint = chartDataRef.current[chartDataRef.current.length - 1]
      const trend = 0.2
      const volatility = (Math.sin(Date.now() * 0.002) + Math.cos(Date.now() * 0.0015)) * 3
      const newY = Math.max(40, Math.min(160, lastPoint.y + trend + volatility + (Math.random() - 0.45) * 2))
      
      const newPoint = {
        x: lastPoint.x + 1,
        y: newY,
        open: newY - (Math.random() - 0.5) * 2.5,
        close: newY + (Math.random() - 0.5) * 2.5,
        high: newY + Math.abs(Math.random() * 3.5),
        low: newY - Math.abs(Math.random() * 3.5),
        volume: Math.random() * 35 + 18
      }
      
      chartDataRef.current = [...chartDataRef.current.slice(1), newPoint]
      setChartData([...chartDataRef.current])
    }, 80) // Update every 80ms for smooth flow

    return () => clearInterval(interval)
  }, [])

  useFrame(({ clock }) => {
    if (chartRef.current) {
      // Smooth continuous scroll
      scrollOffsetRef.current = clock.getElapsedTime() * 0.4
      chartRef.current.position.x = -scrollOffsetRef.current
    }
  })

  return (
    <group ref={chartRef} position={[0, -1.3, 0]}>
      {/* Chart background with gradient */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[5, 2]} />
        <meshBasicMaterial color={0x0a0e27} transparent opacity={0.4} />
      </mesh>

      {/* Grid lines - professional chart grid */}
      {[-1.0, -0.5, 0, 0.5, 1.0].map((y, i) => (
        <line key={`grid-${i}`} position={[0, y, -0.01]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([-2.5, y, -0.01, 2.5, y, -0.01])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={0x1a2a4a} transparent opacity={0.25} />
        </line>
      ))}

      {/* Main price line - smooth upward trending */}
      {chartData.length > 1 && (
        <line position={[0, 0, 0.01]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={chartData.length}
              array={new Float32Array(
                chartData.flatMap((point) => {
                  const x = (point.x - chartData[0].x) * 0.06 - 2.5 + (scrollOffsetRef.current % 0.06)
                  const y = (point.y - 100) * 0.012
                  return [x, y, 0.01]
                })
              )}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={0x00F5FF} linewidth={3} />
        </line>
      )}

      {/* Area fill under chart - profit visualization */}
      {chartData.length > 1 && (
        <mesh position={[0, 0, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={chartData.length * 2}
              array={new Float32Array(
                chartData.flatMap((point) => {
                  const x = (point.x - chartData[0].x) * 0.06 - 2.5 + (scrollOffsetRef.current % 0.06)
                  const y = (point.y - 100) * 0.012
                  const baseY = -0.5
                  return [
                    x, y, 0,
                    x, baseY, 0
                  ]
                })
              )}
              itemSize={3}
            />
            <bufferAttribute
              attach="index"
              count={(chartData.length - 1) * 6}
              array={new Uint16Array(
                Array.from({ length: chartData.length - 1 }, (_, i) => [
                  i * 2, i * 2 + 1, (i + 1) * 2,
                  i * 2 + 1, (i + 1) * 2 + 1, (i + 1) * 2
                ]).flat()
              )}
              itemSize={1}
            />
          </bufferGeometry>
          <meshBasicMaterial color={0x00F5FF} transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Candlesticks - proper OHLC visualization */}
      {chartData.map((point, i) => {
        if (i === 0) return null
        const isProfit = point.close > point.open
        const bodyHeight = Math.abs(point.close - point.open) * 0.012
        const wickTop = (point.high - Math.max(point.open, point.close)) * 0.012
        const wickBottom = (Math.min(point.open, point.close) - point.low) * 0.012
        const bodyY = ((point.open + point.close) / 2 - 100) * 0.012
        const x = (point.x - chartData[0].x) * 0.06 - 2.5 + (scrollOffsetRef.current % 0.06)
        
        return (
          <group key={`candle-${i}`} position={[x, bodyY, 0.02]}>
            {/* Candlestick body */}
            <mesh>
              <boxGeometry args={[0.05, Math.max(0.01, bodyHeight), 0.01]} />
              <meshBasicMaterial
                color={isProfit ? 0x00FF88 : 0xFF4444}
                transparent
                opacity={0.9}
              />
            </mesh>
            {/* Top wick */}
            {wickTop > 0 && (
              <mesh position={[0, bodyHeight / 2 + wickTop / 2, 0]}>
                <boxGeometry args={[0.01, wickTop, 0.01]} />
                <meshBasicMaterial
                  color={isProfit ? 0x00FF88 : 0xFF4444}
                  transparent
                  opacity={0.7}
                />
              </mesh>
            )}
            {/* Bottom wick */}
            {wickBottom > 0 && (
              <mesh position={[0, -bodyHeight / 2 - wickBottom / 2, 0]}>
                <boxGeometry args={[0.01, wickBottom, 0.01]} />
                <meshBasicMaterial
                  color={isProfit ? 0x00FF88 : 0xFF4444}
                  transparent
                  opacity={0.7}
                />
              </mesh>
            )}
          </group>
        )
      })}

      {/* Moving average line - smooth trend indicator */}
      {chartData.length > 10 && (
        <line position={[0, 0, 0.015]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={chartData.length - 9}
              array={new Float32Array(
                chartData.slice(9).flatMap((point, i) => {
                  const avg = chartData.slice(i, i + 10).reduce((sum, p) => sum + p.y, 0) / 10
                  const x = (point.x - chartData[0].x) * 0.06 - 2.5 + (scrollOffsetRef.current % 0.06)
                  return [x, (avg - 100) * 0.012, 0.015]
                })
              )}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={0xFFD700} linewidth={2} transparent opacity={0.8} />
        </line>
      )}

      {/* Volume bars - trading volume visualization */}
      {chartData.map((point, i) => {
        if (i === 0) return null
        const x = (point.x - chartData[0].x) * 0.06 - 2.5 + (scrollOffsetRef.current % 0.06)
        const volumeHeight = point.volume * 0.008
        const isProfit = point.close > point.open
        
        return (
          <mesh
            key={`volume-${i}`}
            position={[x, -0.75, 0.01]}
          >
            <boxGeometry args={[0.04, volumeHeight, 0.005]} />
            <meshBasicMaterial
              color={isProfit ? 0x00FF88 : 0xFF4444}
              transparent
              opacity={0.5}
            />
          </mesh>
        )
      })}

      {/* Profit indicator text area (visual only) */}
      <mesh position={[1.8, 0.8, 0.03]}>
        <planeGeometry args={[0.6, 0.15]} />
        <meshBasicMaterial color={0x00FF88} transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

const ParticleSystem = ({ isListening, isThinking, isTalking }) => {
  const meshRef = useRef(null)
  const materialRef = useRef(null)
  const groupRef = useRef(null)
  const meshRef2 = useRef(null)
  const materialRef2 = useRef(null)
  const meshRef3 = useRef(null)
  const materialRef3 = useRef(null)
  const chartLineRef = useRef(null)
  const chartLineRef2 = useRef(null)
  const candlestickRef = useRef(null)

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time
    }
    if (materialRef2.current) {
      materialRef2.current.uniforms.uTime.value = time
    }
    if (materialRef3.current) {
      materialRef3.current.uniforms.uTime.value = time
    }
    
    // Trading chart rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.1
      groupRef.current.rotation.x = Math.sin(time * 0.08) * 0.05
    }
    
    // Animate chart lines
    if (chartLineRef.current) {
      chartLineRef.current.rotation.z = time * 0.15
    }
    if (chartLineRef2.current) {
      chartLineRef2.current.rotation.z = -time * 0.12
    }
    if (candlestickRef.current) {
      candlestickRef.current.rotation.y = time * 0.2
    }
  })

  // Trading chart-inspired shader
  const vertexShader = `
    uniform float uTime;
    uniform float uListeningIntensity;
    uniform float uThinkingIntensity;
    uniform float uTalkingIntensity;
    uniform float uLayerOffset;

    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying float vDistance;
    varying float vIntensity;
    varying float vChartPattern;

    // Advanced noise
    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 permute(vec4 x) {
      return mod289(((x*34.0)+1.0)*x);
    }

    vec4 taylorInvSqrt(vec4 r) {
      return 1.79284291400159 - 0.85373472095314 * r;
    }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);

      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);

      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;

      i = mod289(i);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));

      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);

      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    // Trading chart wave pattern
    float tradingChartWave(vec3 pos, float time) {
      float bullish = sin(time * 0.4 + pos.x * 4.0) * 0.5 + 0.5;
      float volatility = abs(sin(time * 0.8 + pos.y * 5.0)) * 0.3;
      float support = step(0.3, sin(time * 0.3 + pos.z * 3.0));
      return bullish * (1.0 + volatility) * support;
    }

    float candlestickPattern(vec3 pos, float time) {
      float body = abs(sin(time * 0.5 + pos.x * 6.0));
      float wick = abs(cos(time * 0.7 + pos.y * 4.0)) * 0.3;
      return body + wick;
    }

    void main() {
      vUv = uv;
      vNormal = normal;
      vDistance = length(position);

      vec3 pos = position;
      
      float timeOffset = uTime * (0.5 + uLayerOffset * 0.4);
      
      float chartPattern = tradingChartWave(pos, timeOffset);
      float candlePattern = candlestickPattern(pos, timeOffset);
      vChartPattern = chartPattern;
      
      float flow1 = snoise(pos * 0.4 + vec3(timeOffset * 0.5, timeOffset * 0.4, timeOffset * 0.6)) * 0.25;
      float flow2 = snoise(pos * 1.0 + vec3(timeOffset * 0.7, timeOffset * 0.6, timeOffset * 0.8)) * 0.12;
      float flow3 = snoise(pos * 2.0 + vec3(timeOffset * 1.0, timeOffset * 0.9, timeOffset * 1.1)) * 0.06;
      
      float totalFlow = flow1 + flow2 + flow3;
      
      float stateIntensity = uListeningIntensity * 0.7 + uThinkingIntensity * 0.9 + uTalkingIntensity * 1.1;
      
      float marketPulse = 1.0 + sin(uTime * 0.6) * (0.1 + stateIntensity * 0.06);
      
      float chartDeformation = chartPattern * 0.15 + candlePattern * 0.1 + totalFlow * (1.0 + stateIntensity * 1.2);
      pos = position * marketPulse + normal * chartDeformation;
      
      float spiralSpeed = 0.2 * (1.0 + stateIntensity * 0.6);
      float angle = atan(pos.y, pos.x) + uTime * spiralSpeed;
      float radius = length(pos.xy);
      pos.xy = vec2(cos(angle), sin(angle)) * radius;
      
      pos.z += sin(uTime * 0.7 + pos.x * 5.0) * 0.05 * (1.0 + stateIntensity * 0.8);
      pos.x += cos(uTime * 0.5 + pos.y * 4.5) * 0.04;
      pos.y += sin(uTime * 0.6 + pos.z * 4.8) * 0.04;

      vPosition = pos;
      vIntensity = stateIntensity;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      
      float baseSize = 4.5 + uLayerOffset * 1.0;
      float volumeWave = sin(uTime * 2.5 + vDistance * 3.5) * 0.5 + 0.5;
      float chartSize = chartPattern * 0.4;
      gl_PointSize = baseSize + volumeWave * 1.2 + stateIntensity * 1.8 + chartSize;
    }
  `

  const fragmentShader = `
    uniform float uTime;
    uniform float uListeningIntensity;
    uniform float uThinkingIntensity;
    uniform float uTalkingIntensity;

    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying float vDistance;
    varying float vIntensity;
    varying float vChartPattern;

    void main() {
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      
      float alpha = 1.0 - smoothstep(0.1, 0.5, dist);
      float innerGlow = 1.0 - smoothstep(0.0, 0.12, dist);
      float outerGlow = 1.0 - smoothstep(0.35, 0.7, dist);
      
      float candleBody = step(dist, 0.2);
      float candleWick = step(abs(center.x), 0.05) * step(dist, 0.45);
      float chartAlpha = max(alpha, max(candleBody, candleWick * 0.6));
      
      float colorWave1 = sin(uTime * 0.9 + vPosition.x * 4.0 + vPosition.y * 3.5) * 0.5 + 0.5;
      float colorWave2 = cos(uTime * 1.1 + vPosition.z * 4.5 + vPosition.y * 3.0) * 0.5 + 0.5;
      float colorWave3 = sin(uTime * 1.3 + vDistance * 5.5) * 0.5 + 0.5;
      
      vec3 bullishGreen = vec3(0.0, 0.85, 0.6);
      vec3 bearishRed = vec3(0.95, 0.25, 0.3);
      vec3 professionalBlue = vec3(0.2, 0.5, 0.95);
      vec3 premiumGold = vec3(1.0, 0.8, 0.35);
      vec3 chartLine = vec3(0.0, 0.95, 1.0);
      vec3 deepIndigo = vec3(0.3, 0.4, 0.8);
      
      vec3 baseColor;
      if (vChartPattern > 0.5) {
        baseColor = mix(professionalBlue, bullishGreen, vChartPattern);
      } else {
        baseColor = mix(deepIndigo, professionalBlue, 1.0 - vChartPattern);
      }
      
      baseColor = mix(baseColor, chartLine, colorWave1 * 0.3);
      
      vec3 listeningColor = vec3(0.25, 0.6, 0.98);
      vec3 thinkingColor = vec3(1.0, 0.85, 0.4);
      vec3 talkingColor = vec3(0.0, 0.9, 0.7);
      
      vec3 finalColor = baseColor;
      finalColor = mix(finalColor, listeningColor, uListeningIntensity * 0.8);
      finalColor = mix(finalColor, thinkingColor, uThinkingIntensity * 0.9);
      finalColor = mix(finalColor, talkingColor, uTalkingIntensity * 1.0);
      
      float depthGradient = 1.0 - smoothstep(0.15, 0.85, vDistance);
      finalColor *= (1.0 + depthGradient * 0.8);
      
      float marketPulse1 = sin(uTime * 2.2 + vPosition.x * 5.0 + vPosition.y * 4.0) * 0.5 + 0.5;
      float marketPulse2 = cos(uTime * 2.8 + vPosition.z * 5.5) * 0.4 + 0.6;
      float combinedPulse = marketPulse1 * marketPulse2;
      
      finalColor = mix(finalColor, vec3(1.0, 1.0, 1.0), combinedPulse * innerGlow * 0.45);
      finalColor += chartLine * outerGlow * 0.7;
      
      if (candleBody > 0.5) {
        finalColor = mix(finalColor, bullishGreen, 0.3);
      }
      if (candleWick > 0.5) {
        finalColor = mix(finalColor, premiumGold, 0.2);
      }
      
      float stateBoost = uListeningIntensity * 0.4 + uThinkingIntensity * 0.5 + uTalkingIntensity * 0.6;
      finalColor += vec3(stateBoost * 0.7);
      finalColor *= (1.0 + stateBoost * 0.35);
      
      finalColor += bullishGreen * vChartPattern * 0.3 * innerGlow;
      finalColor += premiumGold * (1.0 - vChartPattern) * 0.2 * innerGlow;
      
      float finalAlpha = chartAlpha * (0.95 + innerGlow * 0.45);
      finalAlpha += outerGlow * 0.3;
      finalAlpha += stateBoost * 0.4;
      finalAlpha = clamp(finalAlpha, 0.0, 1.0);

      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  `

  return (
    <group ref={groupRef}>
      {/* Trading chart lines */}
      <mesh ref={chartLineRef}>
        <torusGeometry args={[0.92, 0.008, 4, 64]} />
        <meshBasicMaterial color={0x00F5FF} transparent opacity={0.5} />
      </mesh>
      
      <mesh ref={chartLineRef2}>
        <torusGeometry args={[0.88, 0.006, 4, 64]} />
        <meshBasicMaterial color={0x00CED1} transparent opacity={0.4} />
      </mesh>
      
      {/* Candlestick structures */}
      <group ref={candlestickRef}>
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(angle) * 0.85, Math.sin(angle) * 0.85, 0]}>
              <boxGeometry args={[0.02, 0.15, 0.02]} />
              <meshBasicMaterial color={0x00FF88} transparent opacity={0.6} />
            </mesh>
          )
        })}
      </group>
      
      {/* Outer layer */}
      <points ref={meshRef3}>
        <icosahedronGeometry args={[1.05, 2]} />
        <shaderMaterial
          ref={materialRef3}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uListeningIntensity: { value: isListening ? 0.6 : 0.0 },
            uThinkingIntensity: { value: isThinking ? 0.6 : 0.0 },
            uTalkingIntensity: { value: isTalking ? 0.6 : 0.0 },
            uLayerOffset: { value: 0.6 },
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.6}
        />
      </points>
      
      {/* Middle layer */}
      <points ref={meshRef2}>
        <octahedronGeometry args={[0.90, 3]} />
        <shaderMaterial
          ref={materialRef2}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uListeningIntensity: { value: isListening ? 0.8 : 0.0 },
            uThinkingIntensity: { value: isThinking ? 0.8 : 0.0 },
            uTalkingIntensity: { value: isTalking ? 0.8 : 0.0 },
            uLayerOffset: { value: 0.4 },
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.75}
        />
      </points>
      
      {/* Inner layer */}
      <points ref={meshRef}>
        <dodecahedronGeometry args={[0.78, 2]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uListeningIntensity: { value: isListening ? 1.0 : 0.0 },
            uThinkingIntensity: { value: isThinking ? 1.0 : 0.0 },
            uTalkingIntensity: { value: isTalking ? 1.0 : 0.0 },
            uLayerOffset: { value: 0.0 },
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Trading Chart Flow - Continuous underneath */}
      <TradingChartFlow />
    </group>
  )
}

const SafeOrbitControls = () => {
  const { gl } = useThree()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (gl && gl.domElement) {
      let retryCount = 0
      const maxRetries = 20

      const checkReady = () => {
        if (
          gl.domElement &&
          gl.domElement.parentElement &&
          document.contains(gl.domElement)
        ) {
          setIsReady(true)
        } else if (retryCount < maxRetries) {
          retryCount++
          setTimeout(checkReady, 50)
        }
      }

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
  const [isListening, setIsListening] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [isTalking, setIsTalking] = useState(false)
  const [greeting, setGreeting] = useState('')

  // Get time-based greeting
  const getGreeting = () => {
    const now = new Date()
    const hours = now.getHours()
    
    if (hours >= 0 && hours < 12) {
      return 'Good Morning'
    } else if (hours >= 12 && hours < 17) {
      return 'Good Afternoon'
    } else {
      return 'Good Evening'
    }
  }

  useEffect(() => {
    setGreeting(getGreeting())
    
    // Update greeting every minute
    const greetingInterval = setInterval(() => {
      setGreeting(getGreeting())
    }, 60000)

    const interval = setInterval(() => {
      const rand = Math.random()
      if (rand > 0.72) {
        setIsListening(true)
        setTimeout(() => setIsListening(false), 2200)
      } else if (rand > 0.45) {
        setIsThinking(true)
        setTimeout(() => setIsThinking(false), 1700)
      } else if (rand > 0.12) {
        setIsTalking(true)
        setTimeout(() => setIsTalking(false), 2000)
      }
    }, 3500)

    return () => {
      clearInterval(interval)
      clearInterval(greetingInterval)
    }
  }, [])

  return (
    <div className="w-full flex flex-col items-center justify-center py-3 gap-3">
      <div className="relative w-40 h-40 rounded-full overflow-visible">
        {/* Trading chart glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/35 via-cyan-500/30 to-emerald-500/35 blur-2xl animate-pulse"></div>
        
        {/* Main container */}
        <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-[oklch(0.05_0.07_240)] via-[oklch(0.07_0.06_200)] to-[oklch(0.09_0.08_180)] shadow-2xl shadow-blue-500/35 backdrop-blur-sm border border-cyan-500/20">
          <Canvas 
            camera={{ position: [0, 0, 3.2], fov: 55 }}
            gl={{ 
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
              failIfMajorPerformanceCaveat: false,
              premultipliedAlpha: false
            }}
            style={{ width: '100%', height: '100%' }}
          >
            <ambientLight intensity={0.9} />
            <pointLight position={[2, 2, 2]} intensity={0.8} color="#1E90FF" />
            <pointLight position={[-2, -2, -2]} intensity={0.7} color="#00CED1" />
            <pointLight position={[0, 2.5, 0]} intensity={0.6} color="#FFFFFF" />
            <pointLight position={[2, -1, 1]} intensity={0.5} color="#00BFFF" />
            <pointLight position={[-1, 2, -1]} intensity={0.45} color="#00FA9A" />
            <pointLight position={[0, -2, 0]} intensity={0.4} color="#FFD700" />
            <ParticleSystem
              isListening={isListening}
              isThinking={isThinking}
              isTalking={isTalking}
            />
            <SafeOrbitControls />
          </Canvas>
        </div>
      </div>
      
      {/* AI Agent Text */}
      <div className="text-center px-2">
        <p className="text-sm font-medium text-[oklch(0.85_0_0)] tracking-wide">
          Hey {greeting},
        </p>
        <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 tracking-wide mt-0.5">
          I am Your AI Assistant
        </p>
      </div>
    </div>
  )
}

export default InteractiveAIAvatar
