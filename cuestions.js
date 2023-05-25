
const { createApp } = Vue

createApp({
  data() {
    return {
      buttonText: 'No',
      buttonDisabled: false,
      buttonPosition: { top: '20%', left: '20%' },
      showInput: true,
      message: '', // Mensaje de coincidencia
      formattedDate: '',
      moveCount: 0,
    }
  },
  mounted() {
    this.dateMoment();
  },
  // Componente principal de Vue
  methods: {
    moveButtonNo(event) {
      const button = event.target;
      const containerWidth = window.innerWidth - 900; // Ancho del contenedor - ancho del botón
      const containerHeight = window.innerHeight - 900; // Alto del contenedor - alto del botón
      const x = Math.random() * containerWidth;
      const y = Math.random() * containerHeight;
      this.buttonPosition = { top: `${y}px`, left: `${x}px` };
      console.log(this.buttonPosition);
      button.style.transform = `translate(${x}px, ${y}px)`;
    },
    resetButton(event) {
      event.target.style.transform = 'none';
    },
    moveButtonSi(event) {
      if (this.moveCount < 3) {
        const button = event.target;
        const containerWidth = window.innerWidth - 900; // Ancho del contenedor - ancho del botón
        const containerHeight = window.innerHeight - 900; // Alto del contenedor - alto del botón
        const x = Math.random() * containerWidth;
        const y = Math.random() * containerHeight;
        this.buttonPosition = { top: `${y}px`, left: `${x}px` };
        console.log(this.buttonPosition);
        button.style.transform = `translate(${x}px, ${y}px)`;
        this.moveCount++;
      }
    },
    btnSi() {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
     this.showInput=false
      swalWithBootstrapButtons.fire({
        title: '¿Estas segura?',
        text: "Bueno si es asi continua :)",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, Acepto!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            'Uuu genial !',
            'Hoy se registrara nuestra fecha .',
            'success'
          )
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Canselado',
            'Te entiendo:)',
            'error'
          )
        }
      })
    },
    dateMoment() {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      this.formattedDate = `${year}/${month}/${day}`;
    }
  },
}).mount('#app')
