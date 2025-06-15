export const tubeVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const tubeFragmentShader = `
  uniform float time;
  uniform float opacity;
  uniform vec3 color;
  uniform sampler2D map;
  uniform sampler2D bumpMap;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vec2 uv = vUv;
    
    // Animate UV coordinates
    uv.x += time * 0.1;
    
    // Sample textures
    vec4 texColor = texture2D(map, uv);
    vec4 bumpColor = texture2D(bumpMap, uv);
    
    // Calculate lighting
    vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
    float lightIntensity = max(dot(vNormal, lightDirection), 0.0);
    
    // Apply bump mapping effect
    float bumpIntensity = (bumpColor.r - 0.5) * 0.1;
    lightIntensity += bumpIntensity;
    
    // Final color
    vec3 finalColor = texColor.rgb * color * lightIntensity;
    
    gl_FragColor = vec4(finalColor, opacity);
  }
`;

export const particleVertexShader = `
  attribute float size;
  attribute vec3 customColor;
  
  varying vec3 vColor;
  
  void main() {
    vColor = customColor;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const particleFragmentShader = `
  uniform sampler2D pointTexture;
  uniform float opacity;
  
  varying vec3 vColor;
  
  void main() {
    gl_FragColor = vec4(vColor, opacity);
    gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
  }
`;