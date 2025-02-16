<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom border-primary">
    <div class="container-fluid">
      <a class="navbar-brand d-flex align-items-center" href="#">
        <img src="@/assets/CC.png" alt="Logo" style="height: 60px; margin-right: 10px;">
        <div class="brand-text">
          <strong class="gradient-text">Programaci&oacute;n Web</strong>
          <br>
          Grupo 1
        </div>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav text-center">
          <li class="nav-item">
            <router-link class="nav-link" to="/">
              <i class="bi bi-house-door-fill"></i> Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/ecm">
              <i class="bi bi-folder-fill"></i> ECM
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>

<style scoped>
.navbar {
  margin-bottom: 20px;
}

.navbar .brand-text {
  color: #000080; /* Azul marino */
  font-weight: normal; /* Sin negritas */
}

.navbar .gradient-text {
  background: linear-gradient(to right, rgb(7, 7, 66), rgb(0, 0, 133));
  -webkit-background-clip: text;
  color: transparent;
}

.navbar .nav-link {
  color: #000080; /* Azul marino */
}

.navbar .nav-link:hover {
  text-decoration: underline;
  font-size: 1.1em; /* Se expande */
}
</style>