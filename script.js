const COUNT=5;
const palette=document.getElementById("palette");
const toast=document.getElementById("toast");

let colors=Array.from({length:COUNT},()=>({hex:rand(),lock:false}));

function rand(){
  return "#"+Math.floor(Math.random()*16777215).toString(16).padStart(6,"0").toUpperCase();
}

function rgb(h){
  let r=parseInt(h.substr(1,2),16),
      g=parseInt(h.substr(3,2),16),
      b=parseInt(h.substr(5,2),16);
  return `rgb(${r}, ${g}, ${b})`;
}

function show(t){
  toast.textContent=t;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),1200);
}

function draw(){
  palette.innerHTML="";

  colors.forEach(c=>{
    if(!c.lock) c.hex = rand();

    const col=document.createElement("div");
    col.className="color-column";
    col.style.background=c.hex;

    const info=document.createElement("div");
    info.className="color-info";

    const hex=document.createElement("div");
    hex.innerHTML=`<b>${c.hex}</b><br>${rgb(c.hex)}`;

    const copy=document.createElement("button");
    copy.textContent="Copy";
    copy.onclick=(e)=>{
      e.stopPropagation();
      navigator.clipboard.writeText(c.hex);
      show("Copied "+c.hex);
    };

    const lock=document.createElement("button");
    lock.textContent=c.lock?"🔒 Locked":"🔓 Lock";
    lock.onclick=(e)=>{
      e.stopPropagation();
      c.lock=!c.lock;
      draw();
    };

    info.append(hex,copy,lock);
    col.append(info);
    palette.append(col);
  });
}

document.getElementById("generate-btn").onclick=draw;

document.getElementById("theme-btn").onclick=()=>{
  document.body.classList.toggle("dark");
};

document.getElementById("save-btn").onclick=()=>{
  localStorage.setItem("palette",JSON.stringify(colors));
  show("Saved!");
};

function loadSaved(){
  const data=JSON.parse(localStorage.getItem("palette")||"[]");
  if(!data.length) return;

  const box=document.getElementById("saved-palettes");
  box.innerHTML="";

  const row=document.createElement("div");
  row.className="saved-item";

  data.forEach(c=>{
    const d=document.createElement("div");
    d.style.background=c.hex;
    row.appendChild(d);
  });

  box.appendChild(row);
}

document.getElementById("gradient-btn").onclick=()=>{
  const text=`background: linear-gradient(90deg, ${colors.map(c=>c.hex).join(", ")});`;
  document.getElementById("gradient-output").value=text;
  document.getElementById("gradient-modal").classList.remove("hidden");
};

document.getElementById("export-css-btn").onclick=()=>{
  const css=":root{\n"+colors.map((c,i)=>`  --color${i+1}: ${c.hex};`).join("\n")+"\n}";
  document.getElementById("css-output").value=css;
  document.getElementById("css-modal").classList.remove("hidden");
};

document.getElementById("download-btn").onclick=()=>{
  html2canvas(document.getElementById("palette")).then(canvas=>{
    const a=document.createElement("a");
    a.download="palette.png";
    a.href=canvas.toDataURL();
    a.click();
  });
};

["gradient","css"].forEach(id=>{
  document.getElementById("close-"+id).onclick=()=>{
    document.getElementById(id+"-modal").classList.add("hidden");
  };

  document.getElementById("copy-"+id).onclick=()=>{
    const t=document.getElementById(id+"-output");
    navigator.clipboard.writeText(t.value);
    show("Copied!");
  };
});

window.addEventListener("keydown",(e)=>{
  if(e.code==="Space"){
    e.preventDefault();
    draw();
  }
  if(e.key==="l"){
    colors.forEach(c=>c.lock=true);
    draw();
  }
  if(e.key==="u"){
    colors.forEach(c=>c.lock=false);
    draw();
  }
  if(e.key==="c"){
    navigator.clipboard.writeText(colors.map(c=>c.hex).join(", "));
    show("Copied palette");
  }
});

draw();
loadSaved();