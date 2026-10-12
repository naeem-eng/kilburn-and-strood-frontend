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
      uniform float uGlassBlur;
      uniform float uTime;
      uniform float uDistortionType; // 0.0 = wave, 1.0 = robotic
      
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
        float t = mod(x, stripeWidth) / stripeWidth;
        return t * strength / num_stripes;
      }

      float fractalGlass(float localX) {
        float d = 0.0;
        int samples = 11;
        int halfSamples = 5;
        if (ustripesFrequency < 21.0) {
          samples = 21;
          halfSamples = 10;
        }
        for (int i = -10; i <= 10; i++) {
          if (samples == 11 && (i < -5 || i > 5)) continue;
          d += displacement(localX + float(i) * uglassSmoothness, ustripesFrequency, uGlassStrength);
        }
        d = d / float(samples);
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
        
        // Scale edge padding for low stripesFrequency
        float scaledEdgePadding = uEdgePadding;
        if (ustripesFrequency < 21.0) {
          // Increase edge padding up to 2.5x for lowest frequencies (5-20)
          float scale = 1.0 + (21.0 - ustripesFrequency) / 20.0 * 1.5; // 1.0-2.5
          scaledEdgePadding *= scale;
        }
        float edgeFactor = smoothEdge(vUv.x, scaledEdgePadding);
        // Static fractal glass pattern (complex, organic)
        float glassDistortion = fractalGlass(vUv.x) * uGlassRegion.z;
        float distortedX = originalX + glassDistortion;
        // Smooth rightward-traveling sine wave layered on top for carousel motion
        // Amplitude scales inversely with stripe count so the effect stays balanced
        if (uDistortionType < 0.5) {
          // Wave mode: smooth sinusoidal carousel
          distortedX += sin(vUv.x * ustripesFrequency * 6.28318 - uTime * 6.28318)
                        * uGlassStrength * (0.7 / ustripesFrequency) * uGlassRegion.z * uDistortionMultiplier;
        } else {
          // Robotic mode: scroll the entire glass distortion pattern rightward in a continuous loop
          float scrolledGlass = fractalGlass(vUv.x - uTime) * uGlassRegion.z;
          distortedX = originalX + scrolledGlass;
        }

        // More aggressive blending for low stripesFrequency
        float blendFactor = edgeFactor;
        if (ustripesFrequency < 21.0) {
          // Increase blend toward distortedX for low frequencies (e.g., 0.7-1.0)
          blendFactor = mix(edgeFactor, 1.0, (21.0 - ustripesFrequency) / 20.0 * 0.3); // up to 30% more blend
        }
        uv.x = mix(originalX, distortedX, blendFactor);
        
        // Normalize distortion factor by glass width for consistent parallax
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
        
        vec4 color;
        if (uGlassBlur > 0.0) {
          // Box blur: sample a 9-tap kernel scaled by blur strength
          vec2 texel = uGlassBlur / uResolution;
          color  = texture2D(uTexture, coverUV);
          color += texture2D(uTexture, coverUV + vec2( texel.x,  0.0));
          color += texture2D(uTexture, coverUV + vec2(-texel.x,  0.0));
          color += texture2D(uTexture, coverUV + vec2( 0.0,  texel.y));
          color += texture2D(uTexture, coverUV + vec2( 0.0, -texel.y));
          color += texture2D(uTexture, coverUV + vec2( texel.x,  texel.y));
          color += texture2D(uTexture, coverUV + vec2(-texel.x,  texel.y));
          color += texture2D(uTexture, coverUV + vec2( texel.x, -texel.y));
          color += texture2D(uTexture, coverUV + vec2(-texel.x, -texel.y));
          color /= 9.0;
        } else {
          color = texture2D(uTexture, coverUV);
        }
        
        gl_FragColor = color;
      }
    `;
