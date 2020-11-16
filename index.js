let data = {
  range: {
    min: 0,
    max: 4,
  },
  meta: {
    title: 'UX Discipline Profile',
    dimensions: 'IxD,R:G,IA,R:E,u7y,a11y,UI,UxW,CS,AX,FED'.split(','),
  },
  profiles: [
    {
      name: 'Interaction Designer',
      values: [
        {
          label: 'IxD',
          value: 4,
        },
        {
          label: 'R:E',
          value: 2,
        },
        {
          label: 'UI',
          value: 2,
        },
        {
          label: 'AX',
          value: 4,
        },
        {
          label: 'IA',
          value: 1,
        },
        {
          label: 'CS',
          value: 0,
        },
        {
          label: 'UxW',
          value: 2,
        },
        {
          label: 'R:G',
          value: 1,
        },
        {
          label: 'u7y',
          value: 3,
        },

        {
          label: 'a11y',
          value: 0,
        },
      ],
    },
    {
      name: 'Brian',
      values: [
        {
          label: 'IxD',
          value: 1,
        },
        {
          label: 'R:E',
          value: 1,
        },
        {
          label: 'UI',
          value: 4,
        },
        {
          label: 'AX',
          value: 1,
        },
        {
          label: 'IA',
          value: 1,
        },
        {
          label: 'CS',
          value: 1,
        },
        {
          label: 'UxW',
          value: 1,
        },
        {
          label: 'R:G',
          value: 1,
        },
        {
          label: 'u7y',
          value: 1,
        },

        {
          label: 'a11y',
          value: 1,
        },
      ],
    },
    {
      name: 'Chris the Usability Specialist',
      values: [
        {
          label: 'IxD',
          value: 0,
        },
        {
          label: 'R:E',
          value: 3,
        },
        {
          label: 'UI',
          value: 1,
        },
        {
          label: 'AX',
          value: 3,
        },
        {
          label: 'IA',
          value: 2,
        },
        {
          label: 'CS',
          value: 1,
        },
        {
          label: 'UxW',
          value: 1,
        },
        {
          label: 'R:G',
          value: 2,
        },
        {
          label: 'u7y',
          value: 4,
        },
        {
          label: 'a11y',
          value: 3,
        },
      ],
    },
  ],
};

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
  textSize(14);
  strokeCap(SQUARE);
  strokeJoin(ROUND);
  noLoop();
}

function draw() {
  background(255);

  let pg = new ProfileGraph(
    data.meta.dimensions,
    { x: width / 2, y: height / 2 },
    data.range
  );

  // Draw and label lines out from the center as the base

  pg.drawDimensions();

  for (var n = 0, len = data.profiles.length; n < len; n++) {
    // Describe the look of the polygon
    noStroke();
    // stroke(255);
    fill('rgba(0, 255, 128, .5)');
    pg.drawChartPolygon(data.profiles[n].values);

  }

  // Draw lines out from the center
  for (var n = 0, len = data.profiles.length; n < len; n++) {
    stroke(0);
    strokeWeight(5);
    pg.drawChartDimensionValues(data.profiles[n].values);
  }
}

class ProfileGraph {
  constructor(dimensions, center, range) {
    this.dimensions = dimensions; // [ ]: string
    this.angle = 360 / dimensions.length;
    this.center = center; // { x: x', y: y' }
    this.range = range; // { min: n, max: m }

    this.getDimensionIndexFromLabel = (label) => this.dimensions.indexOf(label);
  }

  drawChartPolygon(_vals) {
    // Setup a zero-out array for all of the dimensions and then
    // fill the known values.
    let vals = [];
    for (var n = 0, len = this.dimensions.length; n < len; n++) {
      vals.push({
        label: this.dimensions[n],
        value: 0,
      });
    }

    for (var n = 0, len = _vals.length; n < len; n++) {
      var i = this.getDimensionIndexFromLabel(_vals[n].label);
      if (i !== undefined) {
        vals[i].value = _vals[n].value;
      }
    }
    // SORT
    // let len = _vals.length;
    // let self = this;
    // // Sort the vals so they're in the right order
    // let vals = _vals.sort(function (a, b) {
    //   let a_i = self.getDimensionIndexFromLabel(a.label);
    //   let b_i = self.getDimensionIndexFromLabel(b.label);
    //   if (a_i < b_i) return -1;
    //   if (a_i > b_i) return 1;
    //   return 0;
    // });

    // Draw the polygon
    beginShape();
    for (var i = 0, len = vals.length; i < len; i++) {
      var pt = this.calcChartPointForDimension(
        40,
        vals[i].value,
        vals[i].label
      );
      vertex(this.center.x + pt.x, this.center.y + pt.y);
    }
    endShape(CLOSE);
  }

  drawChartDimensionValues(vals) {
    for (var i = 0, len = vals.length; i < len; i++) {
      var pt = this.calcChartPointForDimension(
        40,
        vals[i].value,
        vals[i].label
      );

      stroke(2);
      line(
        this.center.x,
        this.center.y,
        this.center.x + pt.x,
        this.center.y + pt.y
      );
    }
  }

  calcChartPointForDimension(magnitude, value, label) {
    let i = this.getDimensionIndexFromLabel(label);
    let length = magnitude * value;
    let theta = -90 + this.angle * i;
    return {
      x: length * cos(theta),
      y: length * sin(theta),
    };
  }
  getLabelPosition(label) {
    let pt = this.calcChartPointForDimension(45, this.range.max, label);
    return {
      x: pt.x - textWidth(label) / 2,
      y: pt.y + textSize() / 2,
    };
  }

  drawDimensions() {
    let n = this.dimensions.length;
    for (var i = 0; i < n; i++) {
      var pt = this.calcChartPointForDimension(
        40,
        this.range.max,
        this.dimensions[i]
      );

      strokeWeight(2);
      stroke(192);
      line(
        this.center.x,
        this.center.y,
        this.center.x + pt.x,
        this.center.y + pt.y
      );
      noStroke();
      fill(32);
      var pos = this.getLabelPosition(this.dimensions[i]);
      text(this.dimensions[i], this.center.x + pos.x, this.center.y + pos.y);
    }
  }
}
