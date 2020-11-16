let data = {
  range: {
    min: 0,
    max: 4,
  },
  meta: {
    title: 'UX Discipline Profile',
    dimensions: 'IxD,u7y,UI,IA,UxW,R:G,R:E,CS,AX,a11y,FED'.split(','),
  },
  profiles: [
    {
      name: 'Target',
      excludeFromAggregate: true,
      values: [
        {
          label: 'IxD',
          value: 4,
        },
        {
          label: 'R:E',
          value: 3,
        },
        {
          label: 'UI',
          value: 2,
        },
        {
          label: 'AX',
          value: 1,
        },
        {
          label: 'IA',
          value: 3,
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
          value: 3,
        },
        {
          label: 'u7y',
          value: 4,
        },
        {
          label: 'a11y',
          value: 2,
        },
        {
          label: 'FED',
          value: 2,
        },
      ],
    },
    {
      name: 'Alex',
      excludeFromAggregate: false,
      values: [
        {
          label: 'IxD',
          value: 4,
        },
        {
          label: 'FED',
          value: 3,
        },
        {
          label: 'R:E',
          value: 3,
        },
        {
          label: 'UI',
          value: 2,
        },
        {
          label: 'AX',
          value: 3,
        },
        {
          label: 'IA',
          value: 3,
        },
        {
          label: 'CS',
          value: 2,
        },
        {
          label: 'UxW',
          value: 3,
        },
        {
          label: 'R:G',
          value: 3,
        },
        {
          label: 'u7y',
          value: 3,
        },

        {
          label: 'a11y',
          value: 2,
        },
      ],
    },
    {
      name: 'Becca',
      values: [
        {
          label: 'IxD',
          value: 2,
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
          value: 0,
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
          value: 1,
        },
        {
          label: 'R:G',
          value: 2,
        },
        {
          label: 'u7y',
          value: 2,
        },

        {
          label: 'a11y',
          value: 0,
        },
      ],
    },

  ],
};

class ProfileGraph {
  constructor(dimensions, center, range, parent) {
    this.dimensions = dimensions; // [ ]: string
    this.angle = 360 / dimensions.length;
    this.center = center; // { x: x', y: y' }
    this.range = range; // { min: n, max: m }
    this.ctx = this.setupCanvas(parent);

    this.getDimensionIndexFromLabel = (label) => this.dimensions.indexOf(label);
  }

  setupCanvas(parent) {
    this.canvas = document.createElement('canvas');
    (parent || document).appendChild(this.canvas);

    // Get the device pixel ratio, falling back to 1.
    var dpr = window.devicePixelRatio || 1;
    // Get the size of the canvas in CSS pixels.
    var rect = this.canvas.getBoundingClientRect();
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    var ctx = this.canvas.getContext('2d');
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    return ctx;
  }

  titleCanvas(title) {
    this.canvas.setAttribute('title', title);
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
    this.ctx.beginPath();
    for (var i = 0, len = vals.length; i < len; i++) {
      var pt = this.calcChartPointForDimension(
        40,
        vals[i].value,
        vals[i].label
      );
      if (i == 0) {
        this.ctx.moveTo(this.center.x + pt.x, this.center.y + pt.y);
      } else {
        this.ctx.lineTo(this.center.x + pt.x, this.center.y + pt.y);
      }
    }
    this.ctx.closePath();
    this.ctx.fillStyle = "rgb(128, 255, 149)"
    this.ctx.fill();

    // this.ctx.lineJoin = "round";
    // this.ctx.strokeStyle = "rgb(0, 255, 0)";
    // this.ctx.lineWidth = 4;
    // this.ctx.stroke();
  }

  drawChartDimensionValues(vals) {
    this.ctx.beginPath();
    for (var i = 0, len = vals.length; i < len; i++) {
      var pt = this.calcChartPointForDimension(
        40,
        vals[i].value,
        vals[i].label
      );
      this.ctx.moveTo(
        this.center.x,
        this.center.y
      );
      this.ctx.lineTo(
        this.center.x + pt.x,
        this.center.y + pt.y
      );
    }
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "rgb(0,0,0)";
    this.ctx.stroke()
  }

  calcChartPointForDimension(magnitude, value, label) {
    let i = this.getDimensionIndexFromLabel(label);
    let length = magnitude * value;
    let theta = ((-90 + this.angle * i) * Math.PI) / 180;
    return {
      x: length * Math.cos(theta),
      y: length * Math.sin(theta),
    };
  }

  getLabelPosition(label) {
    let pt = this.calcChartPointForDimension(45, this.range.max, label);
    let txt = this.ctx.measureText(label);
    return {
      x: pt.x - txt.width / 2,
      y: pt.y + 14 / 2,
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

      this.ctx.moveTo(this.center.x, this.center.y);
      this.ctx.lineTo(this.center.x + pt.x, this.center.y + pt.y);

      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = 'rgb(236,236,236)';
      this.ctx.stroke();

      var pos = this.getLabelPosition(this.dimensions[i]);
      this.ctx.fillStyle = 'rgb(32,32,32)';
      this.ctx.font = '14px sans-serif';
      this.ctx.fillText(
        this.dimensions[i],
        this.center.x + pos.x,
        this.center.y + pos.y
      );
    }
  }
}

function draw(parent) {
  let w = 400, h = 400;

  /**
   * Draw the BLENDED version that merges all profiles
   */
  let pg = new ProfileGraph(
    data.meta.dimensions,
    { x: w / 2, y: h / 2 },
    data.range,
    parent
  );

  // Create a consolidated dataset.
  var consolidatedProfile = [];
  var maximums = {};
  var temp = [];
  for (var n = 0, len = data.profiles.length; n < len; n++) {
    if (!!!data.profiles[n].excludeFromAggregate) {
      temp = [...temp, ...data.profiles[n].values];
    }
  }
  temp.forEach(function(i) {
    if (maximums[i.label] !== undefined) {
      maximums[i.label] = Math.max(maximums[i.label], i.value);
    } else {
      maximums[i.label] = i.value;
    }
  })
  for (var prop in maximums) {
    consolidatedProfile.push({ label: prop, value: maximums[prop]});
  } 

  // Draw and label lines out from the center as the base
  pg.drawDimensions();

  // Describe the look of the polygon
  pg.drawChartPolygon(consolidatedProfile);

  // Draw lines out from the center
  pg.drawChartDimensionValues(consolidatedProfile);
  pg.titleCanvas('Everyone');

  // Draw each of the profiles separately.
  for (var n = 0, len = data.profiles.length; n < len; n++) {
    var pgi = new ProfileGraph(
      data.meta.dimensions,
      { x: w / 2, y: h / 2 },
      data.range,
      parent
    );
  
    // Draw and label lines out from the center as the base
    pgi.drawDimensions();

    // Draw the profile polygon
    pgi.drawChartPolygon(data.profiles[n].values);
  
    // Draw lines out from the center
    pgi.drawChartDimensionValues(data.profiles[n].values);
    pgi.titleCanvas(data.profiles[n].name);
  }
}

window.onload = function (e) {
  // let canvas = document.getElementById('cnvs-main');
  // let ctx = setupCanvas(canvas);

  draw(document.getElementById('main'));
};
