<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md text-center">
      <h1 class="text-4xl font-bold text-red-500 mb-4">{{ errorTitle }}</h1>
      <p class="text-lg text-gray-700 mb-6">{{ errorMessage }}</p>
      <router-link
        to="/"
        class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Volver al Dashboard
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorView',
  props: {
    errorCode: {
      type: [String, Number],
      default: '404',
    },
  },
  computed: {
    errorTitle() {
      if (this.errorCode.toString().startsWith('4')) {
        return 'Error del Cliente';
      } else if (this.errorCode.toString().startsWith('5')) {
        return 'Error del Servidor';
      }
      return 'Error Desconocido';
    },
    errorMessage() {
      if (this.errorCode === '404' || this.errorCode === 404) {
        return 'La página que estás buscando no existe.';
      } else if (this.errorCode.toString().startsWith('4')) {
        return 'Hubo un problema con tu solicitud. Por favor, inténtalo de nuevo más tarde.';
      } else if (this.errorCode.toString().startsWith('5')) {
        return 'Hubo un problema en nuestros servidores. Estamos trabajando para solucionarlo.';
      }
      return 'Ha ocurrido un error inesperado.';
    },
  },
};
</script>

<style scoped>
/* Puedes agregar estilos específicos aquí si es necesario */
</style>
