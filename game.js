

function setup() {
  createCanvas(840, 1000);

  var sz = 7
    grille = new Grid(sz);
  grille.init();
  var i = 0;
  while ( i< sz)
  {
    grille.brique_appear();
    i++
  }
  grille.calculate();
  grille.display();
  i = 0;
  while ( i< sz)
  {
    grille.brique_appear();
    i++
  }
}
function draw() {
  background((10, 10, 40));
  grille.calculate();
  grille.display();
}

function Grid(sz) {
  this.n = sz;
  this.cell_w = floor(width/this.n);
  this.cell_h = floor(width/this.n);
  this.x_to_pix =[];
  this.y_to_pix =[];
  this.content = Array(this.n).fill(0).map(x => Array(this.n).fill(null));
  this.id = 0;
  this.mat = Array(this.n).fill(0).map(x => Array(this.n).fill(0));
  this.score = 0;


  this.init = function() {
    for (var i =0; i<this.n+2; i++)
    {
      this.x_to_pix[i] = floor(this.cell_w*i);
      this.y_to_pix[i] = floor(this.cell_h*i);
    }
  }

  this.calculate = function()
  {
    for (var j =0; j<this.n; j++)
    {
      for (var i=0; i<this.n; i++)
      {
        if (this.content[i][j] != null)
        {
          this.content[i][j].move();
          k=j;
          while (k < this.n-1 && this.content[i][k+1] == null ) //on calcule la position de la brique si elle peut tomber
          {
            this.content[i][k].fall();
            this.content[i][k+1] = this.content[i][k];
            this.content[i][k+1].posy = k+1;
            this.content[i][k] = null;
            k++;
          }
        }
      }
    }
  }

  this.display = function()
  {
    stroke(255); //WHAT IS STROKE ?
    for (var i =0; i<this.n+1; i++)
    {
      line(this.x_to_pix[0], this.y_to_pix[i], this.x_to_pix[this.n+1], this.y_to_pix[i]);
    }
    for (var i =0; i<this.n+1; i++)
    {
      line(this.x_to_pix[i], this.y_to_pix[0], this.x_to_pix[i], this.y_to_pix[this.n]);
    }

    for (var j =0; j<this.n; j++)
    {
      for (var i=0; i<this.n; i++)
      {
        if (this.content[i][j] != null)
        {
          this.content[i][j].display(); // on affiche la brique
        }
      }
    }
    //Affiche score:
    fill(255,255,255);
    textAlign(CENTER);
    textSize(36);
    text("Score : " + this.score, 420, 950);
  }

  this.brique_appear = function()
  {
    test= false;
    for (i =0; i < this.n; i++)
    {
      print(this.content[i][0]);
      test = ((this.content[i][0] == null) || test);   // test si la premiere ligne est pleine si oui perdu lol sinon on fait apparaitre
    }
    
    var rand6 = floor(random(0, this.n));
    
    while (this.content[rand6][0] != null && test)
    {
      rand6 = floor(random(0, this.n));
    }
    brk = new brique(rand6, this.n);
    brk.value = floor(random(2, 4));
    brk.posx = rand6;
    brk.fall();
    
    this.id++;
    this.content[rand6][0] = brk;
  }

  this.click = function() 
  {
    for (var j =0; j<this.n; j++)
    {
      for (var i=0; i<this.n; i++)
      {
        if (grille.content[i][j] != null)
        {
          brk = grille.content[i][j];
          if (mouseX > brk.x && mouseY > brk.y && mouseX <brk.x+brk.size && mouseY < brk.y + brk.size)
          {
            var l = grille.colles(brk);
            if (l.length >= brk.value)
            {
              this.score = this.score + brk.value*brk.value;
              grille.evolve(l);
              lo = max(this.n - 6,1);
              hi = this.n - 2; 
              var nw = floor(random(lo, hi));
              var i = 0;
              while (i < nw)
              {
                i++;
                grille.brique_appear();
              }
            }
          }
        }
      }
    }
  }

  this.voisin = function(brk) 
  {
    var lst = []

      //haut
      if (brk.posy != 0 && this.content[brk.posx][brk.posy-1] != null && this.content[brk.posx][brk.posy-1].value == brk.value )
    {
      append(lst, this.content[brk.posx][brk.posy-1])
    }
    //bas
    if (brk.posy != this.n -1 && this.content[brk.posx][brk.posy+1] != null && this.content[brk.posx][brk.posy+1].value == brk.value)
    {
      append(lst, this.content[brk.posx][brk.posy+1])
    }
    //droite
    if (brk.posx != this.n-1 && this.content[brk.posx+1][brk.posy] != null && this.content[brk.posx+1][brk.posy].value == brk.value)
    {
      append(lst, this.content[brk.posx+1][brk.posy]);
    }
    //gauche
    if (brk.posx != 0 && this.content[brk.posx-1][brk.posy] != null && this.content[brk.posx-1][brk.posy].value == brk.value)
    {
      append(lst, this.content[brk.posx-1][brk.posy]);
    }
    return lst;
  }


  this.colles = function(brk)
  {
    lst = [];
    suivants = [brk];
    while (suivants.length > 0)
    {
      c = suivants[0];
      suivants.splice(0, 1);
      if (this.mat[c.posx][c.posy] == 0)
      {
        this.mat[c.posx][c.posy] = 1;
        voisins = this.voisin(c);
        for (var i =0; i<voisins.length; i++)
        {
          if (this.mat[voisins[i].posx][voisins[i].posy] == 0)
          {
            append(suivants, voisins[i]);
          }
        }
        append(lst, c);
      }
    }

    //RESET FLAG
    for (var i=0; i<this.n; i++)
    {
      for (var j=0; j<this.n; j++)
      {
        this.mat[i][j] = 0;
      }
    }
    return lst;
  }

  this.evolve =function(l) {
    k = l[0];
    if (k.value < 9)
    {
      k.value +=1; //increase value of the clicked tile
    }
    l.splice(0, 1); // getting rid of the clicked tile

    j=1;
    while (l.length >0 && j < k.value-1) // getting rid of the other tiles of the list
    {
      elem = l[0];
      l.splice(0, 1);
      this.content[elem.posx][elem.posy] = null;
      j++;
    }
  }
}

function brique(r, n) {
  this.posy = 0;
  this.posx = r;
  this.id = 0;
  this.n = n;
  this.size = floor(width/this.n);
  this.x = r*this.size;
  this.y = -this.size;
  this.vy = 0;
  this.ay = 0;
  this.value = 0;
  this.col = [color(200, 100, 0), color(0, 100, 0), color(200, 0, 200), color(100, 100, 100), color(255, 50, 50), color(50, 100, 10), color(10, 0, 200), color(200, 50, 50), color(50, 50, 200), color(20, 50, 150) ];
  this.can_evolve = true;


  this.move = function()
  {
    if (this.y+this.vy<this.posy*this.size)
    {
      this.vy = this.vy+this.ay;
      this.y = this.y+this.vy;
    } else { 
      this.y = this.posy*this.size;
      this.stop();
    }
  }

  this.display = function() 
  {
    fill(this.col[this.value]);
    rect(this.x, this.y, this.size, this.size);
    print(this.y);
    fill(0, 0, 0);
    textSize(80*7/this.n);
    text(this.value, this.x+ floor(40*7/this.n), this.y + floor(90*7/this.n))

  }

  this.stop = function()
  {
    this.ay = 0;
    this.vy = 0;
  }

  this.fall = function()
  {
    this.ay =2;
    this.vy =1;
  }
}


function mouseClicked() 
{
  grille.click();
}

function keyPressed() 
{
  grille.brique_appear();
}