const fs = require("fs");
const { createCanvas } = require("canvas");

// Create a 200x200 canvas
const canvas = createCanvas(200, 200);
const ctx = canvas.getContext("2d");

// Set background
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, 200, 200);

// Draw a simple logo
ctx.fillStyle = "#32486B";
ctx.beginPath();
ctx.arc(100, 100, 80, 0, Math.PI * 2);
ctx.fill();

// Add text
ctx.fillStyle = "#ffffff";
ctx.font = "bold 40px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("TEST", 100, 100);

// Save to PNG file
const buffer = canvas.toBuffer("image/png");
fs.writeFileSync("test-assets/logo.png", buffer);
