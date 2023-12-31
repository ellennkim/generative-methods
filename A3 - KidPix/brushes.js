const WIDTH = 1000;
const HEIGHT = 600;
const DEFAULT_FRAME_RATE = 30;
const DEFAULT_LOOP_LENGTH_IN_FRAMES = 100;

const STARTING_COLOR0 = [196, 66, 71];
const STARTING_COLOR1 = [286, 100, 96];
const STARTING_BRUSH_SIZE = 1;

function startDrawing(p) {
  // Change if you want to start with a different background,
  // or even *no background!*
  p.background(0, 0, 50);
}

let brushes = [
  // Your brushes here!
  //======================================================

  //clear screen
  {
    label: "🗑️",
    show: true,
    description: "Clear the screen",

    setup(p, settings) {
      //       When the user clicks clear, what happens?'
      p.background(0, 0, 50); //set to background color
    },
  },

  //eraser
  {
    label: "🕳",
    show: true,
    description: "Eraser",

    setup(p, settings) {
      //       When the user clicks erase, what happens?'
      p.stroke(0, 0, 50); //set brush to background color to look like it's erasing
      p.strokeWeight(15);
    },

    mouseDragged(p, settings) {
      //       When the user drags erase, what happens?
      let x = p.mouseX;
      let y = p.mouseY;
      let x1 = p.pmouseX;
      let y1 = p.pmouseY;

      if (p.mouseIsPressed) {
        p.line(x, y, x1, y1); //create continuous eraser brush
      }
    },
  },

  //TOOL 1: pencil - discrete tool
  {
    label: "○",
    show: true,
    isActive: true,
    description:
      "A discrete dotting tool that changes color (using color0 as a guideline)",

    // Options:
    // setup (when tool is selected),
    // draw (every frame, even if the mouse isn't down),
    // mouseDragged (every frame that the mouse moves),
    // mouseReleased (fires one time when mouse is released)

    mouseDragged(p, { color0, color1, brushSize }) {
      let t = p.millis() * 0.001;
      let x = p.mouseX;
      let y = p.mouseY;
      let r = brushSize * 0.5 + 5;
      let count = 5;

      p.stroke(0, 0, 0);
      p.strokeWeight(1.5);
      for (var i = 0; i < count; i++) {
        let colorChange = 30 * Math.cos(t * 10);
        p.fill(colorChange + color0[0], color0[1], color0[2]);
        p.circle(x, y, r);
      }
    },
  },

  //TOOL 2: rainbow dotter tool
  {
    label: "🌈",
    show: true,
    isActive: true,
    description:
      "A drawing tool that changes color over time (following the rainbow!) and size depending on the speed at which you're drawing.",

    mouseDragged(p, { color0, color1, brushSize }) {
      let t = p.millis() * 0.001;
      let hue = (t * 100) % 360;
      let x = p.mouseX;
      let y = p.mouseY;
      let r = brushSize * 5 + 2;
      let count = 5;

      for (var i = 0; i < count; i++) {
        let d = Math.sqrt(p.movedX ** 2 + p.movedY ** 2);
        let r = d * Math.random();
        p.stroke(hue, color1[1], color1[2], 0.5);
        p.strokeWeight(brushSize * 5 + 2);
        p.fill(hue, color0[1], color0[2], 1);
        p.circle(x, y, r);
      }
    },
  },

  //TOOL 3: continuous spline curve brush - help from ChatGPT
  {
    label: "✏️",
    show: true,
    isActive: true,
    description: "A continuous spline curve brush that changes colors.",

    setup() {
      this.points = [];
    },

    draw(p, { color0, color1, brushSize }) {
      let t = p.millis() * 0.001;
      let hue = (t * 100) % 360;
      p.stroke(...color0);
      p.strokeWeight(2);
      for (var i = 0; i < this.points.length; i++) {
        let colorChange = 30 * Math.sin(t * 10);
        p.fill(colorChange + color0[0], color0[1], color0[2], 50);
      }

      p.beginShape();
      for (let i = 0; i < this.points.length; i++) {
        p.curveVertex(this.points[i].x, this.points[i].y);
      }
      p.endShape();
    },

    mouseDragged(p, { color0, color1, brushSize }) {
      let x = p.mouseX;
      let y = p.mouseY;
      this.points.push(p.createVector(x, y));
    },
  },

  //TOOL 4: a water brush - help from ChatGPT
  {
    label: "💧",
    show: true,
    isActive: true,
    description: "A water brush that moves on its own.",

    setup(p, settings) {
      this.points = [];
    },

    mouseDragged(p, { color0, color1, brushSize }) {
      let water = "💧";
      let x = p.mouseX;
      let y = p.mouseY;

      let pt = { x, y, water, lifespan: 50 };
      this.points.push(pt);
    },

    draw(p, { color0, color1, brushSize }) {
      let t = p.millis() * 0.001;
      this.points.forEach((pt) => {
        pt.lifespan--;

        if (pt.lifespan > 0) {
          let r = p.noise(pt.x, t * 0.5) * 15;
          let theta = p.noise(pt.y, t * 0.5) * Math.PI * 2;

          pt.x += r * Math.tan(theta);
          pt.y += r * Math.sin(theta);

          p.textSize(3);
          p.text(pt.water, pt.x, pt.y);
        }
      });
    },
  },

  //======================================================
  //======================================================
  // Example brushes
  /*
  {
    label: "✏️",
    show: false,
    isActive: false,
    description:
      "A basic paint brush.  It uses the color0 and size properties set by the sliders.  It is a 'discrete' brush",

    // Options:
    // setup (when tool is selected),
    // draw (every frame, even if the mouse isn't down),
    // mouseDragged (every frame that the mouse moves),
    // mouseReleased (fires one time when mouse is released)
    mouseDragged(p, { color0, color1, brushSize }) {
      console.log("Dragged");
      let x = p.mouseX;
      let y = p.mouseY;
      let r = brushSize * 5 + 1;

      //       // Compute speed per frame
      // let d = Math.sqrt(p.movedX**2 + p.movedY**2)
      // r *= d*.2
      //       console.log(d)

      //       if (p.frameCount % 10 == 0)
      //         p.text(d.toFixed(2), x + 5, y)

      // Remove the stroke and set the color to the current color
      p.noStroke();
      p.fill(...color0);
      p.circle(x, y, r);
      // p.fill(...color1);
      // p.circle(x, y + 3, r);
    },
  },

  //======================================================

  //======================================================
  {
    label: "〰",
    show: false,
    isActive: true,
    description:
      "A basic line brush.  It uses pmouseX,pmouseY to draw to where the last mouse position was.  It is a *continuous* brush",

    // Using "draw" because pmouseX only remembers the mouse pos
    // each "frame" which is slightly different than
    // each time we drag the mouse
    draw(p, { color0, color1, brushSize }) {
      console.log("draw");
      let x = p.mouseX;
      let y = p.mouseY;
      let x1 = p.pmouseX;
      let y1 = p.pmouseY;

      if (p.mouseIsPressed) {
        // Another way to say p.stroke(color0[0], color0[1], color0[2]);
        p.stroke(...color0);

        p.strokeWeight(brushSize * 10 + 2);
        p.line(x, y, x1, y1);
      }
    },
  },
  */

  //======================================================

  /*
  {
    label: "🖌",
    show: false,
    isActive: true,
    description:
      "Complicated discrete brush. It uses the color0, color1, and size properties set by the sliders",

    setup() {
      //       Count how many times we've drawn
      this.drawCount = 0;
    },

    // Options: setup (when tool is selected), draw (every frame),
    mouseDragged(p, { color0, color1, brushSize }) {
      //       Here I am keeping track of both the current time, and how many times this brush has drawn

      let t = p.millis() * 0.001; // Get the number of seconds
      this.drawCount += 1;
      let x = p.mouseX;
      let y = p.mouseY;

      //       Controllable brush size
      let r = brushSize * 10 + 10;

      //       Change the brush by how many we have drawn
      // r *= 0.5 + p.noise(this.drawCount * 0.1);
      //       Change the brush by the current time
      // r *= 0.5 + p.noise(t * 10);

      //       Shadow
      p.noStroke();
      p.fill(color0[0], color0[1], color0[2] * 0.2, 0.1);
      p.circle(x, y + r * 0.15, r * 1.1);

      // Big circle
      p.noStroke();
      p.fill(color0[0], color0[1], color0[2]);
      p.circle(x, y, r);

      // Small contrast circle
      p.noStroke();
      p.fill(color1[0], color1[1], color1[2]);
      p.circle(x - r * 0.1, y - r * 0.1, r * 0.7);

      //       Highlight
      p.noStroke();
      p.fill(color1[0], color1[1], color1[2] * 1.4);
      p.circle(x - r * 0.15, y - r * 0.15, r * 0.5);
    },
  },
  */

  //======================================================

  /*
  {
    label: "💦",
    description:
      "Scatter brush, places lots of dots in both colors (discrete!)",
    show: false,
    isActive: true,

    mouseDragged(p, { color0, color1, brushSize }) {
      let t = p.millis() * 0.001;
      let x = p.mouseX;
      let y = p.mouseY;

      let size = 20;
      let count = 6;

      // Scale the cluster by how far we have moved since last frame
      // the "magnitude" of the (movedX, movedY) vector
      let distanceTravelled = p.mag(p.movedX, p.movedY);
      size = distanceTravelled * 2 + 10;

      // I often draw a shadow behind my brush,
      // it helps it stand out from the background
      p.noStroke();
      p.fill(0, 0, 0, 0.01);
      p.circle(x, y, size * 2);

      // Draw some dots

      for (var i = 0; i < count; i++) {
        // Offset a polar
        let r = size * Math.random();
        let theta = Math.random() * Math.PI * 2;

        let brightnessBump = Math.random() * 50 - 20;
        brightnessBump = 20 * Math.sin(t * 7);

        let opacity = Math.random() * 0.5 + 0.2;
        if (Math.random() > 0.5)
          p.fill(color0[0], color0[1], color0[2] + brightnessBump, opacity);
        else p.fill(color1[0], color1[1], color1[2] + brightnessBump, opacity);

        let circleSize = (Math.random() + 1) * size * 0.2;

        let x2 = x + r * Math.cos(theta);
        let y2 = y + r * Math.sin(theta);
        p.circle(x2, y2, circleSize);
      }
    },
  },
  */
  //======================================================

  /*
  {
    label: "💕",
    description: "Emoji scatter brush",
    show: false,
    isActive: true,

    mouseDragged(p, { color0, color1, brushSize }) {
      let hearts = ["💙", "🧡", "💛", "💖", "💚", "💜"];
      console.log("Drag...");
      let x = p.mouseX;
      let y = p.mouseY;

      let size = 20;
      let count = 2;

      // Scale the cluster by how far we have moved since last frame
      // the "magnitude" of the (movedX, movedY) vector
      let distanceTravelled = p.mag(p.movedX, p.movedY);
      size = distanceTravelled * 2 + 10;

      // I often draw a shadow behind my brush,
      // it helps it stand out from the background
      p.noStroke();
      p.fill(0, 0, 0, 0.01);
      p.circle(x, y, size * 2);
      p.circle(x, y, size * 1);

      // Draw some emoji
      p.fill(1);

      for (var i = 0; i < count; i++) {
        // Offset a polar
        let r = size * Math.random();
        let theta = Math.random() * Math.PI * 2;
        p.textSize(size);
        let emoji = p.random(hearts);

        let x2 = x + r * Math.cos(theta);
        let y2 = y + r * Math.sin(theta);
        p.text(emoji, x2, y2);
      }
    },
  },
  */
  //======================================================
  /*
  {
    label: "🧵",
    show: false,
    isActive: true,
    description: "A continuous brush using curves",

    mousePressed(p, { color0, color1, brushSize }) {
      //       We need to store the points
      this.points = [];
      // We can start storing a new set of points when the mouse is pressed
    },

    mouseDragged(p, { color0, color1, brushSize }) {
      let x = p.mouseX;
      let y = p.mouseY;
      // Add a new point to the beginning of this list
      this.points.unshift([x, y]);

      p.noFill();
      p.stroke(color0[0], color0[1], color0[2] + 50 * Math.random(), 0.8);
      p.beginShape();

      // Take every...10th? point
      // What happens if you change this
      this.points
        .filter((pt, index) => index % 10 == 0)
        .forEach(([x, y]) => {
          let dx = 0;
          let dy = 0;

          //         What happens if we offset the x and y we are drawing?
          dx = Math.random() * 100;
          dy = Math.random() * 10;

          p.curveVertex(x + dx, y + dy);
        });

      p.endShape();
    },
  }, 
  */
  //======================================================
  /*
  {
    label: "🌱",
    show: false,
    isActive: true,
    description:
      "Growing brush, leaves behind a trail that .... moves each frame!",

    setup() {
      // Store all the points this brush has made
      this.points = [];
    },

    mouseDragged(p, { color0, color1, brushSize }) {
      // Every time we move
      // Add a new point to the beginning of this list
      let x = p.mouseX;
      let y = p.mouseY;
      let pt = [x, y];

      // How long does this dot live?
      pt.totalLifespan = 10 + Math.random() * 10;

      // Try a longer lifespan 😉
      // pt.totalLifespan = 10 + Math.random()*100;

      pt.lifespan = pt.totalLifespan;
      this.points.push(pt);

      p.circle(x, y, 4);
    },

    draw(p, { color0, color1, brushSize }) {
      let radius = 5;
      let t = p.millis() * 0.001;

      // Each point keeps drawing itself, as long as it has a lifespan
      this.points.forEach((pt, index) => {
        //
        pt.lifespan--;

        if (pt.lifespan > 0) {
          let pctLife = pt.lifespan / pt.totalLifespan;
          let r = radius * 0.5;
          let theta = p.noise(index, t * 0.1) * 100;

          // Grow in some direction
          pt[0] += r * Math.cos(theta);
          pt[1] += r * Math.sin(theta);

          p.noStroke();
          p.fill(color0[0], color0[1], color0[2] * 0.1, 0.1);
          p.circle(...pt, pctLife * radius * 2);

          p.fill(
            color0[0] + p.noise(index) * 40,
            color0[1],
            color0[2] * (1 - pctLife)
          );

          //           Get smaller at the end of your life
          p.circle(...pt, pctLife ** 0.2 * radius);
        }
      });
    },
  },
  */
];
