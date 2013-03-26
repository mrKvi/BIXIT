/**
 * Librería para marcar valores default de elementos en formas.
 * Permite la implementación con la misma lógica id => valor en los elementos.
 * Uso: marca_radio('id_grupo', 'Valor');
 *      marca_checkb('id_grupo', 'Valor');
 *      marca_select('id_grupo', 'Valor');
 * Autor: Edgar Orozco <eorozco@bixit.mx>
 * $Id: marcaDefaults.js,v 1.1 2004/12/20 06:14:12 eorozco Exp $
 */

function marca_radio(id,valor){
        if(id == '' || valor==''){
                return false;
        }
        var elem=document.getElementsByTagName('input');
        for(i=0;i<elem.length;i++){
                if(elem[i].id==id){
                        if(elem[i].type=='radio'){
                                if(elem[i].value==valor){
                                        elem[i].checked=true;
                                }
                        }
                }
        }
}

function marca_checkb(id,valor){
        if(id == '' || valor==''){
                return false;
        }
        var elem=document.getElementsByTagName('input');
        for(i=0;i<elem.length;i++){
                if(elem[i].id==id){
                        if(elem[i].type=='checkbox'){
                                if(elem[i].value==valor){
                                        elem[i].checked=true;
                                }
                        }
                }
        }
}

function marca_select(ids,val){
        if(ids == '' || val==''){
                return false;
        }
        var s=document.getElementById(ids);
        for(i=0;i<s.length;i++){
                if(s.options[i].value==val){
                        s.options[i].selected=true;
                }
        }
}
