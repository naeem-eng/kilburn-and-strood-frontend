export const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

export const fragmentShader = `
      uniform sampler2D uTexture;
      uniform vec2 uResolution;
      uniform vec2 uTextureSize;
      uniform vec2 uMouse;
      uniform vec4 uGlassRegion; // x, y (bottom-left UV), z = width, w = height (in 0-1)
      uniform vec2 uObjectPosition; // 0-1 anchor matching CSS object-position
      uniform float uParallaxStrength;
      uniform float uDistortionMultiplier;
      uniform float uGlassStrength;
      uniform float ustripesFrequency;
      uniform float uglassSmoothness;
      uniform float uEdgePadding;
      uniform float uTime;
      
      varying vec2 vUv;
      
      vec2 getCoverUV(vec2 uv, vec2 textureSize) {
        if (textureSize.x < 1.0 || textureSize.y < 1.0) return uv;
        
        vec2 s = uResolution / textureSize;
        float scale = max(s.x, s.y);
        
        vec2 scaledSize = textureSize * scale;
        vec2 offset = (uResolution - scaledSize) * uObjectPosition;
        
        return (uv * uResolution - offset) / scaledSize;
      }
      
      float displacement(float x, float num_stripes, float strength) {
        float stripeWidth = 1.0 / num_stripes;
        float t = mod(x, stripeWidth) / stripeWidth; // 0-1 within each stripe
        // Normalize by stripe count so strength feels consistent regardless of frequency
        return t * strength / num_stripes;
      }
      
      float fractalGlass(float localX) {
        float d = 0.0;
        for (int i = -5; i <= 5; i++) {
          d += displacement(localX + float(i) * uglassSmoothness, ustripesFrequency, uGlassStrength);
        }
        d = d / 11.0;
        return d;
      }

      float smoothEdge(float x, float padding) {
        float edge = padding;
        if (x < edge) {
          return smoothstep(0.0, edge, x);
        } else if (x > 1.0 - edge) {
          return smoothstep(1.0, 1.0 - edge, x);
        }
        return 1.0;
      }
      
      void main() {
        // vUv is 0-1 within the glass canvas. Remap to full-image UV space.
        vec2 uv = vec2(
          uGlassRegion.x + vUv.x * uGlassRegion.z,
          uGlassRegion.y + vUv.y * uGlassRegion.w
        );
        
        float originalX = uv.x;
        
        float edgeFactor = smoothEdge(vUv.x, uEdgePadding);
        
        // fractalGlass operates in glass-local space (0-1),
        // result scaled to image UV via glassRegion width
        float glassDistortion = fractalGlass(vUv.x) * uGlassRegion.z;
        float distortedX = originalX + glassDistortion;
        
        // Smooth rightward-traveling wave (glass-local, scaled to image UV)
        distortedX += sin(vUv.x * ustripesFrequency * 6.28318 - uTime * 6.28318)
                      * uGlassStrength * 0.02 * uGlassRegion.z;
        
        uv.x = mix(originalX, distortedX, edgeFactor);
        
        // Normalize distortion factor by glass width so parallax amplification
        // is consistent regardless of glass size
        float distortionFactor = (uv.x - originalX) / uGlassRegion.z;
        
        float parallaxDirection = -sign(0.5 - uMouse.x);
        
        vec2 parallaxOffset = vec2(
          parallaxDirection * abs(uMouse.x - 0.5) * uParallaxStrength * (1.0 + abs(distortionFactor) * uDistortionMultiplier),
          0.0
        );
        
        parallaxOffset *= edgeFactor;
        
        uv += parallaxOffset;
        
        vec2 coverUV = getCoverUV(uv, uTextureSize);
        
        if (coverUV.x < 0.0 || coverUV.x > 1.0 || coverUV.y < 0.0 || coverUV.y > 1.0) {
          coverUV = clamp(coverUV, 0.0, 1.0);
        }
        
        vec4 color = texture2D(uTexture, coverUV);
        
        gl_FragColor = color;
      }
    `;
