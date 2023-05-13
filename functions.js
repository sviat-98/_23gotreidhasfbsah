
function updateDemoColors(colorFront, colorBack) {
    const demo = document.querySelector("#sample-text");
    const demo2 = document.querySelector("#sample-text2");
    const demoGraphic1 = document.querySelector("#sample-graphic1");
    const demoGraphic2 = document.querySelector("#sample-graphic2");


    demo.style.color = `rgb(${colorFront.toString()})`;
    demo.style.backgroundColor = `rgb(${colorBack.toString()})`;
    demo2.style.color = `rgb(${colorFront.toString()})`;
    demo2.style.backgroundColor = `rgb(${colorBack.toString()})`;
    demoGraphic1.style.backgroundColor = `rgb(${colorBack.toString()})`;
    demoGraphic2.style.fill = `rgb(${colorFront.toString()})`;

  }
  
  /* the following functions are adapted from https://stackoverflow.com/a/9733420/3695983 */
  function luminanace(r, g, b) {
    var a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928
        ? v / 12.92
      : Math.pow( (v + 0.055) / 1.055, 2.4 );
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }


  let contrastRatio;
  let contrastRatioMath;

  function contrast(rgb1, rgb2) {
    const luminanceFront = luminanace(rgb1[0], rgb1[1], rgb1[2]);
    const luminanceBack  = luminanace(rgb2[0], rgb2[1], rgb2[2]);
    contrastRatioMath = ((Math.max(luminanceFront, luminanceBack) + 0.05) / (Math.min(luminanceFront, luminanceBack) + 0.05));
    contrastRatio = contrastRatioMath.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    return luminanceBack > luminanceFront 
      ? ((luminanceFront + 0.05) / (luminanceBack + 0.05))
      : ((luminanceBack + 0.05) / (luminanceFront + 0.05));
  }


  
  function updateBoxesColors(colorFront, colorBack) {
    const ratio = contrast(colorFront, colorBack);
    document.querySelector("#aa-normal").className  = ratio < 0.22222 ? "" : " fail";
    document.querySelector("#aa-large").className   = ratio < 0.33333 ? "" : " fail";
    document.querySelector("#aaa-normal").className = ratio < 0.14285 ? "" : " fail";
    document.querySelector("#aaa-large").className  = ratio < 0.22222 ? "" : " fail";
    document.querySelector("#aa-graphic").className = ratio < 0.33333 ? "" : " fail";
    document.querySelector("#aaa-graphic").className = ratio < 0.33333 ? "" : " fail";

    document.getElementById("contrast-value").innerHTML = contrastRatio;

    const totalWrong = document.querySelectorAll(".fail").length;
    let character = document.querySelector("#character-img");

    
    switch(totalWrong) {
      case 0:
      case 1:
      case 2:
        character.setAttribute("src", "Good.svg");
        break;
      case 3: 
        character.setAttribute("src", "Normal.svg");
        break;
      case 4: 
      case 5: 
      case 6: 
        character.setAttribute("src", "Bad.svg");
        break;
    }
  }
  
  function updateHex(colorFront, colorBack) {
    const colorFrontHex = colorFront.map(function(el) { return Number(el).toString(16).padStart(2, "0").toUpperCase(); });
    const colorBackHex = colorBack.map(function(el) { return Number(el).toString(16).padStart(2, "0").toUpperCase(); });
    document.querySelector("#color-1-hex").value = `#${colorFrontHex.join('')}`;
    document.querySelector("#color-2-hex").value = `#${colorBackHex.join('')}`
  }


  
  function updateColors() {
    const colorFront = [ 
      document.querySelector("#color-1-r").value,
      document.querySelector("#color-1-g").value,
      document.querySelector("#color-1-b").value,

    ];
    const colorBack = [
      document.querySelector("#color-2-r").value,
      document.querySelector("#color-2-g").value,
      document.querySelector("#color-2-b").value
    ];
  
    updateDemoColors(colorFront, colorBack);
    updateBoxesColors(colorFront, colorBack);
    updateHex(colorFront, colorBack);
    
  }
  
  document.querySelectorAll("input[type='number'], input[type='range']").forEach(function(el) {
    el.addEventListener("input", function() {
      if (this.type === "range") {
        this.nextElementSibling.value = this.value;
      } else if (this.type === "number") {
        this.previousElementSibling.value = this.value;
      }
      updateColors();
      document.querySelector("#hex-foreground").value = document.querySelector("#color-1-hex").value;
      document.querySelector("#hex-background").value = document.querySelector("#color-2-hex").value;
    });
  });



  document.querySelectorAll("input[type='text']").forEach(function(el) {
    el.addEventListener("keypress", function(keyIs) {
      if(keyIs.key === 'Enter'){
        let val = this.value;
      let wrongValue = false;
      if (val[0] === "#") val = val.substring(1);
      if (val.length === 3 || val.length === 6) {
        if (val.length === 3) {
          val = `${val[0]}${val[0]}${val[1]}${val[1]}${val[2]}${val[2]}`;
        }
        if (val.match(/[0-9A-Fa-f]{6}/)) {
          const red = parseInt(`${val[0]}${val[1]}`, 16);
          const green = parseInt(`${val[2]}${val[3]}`, 16);
          const blue = parseInt(`${val[4]}${val[5]}`, 16);
          const target = this.dataset.target;
          
          document.getElementById(`number-${target}-r`).value = red;
          document.getElementById(`number-${target}-g`).value = green;
          document.getElementById(`number-${target}-b`).value = blue;
          document.getElementById(`color-${target}-r`).value = red;
          document.getElementById(`color-${target}-g`).value = green;
          document.getElementById(`color-${target}-b`).value = blue;
          
          updateColors();
          document.querySelector("#hex-foreground").value = document.querySelector("#color-1-hex").value;
          document.querySelector("#hex-background").value = document.querySelector("#color-2-hex").value;
        } else {
          wrongValue = true;
        }
      } else {
        wrongValue = true;
      }
      
      if (wrongValue){
        const colorFront = [ 
          document.querySelector("#color-1-r").value,
          document.querySelector("#color-1-g").value,
          document.querySelector("#color-1-b").value
        ];
        const colorBack = [
          document.querySelector("#color-2-r").value,
          document.querySelector("#color-2-g").value,
          document.querySelector("#color-2-b").value
        ];
        updateHex(colorFront, colorBack)
        document.querySelector("#hex-foreground").value = document.querySelector("#color-1-hex").value;
        document.querySelector("#hex-background").value = document.querySelector("#color-2-hex").value;
      }
      }
    });
  })

  document.querySelectorAll("input[type='text']").forEach(function(el) {
    el.addEventListener("blur", function() {
      let val = this.value;
      let wrongValue = false;
      if (val[0] === "#") val = val.substring(1);
      if (val.length === 3 || val.length === 6) {
        if (val.length === 3) {
          val = `${val[0]}${val[0]}${val[1]}${val[1]}${val[2]}${val[2]}`;
        }
        if (val.match(/[0-9A-Fa-f]{6}/)) {
          const red = parseInt(`${val[0]}${val[1]}`, 16);
          const green = parseInt(`${val[2]}${val[3]}`, 16);
          const blue = parseInt(`${val[4]}${val[5]}`, 16);
          const target = this.dataset.target;
          
          document.getElementById(`number-${target}-r`).value = red;
          document.getElementById(`number-${target}-g`).value = green;
          document.getElementById(`number-${target}-b`).value = blue;
          document.getElementById(`color-${target}-r`).value = red;
          document.getElementById(`color-${target}-g`).value = green;
          document.getElementById(`color-${target}-b`).value = blue;
          
          updateColors();
          document.querySelector("#hex-foreground").value = document.querySelector("#color-1-hex").value;
          document.querySelector("#hex-background").value = document.querySelector("#color-2-hex").value;
        } else {
          wrongValue = true;
        }
      } else {
        wrongValue = true;
      }
      
      if (wrongValue){
        const colorFront = [ 
          document.querySelector("#color-1-r").value,
          document.querySelector("#color-1-g").value,
          document.querySelector("#color-1-b").value
        ];
        const colorBack = [
          document.querySelector("#color-2-r").value,
          document.querySelector("#color-2-g").value,
          document.querySelector("#color-2-b").value
        ];
        updateHex(colorFront, colorBack)
      }
    });
  })


  
  document.querySelectorAll("input[type='color']").forEach(function(el) {
    el.addEventListener("input", function() {
        document.getElementById("color-2-hex").value = document.getElementById("hex-background").value;
        document.getElementById("color-1-hex").value = document.getElementById("hex-foreground").value;
     
        document.querySelectorAll("input[type='text']").forEach(function(elem) {
          let val = elem.value;
          let wrongValue = false;
          if (val[0] === "#") val = val.substring(1);
          if (val.length === 3 || val.length === 6) {
            if (val.length === 3) {
              val = `${val[0]}${val[0]}${val[1]}${val[1]}${val[2]}${val[2]}`;
            }
            if (val.match(/[0-9A-Fa-f]{6}/)) {
              const red = parseInt(`${val[0]}${val[1]}`, 16);
              const green = parseInt(`${val[2]}${val[3]}`, 16);
              const blue = parseInt(`${val[4]}${val[5]}`, 16);
              const target = elem.dataset.target;
              
              document.getElementById(`number-${target}-r`).value = red;
              document.getElementById(`number-${target}-g`).value = green;
              document.getElementById(`number-${target}-b`).value = blue;
              document.getElementById(`color-${target}-r`).value = red;
              document.getElementById(`color-${target}-g`).value = green;
              document.getElementById(`color-${target}-b`).value = blue;
              


            } else {
              wrongValue = true;
            }
          } else {
            wrongValue = true;
          }
          
          if (wrongValue){
            const colorFront = [ 
              document.querySelector("#color-1-r").value,
              document.querySelector("#color-1-g").value,
              document.querySelector("#color-1-b").value
            ];
            const colorBack = [
              document.querySelector("#color-2-r").value,
              document.querySelector("#color-2-g").value,
              document.querySelector("#color-2-b").value
            ];
            updateHex(colorFront, colorBack)

          }
        });
        updateColors();
       
      })
      


    });
    