import { useEffect, useRef } from "react"

// Réplica fiel do fundo WebGL2 do Hero real (extraído do bundle, chunk
// 04ceb0c3446ecdfc.js — funções minificadas ns/ni/nt/nr/na/nn e os 6
// shaders fill/vignette/sine/voronoi/bokeh/output). Não é uma imagem
// estática: é um pipeline de 6 passes rodando a cada frame, reagindo ao
// mouse (vignette/distorção seguem o ponteiro) e pausando a distorção
// durante o scroll.

const VERTEX_SRC = `#version 300 es
precision highp float;
in vec2 position;
out vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`

const FILL_SRC = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform vec3 uBgColor;
void main() {
  fragColor = vec4(uBgColor, 1.0);
}`

const VIGNETTE_SRC = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform vec2  uResolution;
uniform vec2  uPointer;
uniform vec3  uVignetteColor;
uniform vec3  uBgColor;
uniform float uRadius;
uniform float uFalloff;
uniform float uSkew;
uniform float uAngle;
#define TWO_PI 6.28318530718
mat2 rot(float a) { return mat2(cos(a),-sin(a),sin(a),cos(a)); }
void main() {
  vec2 uv = vUv;
  vec2 aspectRatio = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 skew = vec2(uSkew, 1.0 - uSkew);
  float halfRadius = uRadius * 0.5;
  float innerEdge = halfRadius - uFalloff * halfRadius * 0.5;
  float outerEdge = halfRadius + uFalloff * halfRadius * 0.5;
  vec2 scaledUV  = uv * aspectRatio * rot(uAngle * TWO_PI) * skew;
  vec2 scaledPos = uPointer * aspectRatio * rot(uAngle * TWO_PI) * skew;
  float radius = distance(scaledUV, scaledPos);
  float falloff = smoothstep(innerEdge, outerEdge, radius);
  fragColor = mix(vec4(uBgColor, 0.0), vec4(uVignetteColor, 1.0), falloff);
}`

const SINE_SRC = `#version 300 es
precision mediump float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D tInput;
uniform vec2  uResolution;
uniform float uTime;
uniform float uFrequency;
uniform float uAmplitude;
uniform float uRotation;
uniform float uMixRadius;
uniform vec2  uPointer;
#define PI3 1.04709283144
void main() {
  vec2 uv = vUv;
  vec2 waveCoord = uv * 2.0 - 1.0;
  float time = uTime * 0.25;
  float frequency = 20.0 * uFrequency;
  float amp = uAmplitude * 0.2;
  float waveX = sin((waveCoord.y + 0.5) * frequency + (time * PI3)) * amp;
  float waveY = sin((waveCoord.x - 0.5) * frequency + (time * PI3)) * amp;
  waveCoord.xy += vec2(mix(waveX, 0.0, uRotation), mix(0.0, waveY, uRotation));
  vec2 finalUV = waveCoord * 0.5 + 0.5;
  float aspectRatio = uResolution.x / uResolution.y;
  vec2 mPos = uPointer;
  float dist = max(0.0, 1.0 - distance(uv * vec2(aspectRatio, 1.0),
               mPos * vec2(aspectRatio, 1.0)) * 4.0 * (1.0 - uMixRadius));
  uv = mix(uv, finalUV, dist);
  fragColor = texture(tInput, uv);
}`

const VORONOI_SRC = `#version 300 es
precision mediump float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D tInput;
uniform vec2  uResolution;
uniform float uTime;
uniform float uAmount;
uniform float uSpread;
uniform float uAngle;
uniform float uSkew;
uniform float uMixRadius;
uniform vec2  uPointer;
#define PI 3.14159265359
vec2 random2(vec2 p) {
  return fract(sin(vec2(
    dot(p, vec2(127.1, 311.7)),
    dot(p, vec2(269.5, 183.3))
  )) * 43758.5453);
}
mat2 rot(float a) { return mat2(cos(a),-sin(a),sin(a),cos(a)); }
void main() {
  vec2 uv = vUv;
  float aspectRatio = uResolution.x / uResolution.y;
  vec2 skew = mix(vec2(1.0), vec2(1.0, 0.0), uSkew);
  vec2 st = (uv - vec2(0.5)) * vec2(aspectRatio, 1.0) * 50.0 * uAmount;
  st = st * rot(uAngle * 2.0 * PI) * skew;
  vec2 i_st = floor(st);
  vec2 f_st = fract(st);
  float m_dist = 15.0;
  vec2 m_point = vec2(0.0);
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 neighbor = vec2(float(i), float(j));
      vec2 point = random2(i_st + neighbor);
      point = 0.5 + 0.5 * sin(5.0 + uTime * 0.2 + 6.2831 * point);
      vec2 diff = neighbor + point - f_st;
      float dist = length(diff);
      if (dist < m_dist) {
        m_dist = dist;
        m_point = point;
      }
    }
  }
  vec2 offset = (m_point * 0.2 * uSpread * 2.0) - (uSpread * 0.2);
  float dist = max(0.0, 1.0 - distance(uv * vec2(aspectRatio, 1.0),
               uPointer * vec2(aspectRatio, 1.0)) * 4.0 * (1.0 - uMixRadius));
  fragColor = texture(tInput, uv + offset * dist);
}`

const BOKEH_SRC = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
#define GOLDEN_ANGLE 2.39996323
#define ITERATIONS 40.0
uniform sampler2D tInput;
uniform sampler2D tBlueNoise;
uniform vec2  uResolution;
uniform vec2  uBlueNoiseRes;
uniform float uAmount;
uniform float uTilt;
uniform float uTime;
uniform vec2  uPointer;
vec2 sampleDisk(in float theta, inout float r) {
  r += 1.0 / r;
  return (r - 1.0) * vec2(cos(theta), sin(theta));
}
float getNoiseOffset(vec2 st) {
  ivec2 texSize = ivec2(uBlueNoiseRes);
  vec4 noise = texelFetch(tBlueNoise,
    ivec2(fract(st * uResolution / vec2(texSize)) * vec2(texSize)) % texSize, 0);
  return mod((noise.r - 0.5) * 6.28318, 6.28318);
}
void main() {
  vec2 uv = vUv;
  float dis = distance(uv, uPointer) * 1000.0;
  float tilt = mix(1.0 - dis * 0.001, dis * 0.001, uTilt);
  float blurRadius = uAmount * tilt;
  vec3 accColor = vec3(0.0);
  vec3 accWeights = vec3(0.0);
  float accAlpha = 0.0;
  float aspectRatio = uResolution.x / uResolution.y;
  vec2 pixelSize = vec2(1.0 / aspectRatio, 1.0) * 0.003 * max(blurRadius, 0.0);
  float r = 1.0;
  float noiseOffset = (getNoiseOffset(uv) - 0.5) * 0.01;
  float noiseAngle = noiseOffset * 6.28318;
  mat2 rotM = mat2(cos(noiseAngle), -sin(noiseAngle),
                   sin(noiseAngle),  cos(noiseAngle));
  for (float j = 0.0; j < GOLDEN_ANGLE * ITERATIONS; j += GOLDEN_ANGLE) {
    vec2 offset = sampleDisk(j, r) * pixelSize;
    offset *= 1.0 + 0.05 * sin(j * 0.7 + noiseOffset);
    vec2 sOff = rotM * offset;
    vec4 cs = texture(tInput, uv + sOff);
    vec3 w = vec3(5.0) + pow(cs.rgb, vec3(9.0)) * 150.0;
    accAlpha += cs.a;
    accColor += cs.rgb * w;
    accWeights += w;
  }
  fragColor = vec4(accColor / accWeights, accAlpha / ITERATIONS);
}`

const OUTPUT_SRC = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D tBgTexture;
uniform sampler2D tInput;
uniform vec3 uBgColor;
uniform vec3 uOutputColor;
vec3 overlay(vec3 base, vec3 blend) {
  return mix(
    2.0 * base * blend,
    1.0 - 2.0 * (1.0 - base) * (1.0 - blend),
    step(0.5, base)
  );
}
void main() {
  vec3 bgTex = texture(tBgTexture, vUv).rgb;
  vec3 base = mix(uBgColor, overlay(uBgColor, bgTex), 0.61);
  vec4 inp = texture(tInput, vUv);
  vec3 blend = mix(uOutputColor, inp.rgb, inp.a);
  fragColor.rgb = base * mix(vec3(1.0), blend, 0.34);
  fragColor.a = 1.0;
}`

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (255 & n) / 255]
}

const THEME_COLORS = {
  light: { background: hexToRgb("#EBE1FF"), vignette: hexToRgb("#6D28D9"), output: hexToRgb("#A78BFA") },
  dark: { background: hexToRgb("#221836"), vignette: hexToRgb("#08050F"), output: hexToRgb("#9D7CF0") },
}
const GRADIENT_LIGHT = ["#E3D4FF", "#C9B0FF", "#EDE4FF", "#A78BFA"]
const GRADIENT_DARK = ["#43326B", "#302250", "#281B3D", "#180F2B"]

const CONFIG = {
  resolution: 0.5,
  vignette: { radius: 0.28, falloff: 1, skew: 0.54, angle: 0 },
  sine: { frequency: 0.35, amplitude: 1.18, rotation: 0, mixRadius: 1 },
  shatter: { scale: 0.534, amount: 1, angle: 44 / 360, skew: 0.84, mixRadius: 1 },
  bokeh: { radius: 0.754, tilt: 0.5 },
}

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader
  console.error("[hero-webgl-bg] shader error:", gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
  return null
}

function linkProgram(gl: WebGL2RenderingContext, fragmentSrc: string) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC)
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc)
  if (!vertex || !fragment) return null
  const program = gl.createProgram()
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.bindAttribLocation(program, 0, "position")
  gl.linkProgram(program)
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program
  console.error("[hero-webgl-bg] link error:", gl.getProgramInfoLog(program))
  return null
}

function createFloatFramebuffer(gl: WebGL2RenderingContext, width: number, height: number, useFloat: boolean) {
  const tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, tex)
  // EXT_color_buffer_float nem sempre está disponível (ex.: Chromium
  // headless sem GPU) — cai para RGBA8 nesse caso em vez de desistir, algo
  // que o site original não faz (ele só aborta com um warning).
  if (useFloat) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, width, height, 0, gl.RGBA, gl.HALF_FLOAT, null)
  else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  const fb = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
  return { fb, tex }
}

function createRadialGradientTexture(gl: WebGL2RenderingContext, colors: string[]) {
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 512
  const ctx = canvas.getContext("2d")!
  const grad = ctx.createRadialGradient(204, 204, 0, 256, 256, 358)
  grad.addColorStop(0, colors[0])
  grad.addColorStop(0.3, colors[1])
  grad.addColorStop(0.6, colors[2])
  grad.addColorStop(1, colors[3])
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 512, 512)
  const tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  return tex
}

function createBlueNoiseTexture(gl: WebGL2RenderingContext) {
  const data = new Uint8Array(256 * 256 * 4)
  for (let e = 0; e < 65536; e++) {
    const x = e % 256
    const y = Math.floor(e / 256)
    const n1 = 43758.5453 * Math.sin(12.9898 * x + 78.233 * y)
    const n2 = 28461.5217 * Math.sin(39.346 * x + 11.135 * y)
    data[4 * e] = ((n1 - Math.floor(n1)) * 255) | 0
    data[4 * e + 1] = ((n2 - Math.floor(n2)) * 255) | 0
    data[4 * e + 2] = 128
    data[4 * e + 3] = 255
  }
  const tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE, data)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
  return tex
}

type Props = { darkMode: boolean }

export function HeroWebGLBackground({ darkMode }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const darkModeRef = useRef(darkMode)

  useEffect(() => {
    darkModeRef.current = darkMode
  }, [darkMode])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // preserveDrawingBuffer evita o canvas "piscar" pra transparente quando o
    // render pausa durante scroll contínuo (ver `scrolling` abaixo) — sem
    // isso, o browser limpa o drawing buffer a cada frame em que nada foi
    // desenhado, e some o fundo bem no meio do pin do Hero.
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: true, preserveDrawingBuffer: true })
    if (!gl) {
      console.warn("[hero-webgl-bg] WebGL2 unavailable")
      return
    }
    const useFloat = !!gl.getExtension("EXT_color_buffer_float")
    if (!useFloat) console.warn("[hero-webgl-bg] EXT_color_buffer_float unavailable, using RGBA8")

    const quad = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, quad)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    const programs = {
      fill: linkProgram(gl, FILL_SRC),
      vignette: linkProgram(gl, VIGNETTE_SRC),
      sine: linkProgram(gl, SINE_SRC),
      voronoi: linkProgram(gl, VORONOI_SRC),
      bokeh: linkProgram(gl, BOKEH_SRC),
      output: linkProgram(gl, OUTPUT_SRC),
    }
    if (Object.values(programs).some((p) => !p)) return

    const uniformCache = new Map<WebGLProgram, Map<string, WebGLUniformLocation | null>>()
    const uLoc = (program: WebGLProgram, name: string) => {
      let cache = uniformCache.get(program)
      if (!cache) uniformCache.set(program, (cache = new Map()))
      if (!cache.has(name)) cache.set(name, gl.getUniformLocation(program, name))
      return cache.get(name)!
    }

    const blueNoiseTex = createBlueNoiseTexture(gl)
    const gradientLight = createRadialGradientTexture(gl, GRADIENT_LIGHT)
    const gradientDark = createRadialGradientTexture(gl, GRADIENT_DARK)

    let fbWidth = 0
    let fbHeight = 0
    let pingFb: { fb: WebGLFramebuffer; tex: WebGLTexture } | null = null
    let pongFb: { fb: WebGLFramebuffer; tex: WebGLTexture } | null = null

    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * CONFIG.resolution))
      const h = Math.max(1, Math.floor(canvas.clientHeight * CONFIG.resolution))
      if (w === fbWidth && h === fbHeight) return
      fbWidth = w
      fbHeight = h
      canvas.width = w
      canvas.height = h
      if (pingFb) {
        gl.deleteFramebuffer(pingFb.fb)
        gl.deleteTexture(pingFb.tex)
      }
      if (pongFb) {
        gl.deleteFramebuffer(pongFb.fb)
        gl.deleteTexture(pongFb.tex)
      }
      pingFb = createFloatFramebuffer(gl, w, h, useFloat)
      pongFb = createFloatFramebuffer(gl, w, h, useFloat)
    }
    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    const pointerTarget = { x: 0.5, y: 0.5 }
    const pointerSmoothed = { x: 0.5, y: 0.5 }
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointerTarget.x = (e.clientX - rect.left) / rect.width
      pointerTarget.y = 1 - (e.clientY - rect.top) / rect.height
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true })

    let scrolling = false
    let scrollTimer: ReturnType<typeof setTimeout>
    const onScroll = () => {
      scrolling = true
      clearTimeout(scrollTimer)
      scrollTimer = setTimeout(() => (scrolling = false), 150)
    }
    window.addEventListener("scroll", onScroll, { passive: true, capture: true })

    const drawQuad = () => gl.drawArrays(gl.TRIANGLES, 0, 3)
    const bindTarget = (target: { fb: WebGLFramebuffer } | null) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.fb : null)
      gl.viewport(0, 0, target ? fbWidth : canvas.width, target ? fbHeight : canvas.height)
    }

    let rafId = 0
    const startTime = performance.now()

    const render = (now: number) => {
      rafId = requestAnimationFrame(render)
      if (scrolling || !pingFb || !pongFb) return

      pointerSmoothed.x += (pointerTarget.x - pointerSmoothed.x) * 0.1
      pointerSmoothed.y += (pointerTarget.y - pointerSmoothed.y) * 0.1

      const time = (now - startTime) / 1000
      const resolution: [number, number] = [fbWidth, fbHeight]
      const pointer: [number, number] = [pointerSmoothed.x, pointerSmoothed.y]
      const isDark = darkModeRef.current
      const theme = isDark ? THEME_COLORS.dark : THEME_COLORS.light

      bindTarget(pingFb)
      gl.useProgram(programs.fill)
      gl.uniform3fv(uLoc(programs.fill!, "uBgColor"), theme.background)
      drawQuad()

      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      gl.useProgram(programs.vignette)
      gl.uniform2fv(uLoc(programs.vignette!, "uResolution"), resolution)
      gl.uniform2fv(uLoc(programs.vignette!, "uPointer"), pointer)
      gl.uniform3fv(uLoc(programs.vignette!, "uVignetteColor"), theme.vignette)
      gl.uniform3fv(uLoc(programs.vignette!, "uBgColor"), theme.background)
      gl.uniform1f(uLoc(programs.vignette!, "uRadius"), CONFIG.vignette.radius)
      gl.uniform1f(uLoc(programs.vignette!, "uFalloff"), CONFIG.vignette.falloff)
      gl.uniform1f(uLoc(programs.vignette!, "uSkew"), CONFIG.vignette.skew)
      gl.uniform1f(uLoc(programs.vignette!, "uAngle"), CONFIG.vignette.angle)
      drawQuad()
      gl.disable(gl.BLEND)

      bindTarget(pongFb)
      gl.useProgram(programs.sine)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, pingFb.tex)
      gl.uniform1i(uLoc(programs.sine!, "tInput"), 0)
      gl.uniform2fv(uLoc(programs.sine!, "uResolution"), resolution)
      gl.uniform1f(uLoc(programs.sine!, "uTime"), time)
      gl.uniform1f(uLoc(programs.sine!, "uFrequency"), CONFIG.sine.frequency)
      gl.uniform1f(uLoc(programs.sine!, "uAmplitude"), CONFIG.sine.amplitude)
      gl.uniform1f(uLoc(programs.sine!, "uRotation"), CONFIG.sine.rotation)
      gl.uniform1f(uLoc(programs.sine!, "uMixRadius"), CONFIG.sine.mixRadius)
      gl.uniform2fv(uLoc(programs.sine!, "uPointer"), pointer)
      drawQuad()

      bindTarget(pingFb)
      gl.useProgram(programs.voronoi)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, pongFb.tex)
      gl.uniform1i(uLoc(programs.voronoi!, "tInput"), 0)
      gl.uniform2fv(uLoc(programs.voronoi!, "uResolution"), resolution)
      gl.uniform1f(uLoc(programs.voronoi!, "uTime"), time)
      gl.uniform1f(uLoc(programs.voronoi!, "uAmount"), CONFIG.shatter.scale)
      gl.uniform1f(uLoc(programs.voronoi!, "uSpread"), CONFIG.shatter.amount)
      gl.uniform1f(uLoc(programs.voronoi!, "uAngle"), CONFIG.shatter.angle)
      gl.uniform1f(uLoc(programs.voronoi!, "uSkew"), CONFIG.shatter.skew)
      gl.uniform1f(uLoc(programs.voronoi!, "uMixRadius"), CONFIG.shatter.mixRadius)
      gl.uniform2fv(uLoc(programs.voronoi!, "uPointer"), pointer)
      drawQuad()

      bindTarget(pongFb)
      gl.useProgram(programs.bokeh)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, pingFb.tex)
      gl.uniform1i(uLoc(programs.bokeh!, "tInput"), 0)
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, blueNoiseTex)
      gl.uniform1i(uLoc(programs.bokeh!, "tBlueNoise"), 1)
      gl.uniform2fv(uLoc(programs.bokeh!, "uResolution"), resolution)
      gl.uniform2fv(uLoc(programs.bokeh!, "uBlueNoiseRes"), [256, 256])
      gl.uniform1f(uLoc(programs.bokeh!, "uAmount"), CONFIG.bokeh.radius)
      gl.uniform1f(uLoc(programs.bokeh!, "uTilt"), CONFIG.bokeh.tilt)
      gl.uniform1f(uLoc(programs.bokeh!, "uTime"), time)
      gl.uniform2fv(uLoc(programs.bokeh!, "uPointer"), pointer)
      drawQuad()

      bindTarget(null)
      gl.useProgram(programs.output)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, isDark ? gradientDark : gradientLight)
      gl.uniform1i(uLoc(programs.output!, "tBgTexture"), 0)
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, pongFb.tex)
      gl.uniform1i(uLoc(programs.output!, "tInput"), 1)
      gl.uniform3fv(uLoc(programs.output!, "uBgColor"), theme.background)
      gl.uniform3fv(uLoc(programs.output!, "uOutputColor"), theme.output)
      drawQuad()
    }

    rafId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("scroll", onScroll, true)
      clearTimeout(scrollTimer)
      const lose = gl.getExtension("WEBGL_lose_context")
      lose?.loseContext()
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden className="oc-hero-webgl-bg" />
}
