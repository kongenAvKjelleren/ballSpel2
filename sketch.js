/* 
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>. 
*/

/* Variablar */

let rs = [];
class Skip {
  constructor(
    x,
    y,
    storleik,
    xFart,
    yFart,
    xRetning,
    yRetning,
    raudVerdi,
    groenVerdi,
    blaaVerdi,
    firkant
  ) {
    this.x = x;
    this.y = y;
    this.storleik = storleik;
    this.xFart = xFart;
    this.yFart = yFart;
    this.xRetning = xRetning;
    this.yRetning = yRetning;
    this.raudVerdi = raudVerdi;
    this.groenVerdi = groenVerdi;
    this.blaaVerdi = blaaVerdi;
    this.firkant = firkant;
  }
  
  teiknBall() {
    fill(this.raudVerdi, this.groenVerdi, this.blaaVerdi); /* Legg til ballens farge */
    
    if(!this.firkant)
      ellipse(this.x, this.y, this.storleik, this.storleik); /* Legg til ballen */
    else
      rect(this.x, this.y, this.storleik, this.storleik);
  }

  oppdaterPosisjon() {
    /* Hvis ballen går til den eine sida, teleporteras han til den andre */
    if (this.firkant) {
      if (this.x < 0 - this.storleik) this.x = windowWidth;
      else if (this.x >= windowWidth) this.x = 0 - this.storleik;
      
      if (this.y < 0) this.yRetning *= -1;
      else if (this.y >= windowHeight - this.storleik) {
        this.yRetning *= -1;
        this.y = windowHeight - this.storleik;
      }
      
    } else {

    if (this.x <= 0 - this.storleik / 2)
      this.x = windowWidth + this.storleik / 2;
    else if (this.x >= windowWidth + this.storleik / 2)
      this.x = 0 - this.storleik / 2;

    /* Hvis den treff tak eller golv, snur den retning */
    if (this.y <= 0 + this.storleik / 2) {
      this.yRetning *= -1;
      this.y = this.storleik/2;
    } else if (this.y >= windowHeight - this.storleik / 2) 
      this.yRetning *= -1;
    }
    
    /* Forskyv skipet sine korrdinater */
    this.x += this.xFart * this.xRetning;
    this.y += this.yFart * this.yRetning;
  }
  
  klikka() 
  {
      this.raudVerdi = random(0, 255);
      this.groenVerdi = random(0, 255);
      this.blaaVerdi = random(0, 255);
      this.xRetning *= -1; /* Reverser retning */
      this.yRetning *= -1; /*  */
      this.xFart++; /* Auk vannrett fart */
      this.yFart = random(0, 5); /* Sett loddrett fart til noko tilfeldeg */
      this.storleik = random(fellesStorleik * 0.7, fellesStorleik * 1.5); /* Tilfeldeg storleik */
      this.firkant = !this.firkant;
  }
}

let poeng = 0;
let bgFarge = 127;

let skipAntal = 3;
let fellesStorleik = 150;

/* Etabler skipa */
function
setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < skipAntal; i++) {
    rs[i] = new Skip(
      random(0, windowWidth), /* Tilfeldig posisjon */
      random(0 + fellesStorleik/2, windowHeight - fellesStorleik/2),
      fellesStorleik, /* Alle byrjar med same storleik */
      random(1,7), /* Tilfeldegt tal i hastigheit, i retning nordaust */
      random(1,7),
      1,
      1,
      random(0, 255), /* Tilfeldeg farge */
      random(0, 255),
      random(0, 255),
      false
    );
  }
}

function
draw() {
  background(bgFarge);
  
  for (let i = 0; i < skipAntal; i++) {
    /* Teikn kver ball for seg */
    rs[i].teiknBall();
    rs[i].oppdaterPosisjon(); /* Oppdater posisjon i forkant av neste oppdatering */
  }
  skrivTekst();
}



function
mouseReleased() {
  let klikka = false;
  for (let i = 0; i < skipAntal; i++) {
    let avstandBall = dist(rs[i].x, rs[i].y, mouseX, mouseY);
    
    if (!rs[i].firkant) {
      /* Hvis trykt på, utfør desse tinga på den trykte ballen */
      if (avstandBall < rs[i].storleik / 2) {
        klikka = true;
        rs[i].klikka();
        bgFarge = random(100, 200); /* Tilfeldeg bakgrunnsfarge */
        poeng++;
      }
    } else {
      if (mouseX > rs[i].x && mouseX < rs[i].x + rs[i].storleik && mouseY > rs[i].y && mouseY < (rs[i].y + rs[i].storleik)) {
        klikka = true;
        rs[i].klikka();
        bgFarge = random(100, 200); /* Tilfeldeg bakgrunnsfarge */
        poeng++;
      }
    }
  }

  /* Hvis ingen av ballane vart påtrykte, vil alle ballane senka fart, så lenge fart ikkje er 0 */
  if (!klikka)
    for (let i = 0; i < skipAntal; i++) {
      if (rs[i].xFart > 0) {
        rs[i].xFart--;
      }
      if (rs[i].yFart > 0) {
        rs[i].yFart--;
      }
    }
}

function
skrivTekst() {
  fill('white');
  text("Poeng: " + poeng, windowWidth / 2, windowHeight / 8, windowHeight / 4);
}
