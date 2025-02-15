<template>
  <footer class="bg-primary text-white text-center text-lg-start">
    <div class="container p-4">
      <div class="row">
        <div class="col-lg-6 col-md-12 mb-4 mb-md-0">
          <h5 class="text-uppercase"></h5>
          <p>
            La Universidad Central del Ecuador es la universidad más antigua y
            la segunda más grande por número de estudiantes de la República del
            Ecuador. Se ubica en el centro-norte de la ciudad de Quito, en la
            llamada ciudadela universitaria, además cuenta con sede en las islas
            Galápagos. Afiliada desde 2012 a la Red Ecuatoriana de Universidades
            para Investigación y Postgrados.
          </p>
        </div>

        <div class="col-lg-3 col-md-6 mb-4 mb-md-0">
          <h5 class="text-uppercase"></h5>
          <p>Elaborado en el curso: <strong>Programaci&#243;n Web</strong></p>
          <p>Docente: <strong>Ing. Edison Cayambe</strong></p>
        </div>

        <!-- Sección con efecto hover -->
        <div class="col-lg-3 col-md-6 mb-4 mb-md-0 ">
            <h5 
            class="text-uppercase grupo-title text-center" 
            @mouseover="mostrarIntegrantes = true" 
            @mouseleave="mostrarIntegrantes = false"
            @touchstart="mostrarIntegrantes = true"
            @touchend="mostrarIntegrantes = false"
            >
            <strong>
              Desarrollado por el Grupo 1
            </strong>
          </h5>
          <h6 v-if="!mostrarIntegrantes">Somos un grupo comprometido con la excelencia</h6>

          <!-- Lista de nombres oculta por defecto -->
          <ul v-if="mostrarIntegrantes" class="list-unstyled integrantes ">
            <li><strong>Soria Nelson</strong></li>
            <li><strong>Espinoza Joel</strong></li>
            <li><strong>Narváez Anthony</strong></li>
            <li><strong>Simbaña Pablo</strong></li>
            <li><strong>Gualoto Erika</strong></li>
            <li><strong>Vinueza Edlith</strong></li>
            <li><strong>Andrade Dennisse</strong></li>
            <li><strong>Rivera Cristina</strong></li>
            <li><strong>Cacuango Mauricio</strong></li>
            <li><strong>Arteaga Jhon</strong></li>
            <li><strong>Salazar Augusto</strong></li>
            <li><strong>Rivas Diego</strong></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="text-center p-3" style="background-color: rgb(0, 0, 0, 0.2)" >
      © 2024 Aplicaci&#243;n para la Casa Abierta - 
      <a class="text-white" href="https://www.uce.edu.ec/web/fing" target="_blank">Ingenier&#237;a en Computaci&#243;n</a>
    </div>
  </footer>
</template>

<script>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
export default {
  data() {
    return {
      mostrarIntegrantes: false,
    };
  }
};
</script>

<style scoped>
.grupo-title {
  cursor: pointer;
  font-weight: bold;
}

.integrantes {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 10px;
  border-radius: 5px;
  transition: opacity 0.3s ease-in-out;
}
</style>