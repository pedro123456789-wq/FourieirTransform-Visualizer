class FourierRepresentation{
  constructor(bounds, dx, func, freqNumber){
    this.as = [];
    this.bs = [];
    this.lowerBound = -bounds;
    this.uppperBound = bounds;
    this.Dx = dx;
    this.f = func;
    this.frequenciesNumber = freqNumber;
    this.generateSeries()
  }

  toDegrees(radians){
    return (radians / Math.PI) * 180;
  }

  fIntegral(){
    let total = 0;

    for (let x = this.lowerBound; x < this.uppperBound; x += this.Dx){
      total += this.f(x) * this.Dx;
    }

    return total / (this.uppperBound * 2);
  }

  sinIntegral(n){
    let total = 0;

    for (let x = this.lowerBound; x < this.uppperBound; x += this.Dx){
      total += this.f(x) * Math.sin(this.toDegrees((n * x * Math.PI) / this.uppperBound));
    }

    return total / this.uppperBound;
  }

  cosIntegral(n){
    let total = 0;

    for (let x = this.lowerBound; x < this.uppperBound; x += this.Dx){
      total += this.f(x) * Math.cos(this.toDegrees((n * x * Math.PI) / this.uppperBound));
    }

    return total / this.uppperBound;
  }


  generateSeries(){
    this.as.push(this.fIntegral())

    for (let i = 1; i < this.frequenciesNumber; i++){
      this.as.push(this.cosIntegral(i));
      this.bs.push(this.sinIntegral(i));
    }
  }

  getOutput(x){
    let total = this.as[0]

    for (let i = 0; i < this.bs.length; i++){
      total += this.as[i + 1] * Math.cos(this.toDegrees((i * x * Math.PI) / this.uppperBound));
      total += this.bs[i] * Math.sin(this.toDegrees((i * x * Math.PI) / this.uppperBound));
    }

    return total;
  }

  generateData(){
    let data = [];

    for (let x = this.lowerBound; x < this.uppperBound; x += this.Dx){
      data.push({x: x, y: this.getOutput(x)});
    }

    return data;
  }
}


generateData = (f, bound, dx) => {
  let data = [];

  for (let x = -bound; x < bound; x += dx){
    data.push({x: x, y: f(x)});
  }

  return data;
}

// https://srdas.github.io/MLBook/Fourier.html
// improve performance of f(x) https://stackoverflow.com/questions/29766991/javascript-eval-method-is-degrading-the-performance-while-filtering
console.log(Math.sin(Math.PI));

function updateGraph(){
  let functionString = document.getElementById('function').value;
  let f = (x) => {
    return eval(functionString);
  };

  let termNumber = document.getElementById('coeffs').value;
  let domain = document.getElementById('domain').value;
  let fourier = new FourierRepresentation(domain, 0.01, f, termNumber);

  new Chart("myChart", {
      type: "scatter",
      data: {
          datasets: [
          {
            pointRadius: 4,
            pointBackgroundColor: "rgb(0,0,255)",
            data: generateData(f, domain, 0.1)
          }, 
          {
            pointRadius: 4, 
            pointBackgroundColor: "rgb(255, 0, 0)", 
            data: fourier.generateData()
          }
        ]
      },
      options: {
          legend: { display: false },
      }
    }
  );
}


updateGraph();