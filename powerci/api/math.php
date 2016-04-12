<?php
//	CrbTendance.php
class RegLin{

 //champ de l'objet
 private $tDonnees;
 private $tAbscisse;
 private $vNbElt;	//Nombre déléments des tableaux
 
 private $vMoyX;		//Moyenne des X
 private $vMoyY;		//Moyenne des Y
 private $vSumXY;
 private $vSumX;
 private $vSumY;
 private $vSumX2;
 private $tPtG;		//Le point moyen G est un tableau tPtG(X,Y)=(vMoyX,vMoyY)
 //La variance, c'est la moyenne des carrés soustrait du carré de la moyenne
 Private $vVarianceX;	
 Private $vVarianceY; 
 //L'écart Type, c'est la racine carrée de la variance
 Private $vEcartTX;	
 Private $vEcartTY;  
 //La covariance, la moyenne des produits moins le produit des moyennes
 Private $vCovariance;
 
 
 Private $vA;			//Coef directeur de la droite liée à la régression
 Private $vB;			//Coef B de la droite liée à la régression
 Private $vCoefCorLin;//Coef de corrélation linéaire
 
 
 // constructeur
 function __construct($tDataY,$tDataX="") {
  $this->tDonnees = $tDataY;
  $this->tAbscisse = $tDataX;
  $p=0;
  if($tDataX=="")
  {$p=1;}
  
  $this->init($p);
 }


 //Méthodes privée de l'objet 
 Private function init($x=0)
 {
	//initialise les Variables pour les calculs
  $this->vNbElt= $n=	count($this->tDonnees); // Nombres d'éléments

	//Mise en place des abscisses
	if($x==1)
	{
	 	for($i=0;$i<$n;$i++){
			$this->tAbscisse[$i]=$i;
		}
	}
	
	//parcours des donnees pour récupération formule nécessaire au calcul des éléments
	$sumX=0; //somme des X
	$sumY=0; //somme des Y
	$sumX2=0; //somme des X²
	$sumY2=0; //somme des y²
	$sumXY=0; //somme des x*y

	for($i=0;$i<$n;$i++)	
	{
	  $xVal=$this->tAbscisse[$i];
	  $yVal=$this->tDonnees[$i];
	  
	  $sumX+=$xVal;
	  $sumY+=$yVal;
	  $sumX2+=$xVal*$xVal;
	  //correction du 20080903 remplace  $sumY2+=$yVal=$yVal; par $sumY2+=$yVal*$yVal;
	  $sumY2+=$yVal*$yVal; 
	  $sumXY+=$xVal*$yVal;

	}
	
	
	
	
	
	$this->vMoyX=$sumX/$n; //moyenne X
	$this->vMoyY=$sumY/$n; //moyenne Y
	
	$this->vSumXY=$sumXY;
	$this->vSumX=$sumX;
	$this->vSumY=$sumY;
	$this->vSumX2=$sumX2;

	$this->tPtG=array("X"=>$this->vMoyX,"Y"=>$this->vMoyY); //point moyen G
	//La variance, c'est la moyenne des carrés soustrait du carré de la moyenne: Rappel
	
	$this->vVarianceX=($sumX2/$n)-($this->vMoyX*$this->vMoyX);	
	$this->vVarianceY=($sumY2/$n)-($this->vMoyY*$this->vMoyY);

	
	
	//L'écart Type, c'est la racine carrée de la variance: Rappel
 	$this->vEcartTX=sqrt(abs($this->vVarianceX));	
 	$this->vEcartTY=sqrt(abs($this->vVarianceY));  
	 //La covariance, la moyenne des produits moins le produit des moyennes
 	$this->vCovariance=($sumXY/$n)-($this->vMoyX*$this->vMoyY);
	
	$tTest=array(
	$this->vMoyX,
	$this->vMoyY,
	$this->tPtG,
	$this->vVarianceX,
	$this->vVarianceY,
 	$this->vEcartTX,	
 	$this->vEcartTY,
 	$this->vCovariance);
 }
 //Calcul de la droite
 Private function CoefsDroite($met=0)
 {
	//Calcul de coef directeur de la régression
	//par théorie de la régression linéaire le coef a est obtenu des manières suivantes avec 	
	// 5 variantes  disponibles
	switch ($i) {
	case 0:
  	 $this->vA=$this->vCovariance/$this->vVarianceX;
  	 break;
  	case 1:
	 $this->vA=$this->vVarianceY/$this->vCovariance;
  	 break;  
 	case 2:
	 $this->vA=($this->vCovariance*$this->vEcartTY)/(abs($this->vCovariance)*$this->vEcartTX);
  	 break; 
	     
	case 3:
	 $this->vA=($this->vVarianceY-$this->vVarianceX+SQRT(pow(($this->vVarianceY-$this->vVarianceX),2)+pow((2*$this->vCovariance)),2))/(2*$this->vCovariance);
  	 break; 
  	case 4:
	 $this->vA=($this->vSumXY-(($this->vSumX*$this->vSumY)/$this->vNbElt)/($this->vSumX2-(pow($this->vSumX,2)/$this->vNbElt)));
  	 break; 
	   }
	$this->vB=$this->vMoyY-($this->vA*$this->vMoyX);
}

 Private function CoefCorLin()
 {
	//Calcul de coef de coorélation linéaire
	//ce  coef a est obtenu de la manière suivante
	//Covariance que divise l'écart Type X multiplié par l'écart Type de Y
	$this->vCoefCorLin=$this->vCovariance/($this->vEcartTX*$this->vEcartTY);
}


 //Méthodes publiques de l'objet
 function OptMV($meth=0){
	//Effectue la régression Linéaire
	$this->CoefsDroite($meth);
	$this->CoefCorLin();
	return array("A"=>$this->vA,"B"=>$this->vB,"Cor"=>$this->vCoefCorLin,"Meth"=>$meth);
 }
function GetOpt(){
	//renvoi le tableau des points optimisés
	$tOpt="";
//	for($i=0;$i<$this->vNbElt;$i++)
	foreach($this->tAbscisse as $i)
	{
		$tOpt[$i]=$this->vA*$i+$this->vB;
	}
	return $tOpt;
}
	
	
	
}


//zone Test et exemple d'utilisation

$y=array(50,75,76,80,50,180,17,72,200,56,22,85,100,90,80,110,70,110,105,89);
$x=array(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20);
$y2=array(1,4,9,16,25,36,49,64,81,100);
$y3=array(150,2,1000,60,1000000,3,8,557,45623125,455,987,1564231,12,56,78963,52,6,8956321,8956,5);
$x3=array(1,7,20,21,22,40,100,101,180,181,182,185,186,189,200,201,202,203,204,3000);

$oReg0= new RegLin($y3,$x3);
print("<hr>Meth 0: <br>");
print_r($oReg0->OptMV(0));

$oReg1= new RegLin($y3,$x3);
print("<hr>Meth 1: <br>");
print_r($oReg1->OptMV(1));

$oReg2= new RegLin($y3,$x3);
print("<hr>Meth 2: <br>");
print_r($oReg2->OptMV(2));

$oReg3= new RegLin($y3,$x3);
print("<hr>Meth 3: <br>");
print_r($oReg3->OptMV(3));

$oReg4= new RegLin($y3,$x3);
print("<hr>Meth 4: <br>");
print_r($oReg4->OptMV(4));

print_r($oReg1->GetOpt());

?>