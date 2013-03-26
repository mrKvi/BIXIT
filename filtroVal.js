/**
 * Librería para filtrar en tiempo real caracteres según el tipo de campo
 * También valida campos requeridos.
 * 
 * Autor: Edgar Orozco <eorozco@bixit.mx>
 * $Id: marcaDefaults.js,v 1.1 2004/12/20 06:14:12 eorozco Exp $
 */


this.onload=pegaHandlers;

function validaExtensiones(f){
  var reg=/1/;
	try{
		var soportados=f.getAttribute('extensiones');
		var exts=soportados.split(',');
		var partes=f.value.split('.');
		var extAr=partes[partes.length-1];
		var ban="";
		for(var a=0; a < exts.length; a++){
			if(exts[a] != extAr){
				ban += true;
			}
		}
		if(!reg.test(ban)){
			alert('El archivo no es del ninguno de los siguientes tipos: ' + soportados);
			return false;
		}
	}catch(e){
		//alert(e);
	}
}

function validaFecha(){
	var fecha=this.value;
	if(!isDate(fecha,'dd-MM-yyyy') && fecha != ''){
		alert('No es una fecha v?lida');
		this.focus;
		this.select;
		this.setAttribute('class','error');				
		return false;
	}	
}
//funcion de melinka para las fechas de vencimiento de las tarjetas de crédito
function validaVencimiento(){
	var fecha=this.value;
	if(!isDate(fecha,'MM-yy') && fecha != ''){
		alert('No es una fecha válida');
		this.focus;
		this.select;
		this.setAttribute('class','error');				
		return false;
	}	
}

function requeridos(){
	elems=document.getElementsByTagName('input');
	elemsS=document.getElementsByTagName('select');
	elemsT=document.getElementsByTagName('textarea');

	cont=document.getElementById('codigos');

	for(i=0;i<elems.length;i++){
		//checa para inputs de texto
		if(elems[i].type=='text' &&
		elems[i].getAttribute('requerido') &&
		elems[i].style.display != 'none' &&
		elems[i].getAttribute('disabled') != false
		){
			if(elems[i].value==''){
				elems[i].focus();
				abreError(elems[i]);
				alert('Este dato es requerido');
				return false;
			}
		}
		//checa para inputs de archivo
		if(elems[i].type=='file' && elems[i].getAttribute('requerido')){
			validaExtensiones(elems[i]);
			if(elems[i].value==''){
				elems[i].focus();
				abreError(elems[i]);				
				alert('Este campo es requerido');
				return false;
			}
		}
		
		//Checa para radios
		if((elems[i].type=='radio' && elems[i].getAttribute('requerido')) || (elems[i].type=='checkbox' && elems[i].getAttribute('requerido'))){
			rer=/true/;
			var radios=document.getElementsByName(elems[i].name);
			var r="";
			for(j=0;j<radios.length;j++){
				r += radios[j].checked;
			}
			if(!rer.test(r)){
				elems[i].focus();
				elems[i].select;
				abreError(elems[i]);				
				alert('Se requiere que conteste almenos una opción.');
				return false;
			}
		}
	}
	//Para elementos select
	for(i=0;i<elemsS.length;i++){
		if(elemsS[i].getAttribute('requerido')){
			if(elemsS[i].value=='' &&
			elemsS[i].style.display != 'none' &&
			elemsS[i].getAttribute('disabled') != false
			){
				elemsS[i].focus();
				elemsS[i].select;
				abreError(elemsS[i]);
				alert('Este campo es requerido');
				return false;
			}
		}
	}
	//Para textarea
	for(i=0;i<elemsT.length;i++){
		if(elemsT[i].getAttribute('requerido')){
			if(elemsT[i].value==''){
				elemsT[i].focus();
				abreError(elemsT[i]);
				alert('Este campo es requerido');
				return false;
			}
		}
	}
	return true;
}

//Función que desvía todos los eventos de keypress dentro de un campo a una función.
function pegaHandlers(){
	//colección de campos text y textarea
	var elems=document.getElementsByTagName('input');
	var elemsT=document.getElementsByTagName('textarea');
	for(i=0;i<elems.length;i++){
		if((elems[i].type == 'text' || elems[i].type == 'textarea') && !elems[i].getAttribute('nouppercase')=='1'){
			elems[i].onchange=aMayusculas;
		}
		
		if(elems[i].type == 'text' || elems[i].type == 'textarea' || elems[i].type == 'file'){
			if(elems[i].getAttribute('filtro')){
				elems[i].onkeypress=manEvento;
			}
			if(elems[i].getAttribute('filtro')=='fecha'){
				//OJO cargar librerias de validacion fecha
				elems[i].onblur=validaFecha;								
			}
			if(elems[i].getAttribute('filtro')=='fechaVencimiento'){
				//OJO cargar librerias de validacion fecha
				elems[i].onblur=validaVencimiento;								
			}
		}
	}
}

//Función filtro para los eventos de keypress
function manEvento(ev){

	var tipoFiltro = this.getAttribute('filtro'); //Obtenemos el tipo de filtro para el campo
	ev=ev||event||null;  //Obtenemos el evento (cada q se presiona una tecla)

   	if (ev) {

		var cc=ev.charCode||ev.keyCode||ev.which; // Cuál tecla se presionó?
		cc=Number(cc);
		switch(tipoFiltro){ 
			case 'alfabetico': //a-z A-Z 
				if(esLetra(cc) || esEspacio(cc)){
					return true;
				}
			break;
			case 'numerico': // 0-9
				if(esNumero(cc)){
					return true;
				}
			break;
			case 'alfanumerico': //a-z A-Z : , . - ' # @ 
				if(esNumero(cc) || esLetra(cc) || esPuntuacion(cc) || esCalificativo(cc) || esGuion(cc) || esEspacio(cc)){	return true;
				}
			break;
			case 'fecha': //0-9 - / 
				if(esNumero(cc) && filtraFecha(this,cc)){
					return true;
				}
			break;
			case 'fechaVencimiento': //0-9 - / 
				if(esNumero(cc) && filtraFecha(this,cc)){
					return true;
			}
			break;
			case 'hora': //0-9 : / 
				if(esNumero(cc) && filtraHora(this,cc)){
					return true;
				}
			break;
			case 'curp': //Clave "Unica" del Registro de Población : / 
				if((esNumero(cc) || esLetra(cc)) && filtraCurp(this,cc)){
					return true;
				}
			break;
			case 'tarjeta': //tarjeta de credito : / 
				if(esNumero(cc) && filtraTC(this,cc)){
					return true;
				}
			break;
			case 'expira_tc': // expiracion de tarjeta de credito : / 
				if(esNumero(cc) && filtraExpiraTC(this,cc)){
					return true;
				}
			break;
			
			default:
			 return true;
			break;
		}
		if(cc==9 || cc==8 || cc==46){return true;}
		if(cc==35 || cc==36){return true;}		
		if(cc==37 || cc==38 || cc==39 || cc==40){return true;}
		if(cc == 13){return false;}		
		return false;
	}
}

//Función filtro para los eventos de keypress en TextAreas
function manEventoTA(ev){
	this.setAttribute('class','campo');
	var tipoFiltro = this.getAttribute('filtro'); //Obtenemos el tipo de filtro para el campo
	ev=ev||event||null;  //Obtenemos el evento (cada q se presiona una tecla)
  	if (ev) {
		//alert(ev.modifiers);
		var cc=ev.charCode||ev.keyCode||ev.which; // ?Cu?l tecla se presiono?
		cc=Number(cc);
		switch(tipoFiltro){ 
			case 'alfabetico': //a-z A-Z 
				if(esLetra(cc) || esEspacio(cc)){
					return true;
				}
			break;
			case 'numerico': // 0-9
				if(esNumero(cc)){
					return true;
				}
			break;
			case 'alfanumerico': //a-z A-Z : , . - ' # @ 
				if(esNumero(cc) || esLetra(cc) || esPuntuacion(cc) || esCalificativo(cc) || esGuion(cc) || esEspacio(cc)){	return true;
				}
			break;
			case 'fecha': //0-9 - / 
				if(esNumero(cc) && filtraFecha(this,cc)){
					return true;
				}
			break;
			case 'fechaVencimiento': //0-9 - / 
				if(esNumero(cc) && filtraFecha(this,cc)){
					return true;
			}
			break;
			case 'hora': //0-9 : / 
				if(esNumero(cc) && filtraHora(this,cc)){
					return true;
				}
			break;
			case 'curp': //Clave "Unica" del Registro de Poblaci?n : / 
				if((esNumero(cc) || esLetra(cc)) && filtraCurp(this,cc)){
					return true;
				}
			break;
			case 'tarjeta': //tarjeta de credito : / 
				if(esNumero(cc) && filtraTC(this,cc)){
					return true;
				}
			break;
			
			default:
			 return true;
			break;
		}
		if(cc==9 || cc==8 || cc==46){return true;}
		if(cc==35 || cc==36){return true;}		
		if(cc==37 || cc==38 || cc==39 || cc==40){return true;}
		return false;
	}
}
/* Filtra Formato de fecha */
function filtraFecha(f,cc){
	var x=String.fromCharCode(cc);
	var tam=f.value.length;
	var rd1=/[0-3]/;				
	var rd2=/[0-9]/;
	var rm1=/[0-1]/;
	var rm2=/[0-9]/;
	var ra1=/[1-2]/;
	var ra2=/[0-9]/;
	var ra3=/[0-9]/;
	var ra4=/[0-9]/;
	if(tam == 0){
		if(rd1.test(x)){
			return true;
		}else{return false;}
	}else if(tam==1){
		if(rd2.test(x)){
			return true;
		}else{return false;}
	}else if(tam == 2 || tam == 3){
		if(rm1.test(x)){
			if(f.value.charAt(2) != '-') {f.value=f.value + '-';}
			return true;
		}else{return false;}
	}else if(tam == 4){
		if(rm2.test(x)){
			return true;
		}else{return false;}
	}else if(tam == 5 || tam == 6){
		if(ra1.test(x)){
			if(f.value.charAt(5) != '-') {f.value=f.value + '-';}		
			return true;
		}else{return false;}
	}else if(tam==7){
		if(ra2.test(x)){
			return true;
		}else{return false;}
	}else if(tam == 8){
		if(ra3.test(x)){
			return true;
		}else{return false;}
	}else if(tam == 9){
		if(ra4.test(x)){
			return true;
		}else{return false;}
	}
}

/*Filtra horas válidas. solo en formato de 24 Hrs 00:00-23:59 */
function filtraHora(f,cc){
	var x=String.fromCharCode(cc);
	var tam=f.value.length;
	var rh1=/[0-2]/; //Horas decenas sólo puede llegar el primer digito hasta 2 (23hrs)			
	var rh2=/[0-9]/; //Horas unidades puede ser de 0-9
	var rm1=/[0-5]/; //Minutos decenas de 0 - 5
	var rm2=/[0-9]/; //Minutos unidades de 0 - 9
	if(tam == 0){
		if(rh1.test(x)){
			return true;
		}else{return false;}
	}else if(tam==1){
		if((rh2.test(x) && f.value.charAt(0)==2 && x < 4) || (rh2.test(x) && f.value.charAt(0)< 2)) {
			return true;
		}else{return false;}
	}else if(tam == 2 || tam == 3){
		if(rm1.test(x)){
			if(f.value.charAt(2) != ':') {f.value=f.value + ':';}
			return true;
		}else{return false;}
	}else if(tam == 4){
		if(rm2.test(x)){
			return true;
		}else{return false;}
	}
}

/* Filtra CURP */
function filtraCurp(f,cc){
	var x=String.fromCharCode(cc);
	var tam=f.value.length;
	var rp1=/[a-zA-Z]/; //Letra inicial del primer apellido
	var rp2=/[aeiouAEIOU]/; //Primera vocal interna del primer apellido
	var rp3=/[a-zA-Z]/; //Primer caracter del segundo apellido, X en caso de no tener segundo ap
	var rp4=/[a-zA-Z]/; //Letra inicial del primer nombre de pila, en caso de ser compuesto con maria o jose, se toma el car, del 2do nombre

	var rp5=/[0-9]/; //Primer digito del año de nacimiento de 0 - 9
	var rp6=/[0-9]/; //Segundo digito del año de nacimiento
	var rp7=/[0-1]/; //primer d?gito del Mes de nacimiento 
	var rp8=/[0-9]/; //Segundo digito del mes de nacimiento
	var rp9=/[0-3]/; //Primer digito del dia de nacimiento
	var rp10=/[0-9]/; //Segundo digito del dia de nacimiento

	var rp11=/[hmHM]/; //Sexo H o M hombre o mujer

	var rp12=/[abcdghjmnopqstvyzABCDGHJMNOPQSTVYZ]/; //Primer caracter de la Ent. Fed. de nacimiento
	var rp13=/[sclmhfgtrnpzSCLMHFGTRNPZ]/; //Segundo caracter de la Ent. Fed. de nacimiento	
	
	var rp14=/[bcdfghjklmn?pqrstvwxyzBCDFGHJKLMN?PQRSTVWXYZ]/; //Primera consonante interna del primer apellido
	var rp15=/[bcdfghjklmn?pqrstvwxyzBCDFGHJKLMN?PQRSTVWXYZ]/; //Primera consonante interna del segundo apellido
	var rp16=/[bcdfghjklmn?pqrstvwxyzBCDFGHJKLMN?PQRSTVWXYZ]/; //Primera consonante interna del primer nombre de pila		
	
	var rp17=/[a-zA-Z0-9]/; //Hasta el 31 de dic 1999 es numerico, despues es alfabetico, sirve para diferenciar homonimias
	
	var rp18=/[0-9]/; //Digito verificador.
	
	if(tam == 0){
		if(rp1.test(x)){
			return true;
		}else{return false;}
	}else if(tam==1){
		if(rp2.test(x)){
			return true;
		}else{return false;}
	}else if(tam == 2){
		if(rp3.test(x)){
			return true;
		}else{return false;}
	}else if(tam == 3){
		if(rp4.test(x)){
			return true;
		}else{return false;}
	}else if(tam == 4){
		if(rp5.test(x)){
			return true;
		}else{return false;}
	}else if(tam == 5){
		if(rp6.test(x)){
			return true;
		}else{return false;}
	}else if(tam == 6){
		if(rp7.test(x)){
			return true;
		}else{return false;}
	}else if(tam == 7){
		if((rp8.test(x) && f.value.charAt(6)==0) || (rp8.test(x) && f.value.charAt(6)==1 && x <= 2)){
			return true;
		}else{return false;}
	}else if(tam == 8){
		if(rp9.test(x)){
			return true;
		}else{return false;}
	}else if(tam == 9){
		if((rp10.test(x) && f.value.charAt(8) <= 2) || (rp10.test(x) && f.value.charAt(8) == 3 && x <=1)){
			return true;
		}else{return false;}
	}else if(tam == 10){
		if(rp11.test(x)){
			return true;
		}else{return false;}
	}else if(tam == 11){
		if(rp12.test(x)){
			return true;
		}else{return false;}
	}else if(tam == 12){
		if(rp13.test(x)){
			return true;
		}else{return false;}
	}else if(tam == 13){
		if(rp14.test(x)){
			return true;
		}else{return false;}
	}else if(tam == 14){
		if(rp15.test(x)){
			return true;
		}else{return false;}
	}else if(tam == 15){
		if(rp16.test(x)){
			return true;
		}else{return false;}
	}else if(tam == 16){
		if(rp17.test(x)){
			return true;
		}else{return false;}
	}else if(tam == 17){
		if(rp18.test(x)){
			return true;
		}else{return false;}
	}
}

/*Filtra numeros de tarjeta */
function filtraTC(f,cc){
	var x=String.fromCharCode(cc);
	var tam=f.value.length;
	var rh1=/[0-9]/; //Solo digitos del 0 al 9
	if(tam < 4){
		if(rh1.test(x)){
			return true;
		}else{return false;}
	}else if(tam==4){
		if(rh1.test(x)){
			if(f.value.charAt(4) != '-') {f.value=f.value + '-';}
			return true;
		}else{return false;}
	}else if(tam > 4 && tam < 9){
		if(rh1.test(x)){
			return true;
		}else{return false;}
	}else if(tam==9){
		if(rh1.test(x)){
			if(f.value.charAt(9) != '-') {f.value=f.value + '-';}
			return true;
		}else{return false;}
	}else if(tam > 9 && tam < 14){
		if(rh1.test(x)){
			return true;
		}else{return false;}
	}else if(tam==14){
		if(rh1.test(x)){
			if(f.value.charAt(14) != '-') {f.value=f.value + '-';}
			return true;
		}else{return false;}
	}else if(tam > 14 && tam < 19){
		if(rh1.test(x)){
			return true;
		}else{return false;}
	}
	
}
/* Filtro de fecha de expiracion de una tarjeta */
function filtraExpiraTC(f,cc){
	var x=String.fromCharCode(cc);
	var tam=f.value.length;
	var rh1=/[0-1]/; //unidades del mes
	var rh2=/[0-9]/; //decenas del mes (puede ser hasta nueve si las unidades es cero)
	var rm1=/[0-1]/; //año, 0-9
	var rm2=/[0-9]/; //año, 0-9
	if(tam == 0){
		if(rh1.test(x)){
			return true;
		}else{return false;}
	}else if(tam==1){
		if((rh2.test(x) && f.value.charAt(0)==0) || (f.value.charAt(0)== 1 && x < 3)) {
			return true;
		}else{return false;}
	}else if(tam == 2 || tam == 3){
		if(rm1.test(x)){
			if(f.value.charAt(2) != '-') {f.value=f.value + '-';}
			return true;
		}else{return false;}
	}else if(tam == 4){
		if(rm2.test(x)){
			return true;
		}else{return false;}
	}
}


function esLetra(cc){
	if(cc >= 65 && cc <=90){ // mayusculas
		return(1);
	}
	if(cc >= 97 && cc <=122){ //minusculas
		return(1);
	}
	if(cc == 225 || cc == 233 || cc == 237 || cc == 243 || cc == 250){ // min acento
		return(1);
	}
	if(cc == 193 || cc == 201 || cc == 205 || cc == 211 || cc == 218){ // may acento
		return(1);
	}
	if(cc == 252 || cc == 220){ // u dieresis
		return(1);
	}
	if(cc == 209 || cc == 241){ // ??
		return(1);
	}
	return(0);
}

function esNumero(cc){
	if(cc >=48 && cc <= 57){
		return(1);
	}else{
		return(0);
	}
}

function esPuntuacion(cc){
	if(cc == 44 || cc == 46 || cc == 58 || cc == 59){ // ,;:.
		return(1);
	}else{
		return(0);
	}
}

function esCalificativo(cc){ // !? ??
	if(cc == 63 || cc == 191 || cc == 33 || cc == 161){
		return(1);
	}else{
		return(0);
	}
}

function esGuion(cc){ // -_
	if(cc == 45 || cc == 95){
		return(1);
	}else{
		return(0);
	}
}

function esEspacio(cc){ // -_
	if(cc == 32){
		return(1);
	}else{
		return(0);
	}
}

function esSuprimir(cc){ // -_
	if(cc == 32 || cc == 46){
		return(1);
	}else{
		return(0);
	}
}

function esArroba(cc){
	if(cc == 64){
		return(1);
	}else{
		return(0);
	}
}

function manDown(ev){
	ev=ev||event||null;  //Obtenemos el evento (cada q se presiona una tecla)
   	if (ev) {
		var cc=ev.charCode||ev.keyCode||ev.which; // Cuál tecla se presiono?
		cc=Number(cc);
		imprime(cc);
	}
}

function manUp(ev){
	var cad=this.value;
	cad.replace(/./gi, ""); 
	this.value=cad;
}

function imprime(cc){
	t=document.getElementById('codigos');
	t.innerHTML += cc + ' -> ' + String.fromCharCode(cc) + '<br>';
	ch.value="";
	s="";
}

function aMayusculas(){

	var cad =this.value;
	this.value=cad.toUpperCase();
	this.value=cad.TrimLeft();
	this.value=cad.TrimRight();
}

function abreError(elemento) {

	pos = posicion(elemento);
	var d = document.createElement("div");
	document.getElementsByTagName("body")[0].appendChild(d);	

	d.innerHTML="<h3>&nbsp;&nbsp;&nbsp;&nbsp;</h3>";
	d.style.position="absolute";
	d.style.left=pos.left+"px";
	d.style.top=pos.top+"px";

}

function posicion(element){
	var left=0,top=0;
	while (element!=null){
		left+=element.offsetLeft-element.scrollLeft;
		top+=element.offsetTop-element.scrollTop;
		
		element=element.offsetParent;
	}
	return {top:top,left:left};
}

/* Verificando la validez del CURP mediante el algoritmo de LUHN con caracteres sustituidos. */
function luhn(curp){
	var esNumero=/\d/;
	document.getElementById('res').innerHTML='Evaluando '+curp+'<br>';
	var map = new Array();
	map['A']=10; map['B']=11; map['C']=12; map['D']=13; map['E']=14; map['F']=15; map['G']=16;
	map['H']=17; map['I']=18; map['J']=19; map['K']=20; map['L']=21; map['M']=22; map['N']=23;
	/*map['?']=24;*/ map['O']=24; map['P']=25; map['Q']=26;	map['R']=27; map['S']=28; map['T']=29;
	map['U']=30; map['V']=31; map['W']=32; map['X']=33;	map['Y']=34; map['Z']=35;
	/*map['A']=1; map['B']=2; map['C']=3; map['D']=4; map['E']=5; map['F']=6; map['G']=7;
	map['H']=8; map['I']=9; map['J']=1; map['K']=2; map['L']=3; map['M']=4; map['N']=5;
	map['?']=6; map['O']=7; map['P']=8; map['Q']=9;	map['R']=1; map['S']=2; map['T']=3;
	map['U']=4; map['V']=5; map['W']=6; map['X']=7;	map['Y']=8; map['Z']=9;*/
	
	var flip = true;
	document.getElementById('res').innerHTML='long '+curp.length+'<br>';
	var suma = 0;
	for(i=curp.length;i>=1;i--){
		flip = !flip;
		
		if(flip){
			if(!esNumero.test(curp.charAt(i))){evaluando = map[curp.charAt(i)];}else{evaluando = curp.charAt(i);}
			digito = evaluando*2;
			dig = digito;
			sp=0;
			while (digito) {
				sp += digito % 10;
      			suma += digito % 10;
      			digito = parseInt(digito / 10);
			}
			
			document.getElementById('res').innerHTML=document.getElementById('res').innerHTML + 'Evaluando '+curp.charAt(i) + ' como '+ evaluando + ' En '+i+' -> '+ dig+' parcial '+sp+' -> suma '+suma+'<br>' ;
		}
	}
	var valido = (suma % 10==0);
	document.getElementById('res').innerHTML=document.getElementById('res').innerHTML + "Es Curp? "+ valido;
}




//Agregado por melinka

function quitaRequerido (grupo){
	fieldset = document.getElementById(grupo);
	elems=fieldset.getElementsByTagName('input');
	elemsS=fieldset.getElementsByTagName('select');
	elemsT=fieldset.getElementsByTagName('textarea');
	for(i=0;i<elems.length;i++){elems[i].disabled=true;}
	for(i=0;i<elemsS.length;i++){elemsS[i].disabled=true;}			
}

function poneRequerido (grupo){
	fieldset = document.getElementById(grupo);
	elems=fieldset.getElementsByTagName('input');
	elemsS=fieldset.getElementsByTagName('select');
	elemsT=fieldset.getElementsByTagName('textarea');
	for(i=0;i<elems.length;i++){elems[i].disabled=false;}
	for(i=0;i<elemsS.length;i++){elemsS[i].disabled=false;}			
}
