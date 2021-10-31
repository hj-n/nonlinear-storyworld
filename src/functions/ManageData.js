

class ManageData {
  constructor(data) {
    this.data = data;
    this.mainIdx = 0;
    this.drawData = null;
    this.xMax = 0;
    this.yMax = 0;
  }

  parse() {
    this.xPivots = getPivot(this.data);
    this.xMax = this.xPivots[this.xPivots.length - 1];
    rearrangeSeqs(this.xPivots, this.data);
  }

  setDrawData() {
    this.drawData = cloneArray(this.data);
    const mainSeq = this.data[this.mainIdx].seq;

    const ratios = []
    let currY = 0;
    for (let i = 0; i < this.xPivots.length; i++) {
      if (i === 0) { ratios.push(1) }
      else {
        ratios.push(this.xPivots[i] / currY);
      }
      if (i !== this.xPivots.length - 1) currY += mainSeq[i][1];
    }

    this.drawData.forEach((datum, i) => {
      let ySum = 0;
      let currYSum = 0;
      if (i === this.mainIdx) { datum.seq.forEach(step => { 
        const currStep = Math.abs(step[0][0] - step[0][1]);
        step[1] = [ySum, ySum + currStep];
        ySum += currStep;
        
      }); }
      else { 
        datum.seq.forEach((step, j) =>  {
          const nextYSum = currYSum + step[1];
          const starting = currYSum * ratios[j];
          const ending   = nextYSum * ratios[j + 1];
          currYSum = nextYSum;
          ySum = ending;
          
          step[1] = [starting, ending]
      }); }
      this.yMax = ySum > this.yMax ? ySum : this.yMax;
    });
  }

  getDrawData() {
    return [this.drawData, this.xMax, this.yMax];
  }

  changeMainIdx(name) {
    this.data.forEach((d, i) => { 
      if (d.name === name) this.mainIdx = i;
    });
  }

}

function rearrangeSeqs(xPivots, data) {
  data.forEach(datum => {
    const seq = datum.seq;
    const rearrangedSeq = [];
    seq.forEach(step => {
      const indices = step[0].map(d => xPivots.indexOf(d));
      const stepX = step[0][1] - step[0][0];
      const stepY = step[1];
      let start, end, change;
      if (indices[0] < indices[1]) { start = indices[0]; end = indices[1]; change = 1;  }
      else                         { start = indices[1]; end = indices[0]; change = -1; }
      for (let i = start; i != end; i = i + change) {
        const newX = [xPivots[i], xPivots[i + 1]];
        const newY = (stepY / stepX) * (newX[1] - newX[0]);
        rearrangedSeq.push([newX, newY]);
      }
    })
    datum.seq = rearrangedSeq;
  });

}

function getPivot(data) {
  const xPivots = data.reduce((acc, curr, i) => {
    curr.seq.forEach(ele => {
      acc.add(ele[0][0]);
      acc.add(ele[0][1])
    });
    return acc;
  }, new Set());
  return Array.from(xPivots).sort((a, b) => a - b);

}

function cloneArray(arr) {
  return JSON.parse(JSON.stringify(arr ))
}

export default ManageData;