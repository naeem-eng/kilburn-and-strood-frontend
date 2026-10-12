"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders.js";

const FractalGlass = ({
  imgSrc,
  children,
  lerpFactor = 0.035,
  parallax = true,
  parallaxStrength = 0.1,
  distortionMultiplier = 10,
  glassStrength = 2.0,
  glassSmoothness = 0.0001,
  stripesFrequency = 35,
  edgePadding = 0.1,
  animateDistortion = false,
  distortionSpeed = 0.3,
  glassWidth = "100%",
  glassHeight = "100%",
  glassPosition = "center center",
  objectPosition = "center center",
  mdObjectPosition,
  className = "",
  style = {},
}) => {
  const containerRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const meshRef = useRef(null);
  const materialRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const animationRef = useRef(null);
  const sizeRef = useRef({ w: 1, h: 1 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Parse CSS-style object-position string into {x, y} in 0-1 range
  const parseObjectPosition = (pos) => {
    const tokens = pos.trim().split(/\s+/);
    const resolve = (v, axis) => {
      if (v === "left" || v === "top") return 0;
      if (v === "right" || v === "bottom") return 1;
      if (v === "center") return 0.5;
      if (v.endsWith("%")) return parseFloat(v) / 100;
      return 0.5;
    };
    // Handle single keyword
    if (tokens.length === 1) {
      const t = tokens[0];
      if (t === "top" || t === "bottom") return { x: 0.5, y: resolve(t) };
      if (t === "left" || t === "right") return { x: resolve(t), y: 0.5 };
      return { x: resolve(t), y: resolve(t) };
    }
    let tx = tokens[0], ty = tokens[1];
    const isY = (v) => v === "top" || v === "bottom";
    const isX = (v) => v === "left" || v === "right";
    if (isY(tx) || isX(ty)) [tx, ty] = [ty, tx];
    return { x: resolve(tx, "x"), y: resolve(ty, "y") };
  };

  // Compute the glass region in 0-1 UV space relative to the full container
  const getGlassRegion = (containerW, containerH) => {
    // Parse dimension value to pixels
    const parseDim = (val, total) => {
      if (typeof val === "number") return val;
      const str = String(val).trim();
      if (str.endsWith("%")) return (parseFloat(str) / 100) * total;
      return parseFloat(str) || total;
    };

    const gw = parseDim(glassWidth, containerW);
    const gh = parseDim(glassHeight, containerH);

    // Parse position keywords to offsets (CSS-style: "top left" and "left top" both valid)
    const parts = glassPosition.trim().split(/\s+/);
    let px = parts[0] || "center";
    let py = parts[1] || "center";
    // Swap if a Y-axis keyword landed in the X slot or vice-versa
    const isYKey = (v) => v === "top" || v === "bottom";
    const isXKey = (v) => v === "left" || v === "right";
    if (isYKey(px) || isXKey(py)) [px, py] = [py, px];

    const resolveX = (v) => {
      if (v === "left") return 0;
      if (v === "right") return containerW - gw;
      if (v === "center") return (containerW - gw) / 2;
      return parseDim(v, containerW);
    };
    const resolveY = (v) => {
      if (v === "top") return 0;
      if (v === "bottom") return containerH - gh;
      if (v === "center") return (containerH - gh) / 2;
      return parseDim(v, containerH);
    };

    const ox = resolveX(px);
    const oy = resolveY(py);

    return {
      // pixel values for CSS/renderer
      px: { x: ox, y: oy, w: gw, h: gh },
      // normalised 0-1 for shader (UV origin is bottom-left)
      uv: {
        x: ox / containerW,
        y: 1.0 - (oy + gh) / containerH, // flip Y for GL
        w: gw / containerW,
        h: gh / containerH,
      },
    };
  };

  useEffect(() => {
    const wrap = canvasWrapRef.current;
    const container = containerRef.current;
    if (!wrap || !container) return;

    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Start at 1x1 — will be corrected immediately by applySize
    rendererRef.current.setSize(1, 1);
    wrap.appendChild(rendererRef.current.domElement);

    const textureSize = { x: 1, y: 1 };

    materialRef.current = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uResolution: {
          value: new THREE.Vector2(1, 1),
        },
        uTextureSize: {
          value: new THREE.Vector2(textureSize.x, textureSize.y),
        },
        uMouse: {
          value: new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
        },
        uGlassRegion: {
          value: new THREE.Vector4(0, 0, 1, 1),
        },
        uObjectPosition: {
          value: new THREE.Vector2(0.5, 0.5),
        },
        uParallaxStrength: { value: parallaxStrength },
        uDistortionMultiplier: { value: distortionMultiplier },
        uGlassStrength: { value: glassStrength },
        ustripesFrequency: { value: stripesFrequency },
        uglassSmoothness: { value: glassSmoothness },
        uEdgePadding: { value: edgePadding },
        uTime: { value: 0 },
      },
      vertexShader,
      fragmentShader,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    meshRef.current = new THREE.Mesh(geometry, materialRef.current);
    sceneRef.current.add(meshRef.current);

    loadTexture();

    // Viewport-relative mouse — stable even when container is parallaxed by GSAP
    const handleMouseMove = (e) => {
      targetMouseRef.current.x = e.clientX / window.innerWidth;
      targetMouseRef.current.y = 1.0 - e.clientY / window.innerHeight;
    };

    if (parallax) {
      document.addEventListener("mousemove", handleMouseMove);
    } else {
      // Lock mouse to center so parallax has no effect
      mouseRef.current.x = 0.5;
      mouseRef.current.y = 0.5;
      targetMouseRef.current.x = 0.5;
      targetMouseRef.current.y = 0.5;
    }

    // Use layout dimensions (immune to transforms) for sizing
    const applySize = (w, h) => {
      if (!rendererRef.current || !materialRef.current || w < 1 || h < 1) return;
      const region = getGlassRegion(w, h);
      if (region.px.w < 1 || region.px.h < 1) return;
      sizeRef.current = { w: region.px.w, h: region.px.h };
      rendererRef.current.setSize(sizeRef.current.w, sizeRef.current.h);
      // uResolution = full container size (for correct cover UV mapping)
      materialRef.current.uniforms.uResolution.value.set(w, h);
      materialRef.current.uniforms.uGlassRegion.value.set(
        region.uv.x, region.uv.y, region.uv.w, region.uv.h
      );
      // Match CSS object-position, responsive at md breakpoint (768px)
      const pos = mdObjectPosition && window.innerWidth >= 768
        ? parseObjectPosition(mdObjectPosition)
        : parseObjectPosition(objectPosition);
      materialRef.current.uniforms.uObjectPosition.value.set(pos.x, pos.y);
      // Update the canvas wrapper position
      if (canvasWrapRef.current) {
        canvasWrapRef.current.style.left = region.px.x + "px";
        canvasWrapRef.current.style.top = region.px.y + "px";
        canvasWrapRef.current.style.width = region.px.w + "px";
        canvasWrapRef.current.style.height = region.px.h + "px";
      }
    };

    // Initial size — deferred to ensure layout is complete
    requestAnimationFrame(() => {
      const w = container.offsetWidth || 1;
      const h = container.offsetHeight || 1;
      applySize(w, h);
    });

    // ResizeObserver gives layout dimensions unaffected by transforms
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const cr = entry.contentRect;
          applySize(cr.width, cr.height);
        }
      });
      ro.observe(container);
    }

    animate();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (ro) ro.disconnect();

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (rendererRef.current && wrap) {
        wrap.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }

      if (meshRef.current) {
        meshRef.current.geometry.dispose();
        meshRef.current.material.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.uParallaxStrength.value = parallaxStrength;
    materialRef.current.uniforms.uDistortionMultiplier.value =
      distortionMultiplier;
    materialRef.current.uniforms.uGlassStrength.value = glassStrength;
    materialRef.current.uniforms.ustripesFrequency.value = stripesFrequency;
    materialRef.current.uniforms.uglassSmoothness.value = glassSmoothness;
    materialRef.current.uniforms.uEdgePadding.value = edgePadding;
  }, [
    parallaxStrength,
    distortionMultiplier,
    glassStrength,
    stripesFrequency,
    glassSmoothness,
    edgePadding,
  ]);

  useEffect(() => {
    if (isLoaded) {
      loadTexture();
    }
  }, [imgSrc, isLoaded]);

  const loadTexture = () => {
    if (!materialRef.current) return;

    const loader = new THREE.TextureLoader();
    loader.load(
      imgSrc,
      (texture) => {
        texture.needsUpdate = true;
        const img = texture.image;
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        materialRef.current.uniforms.uTexture.value = texture;
        materialRef.current.uniforms.uTextureSize.value.set(width, height);
        setIsLoaded(true);
      },
      undefined,
      (error) => {
        console.error("Error loading texture:", error);
      }
    );
  };

  const lerp = (start, end, factor) => start + (end - start) * factor;

  const animate = () => {
    if (
      !rendererRef.current ||
      !sceneRef.current ||
      !cameraRef.current ||
      !materialRef.current
    )
      return;

    animationRef.current = requestAnimationFrame(animate);

    mouseRef.current.x = lerp(
      mouseRef.current.x,
      targetMouseRef.current.x,
      lerpFactor
    );
    mouseRef.current.y = lerp(
      mouseRef.current.y,
      targetMouseRef.current.y,
      lerpFactor
    );
    materialRef.current.uniforms.uMouse.value.set(
      mouseRef.current.x,
      mouseRef.current.y
    );

    if (animateDistortion) {
      materialRef.current.uniforms.uTime.value += distortionSpeed * 0.01;
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
  };

  return (
    <div
      ref={containerRef}
      className={`fractal-glass-container ${className}`}
      style={{ position: "relative", ...style }}
    >
      {children}
      <div
        ref={canvasWrapRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: glassWidth,
          height: glassHeight,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      />
    </div>
  );
};

export default FractalGlass;
