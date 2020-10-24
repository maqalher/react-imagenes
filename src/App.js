import React, { useState, useEffect } from 'react';
import Formulario from './components/Formulario';
import ListadoImagenes from './components/ListadoImagenes';

function App() {

  // state de la app

  const [ busqueda, guardarBusqueda ] = useState('');
  const [ imagenes, guardarImagenes ] = useState([]);
  const [ paginaactual, guardarPagiaActual ] = useState(1);
  const [ totalpaginas, guardarTotalpaginas ] = useState(1);

  useEffect( () => {
    
    const consultarApi = async () => {
      if(busqueda === '') return;

      const imagenesPorPagina = 30;
      const key = '16126752-ca198059077e20a86b76b06a8';
      //const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imagenesPorPagina}`; // se agrega pagina actual
      const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imagenesPorPagina}&page=${paginaactual}`; 

      const respuesta = await fetch(url);
      const resultado = await respuesta.json();

      //console.log(resultado);
      guardarImagenes(resultado.hits);

      // Calcular el total de paginas
      const calcularTotalPaginas = Math.ceil(resultado.totalHits / imagenesPorPagina);
      guardarTotalpaginas(calcularTotalPaginas);

      // Mover la pantalla hacia arriba
      const jumbotron = document.querySelector('.jumbotron');
      jumbotron.scrollIntoView({ block: "start" })
    }
    consultarApi();
  }, [busqueda, paginaactual]);

  // definir la pagina anterior
  const paginaAnterior = () => {
    const nuevaPaginaActual = paginaactual - 1;

    if(nuevaPaginaActual === 0) return;

    guardarPagiaActual(nuevaPaginaActual);

  }

  // definir la pagina siguiente 
  const paginaSiguente = () => {
    const nuevaPaginaActual = paginaactual + 1;

    if(nuevaPaginaActual > totalpaginas) return;

    guardarPagiaActual(nuevaPaginaActual);

  }

  return (
    <div className="container">
      <div className="jumbotron">
        <p className="lead text-center">Buscador de Imágenes</p>

        <Formulario 
          guardarBusqueda={guardarBusqueda}
        />
      </div>
      <div className="row justify-content-center">
        <ListadoImagenes 
          imagenes={imagenes}
        />

        { (paginaactual === 1) ? null : (
          <button
            type="button"
            className="btn btn-info mr-1"
            onClick={paginaAnterior}
          >&laquo; Anterior </button>
        ) }

        { (paginaactual === totalpaginas) ? null : (
          <button
            type="button"
            className="btn btn-info"
            onClick={paginaSiguente}
          >Siguiente &raquo;</button>
        )}

      </div>
    </div>
  );
}

export default App;
