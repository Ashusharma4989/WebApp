import React, { useEffect, useRef } from "react";
import { Canvas, Image as FabricImage, Text } from "fabric";

export default function CanvasEditor({ imageUrl, data }) {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  useEffect(() => {
    if (!imageUrl) return;

    // Initialize canvas once
    if (!fabricRef.current) {
      fabricRef.current = new Canvas(canvasRef.current);
    }

    const canvas = fabricRef.current;
    canvas.clear();

    FabricImage.fromURL(imageUrl)
      .then((img) => {
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 600;

        // Maintain aspect ratio
        const scaleX = MAX_WIDTH / img.width;
        const scaleY = MAX_HEIGHT / img.height;
        const scale = Math.min(scaleX, scaleY);

        img.scale(scale);

        // Set canvas size properly
        canvas.setDimensions({
          width: img.width * scale,
          height: img.height * scale,
        });

        canvas.add(img);

        // Add text (scaled positions)
        data.forEach((item, i) => {
          const safeValue =
            item && item.value !== undefined && item.value !== null
              ? String(item.value)
              : "";

          const text = new Text(safeValue, {
            left: 20,
            top: 20 + i * 30,
            fill: "red",
            fontSize: 14 * scale, // scale text too
          });

          canvas.add(text);
        });

        canvas.renderAll();
      })
      .catch((err) => {
        console.error("Image load failed:", err);
      });

  }, [imageUrl, data]);

  return (
    <div style={{ border: "1px solid black", padding: "10px" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}