let data = {
    config: {
      min: 0,
      max: 4,
    },
    meta: {
      title: "UX Discipline Profile"
    },
    values: [{
        label: "IxD",
        value: 3
      },
      {
        label: "UI",
        value: 1
      },
      {
        label: "AX",
        value: 2
      },
      {
        label: "IA",
        value: 2
      },
      {
        label: "CS",
        value: 2
      },
      {
        label: "UxW",
        value: 2
      },
      {
        label: "R:G",
        value: 2
      },
      {
        label: "R:E",
        value: 3
      },
      {
        label: "u7y",
        value: 3
      },
      {
        label: "a11y",
        value: 3
      },
    ]
  };
  let center = {
    x: null,
    y: null
  }
  let g_textSize = 14;
  
  function setup() {
    createCanvas(400, 400);
    center.x = width / 2;
    center.y = height / 2;
    angleMode(DEGREES);
    textSize(g_textSize);
    strokeCap(SQUARE);
    strokeJoin(ROUND);
    noLoop();
  }
  
  function draw() {
    background(255);
  
    let n = data.values.length;
    let deg = 360 / n;
    let chartPoints = [];
    for (i = 0; i < n; i++) {
      chartPoints.push(calcChartPointForDimension(40, data.values[i].value, i, n));
    }
    console.log(chartPoints);
  
    // Draw lines out from the center as the base
    strokeWeight(3);
    stroke(192);
    for (i = 0; i < n; i++) {
      var x = (40 * data.config.max) * cos(deg * i);
      var y = (40 * data.config.max) * sin(deg * i);
      line(center.x, center.y, center.x + x, center.y + y);
    }
  
    // Describe the look of the polygon
    noStroke();
    fill('rgba(0,255,0, .8)');
    drawChartPolygon(chartPoints);
  
  
    // Draw lines out from the center
    stroke(0)
    drawChartDimensionValues(chartPoints);
  
    noStroke();
    fill(32);
    for (i = 0; i < n; i++) {
      var pos = getLabelPosition(data.values[i].label, deg * i);
      text(data.values[i].label, pos.x, pos.y);
    }
  }
  
  function calcChartPointForDimension(magnitude, value, dimension_index, dimension_count) {
    let deg = 360 / dimension_count;
    return {
        x: (magnitude * value) * cos(deg * dimension_index),
        y: (magnitude * value) * sin(deg * dimension_index),
      }
  }
  
  function drawChartDimensionValues(vals) {
    for (i = 0, len = vals.length; i < len; i++) {
      line(center.x, center.y, center.x + vals[i].x, center.y + vals[i].y);
    }
  }
  
  function drawChartPolygon(vals) {
    let len = vals.length;
    // Draw the polygon
    beginShape();
    for (i = 0; i < len; i++) {
      vertex(center.x + vals[i].x, center.y + vals[i].y);
    }
    endShape(CLOSE);
  }
  
  
  function getLabelPosition(label, angle) {
    // calcChartPointForDimension(45, data.config.max, i, n)
    let ox = (45 * data.config.max) * cos(angle);
    let oy = (45 * data.config.max) * sin(angle);
    return {
      x: center.x + ox - (textWidth(label) / 2),
      y: center.y + oy + (g_textSize / 2)
    };
  }