
const firebaseConfig = {
  apiKey: "AIzaSyDZ6NYGYgTI2xjKmsePi7mZD-tFHHPhADo",
  authDomain: "amor-b8482.firebaseapp.com",
  projectId: "amor-b8482",
  storageBucket: "amor-b8482.appspot.com",
  messagingSenderId: "214544670279",
  appId: "1:214544670279:web:76635cd6551acc01d81b62"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const coleccion = db.collection('users');

const { createApp } = Vue
createApp({
  data() {
    return {
      mensaje: '',
      messageAniversario: '',
      buttonDisabled: false,
      date: '',
      showInput: false,
      showDates: false,
      showFecha: true,
      days: 0, // Días transcurridos
      hours: 0, // Horas transcurridas
      minutes: 0, // Minutos transcurridos
      seconds: 0, // Segundos transcurridos
      remainingDaysInNextMonth: 0, // Días restantes para el próximo mes
      remainingDaysInNextYear: 0, // Días restantes para el próximo año
      currentDate: new Date().toLocaleDateString(), // La fecha actual
      anniversaryDate: new Date("2023-05-24"), // Fecha de aniversario en formato "YYYY-MM-DD"
      daysRemaining: 0,
      userDate: null, // Fecha ingresada por el usuario
      message: '', // Mensaje de coincidencia
      remainingAttempts: 3,
      isInputDisable: false,
      users: [],
      isInputInvalid: false,
      logout: false,
      showLogOut: false,
      fechaPago: '',
      diasRestantes: 0,
      fechaFomateadaAniversario: '',
      messageLogin:'',

    }
  },
  mounted() {
    this.startCounter();
    this.calcularDiasRestantes();
    this.getUser();
    this.calcularDiasRestantes(); 
  },
  // Componente principal de Vue
  methods: {

    getUser() {
      this.users = [];
      coleccion.get().then((r) => r.docs.map((item) => this.users.push({ id: item.id, data: item.data() })));
    },
    async addUser() {
      if (this.mensaje === '') {
        alert('ingrese un dato')
        this.isInputInvalid = true;
      } else {
        // Realizar acciones con los datos ingresados
        coleccion.add({
          mensaje: this.mensaje,
        })
        this.getUser()
        console.log('agregado');
        // Limpiar el campo de entrada
        this.mensaje = '';
        // Restablecer la bandera de error
        this.isInputInvalid = false;
      }
    },
    async updateUser(id) {
      try {
        await coleccion.doc(id).set({ mensaje: this.mensaje });
        console.log("updating menssage");
      } catch (error) {
        console.error(error);
      }
    },
    deleteUser(id) {
      coleccion.doc(id).delete()
      console.log(id);
      console.log("daleting");


      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'warning',
        title: 'Se eliminó correctamente'
      })
    },

    compareDates() {
      const inputDate = new Date(this.userDate); // Convertir la fecha ingresada a objeto Date
      // Comprobar si las fechas son iguales (considerando solo año, mes y día)
      if (
        inputDate.getFullYear() === this.anniversaryDate.getFullYear() &&
        inputDate.getMonth() === this.anniversaryDate.getMonth() &&
        inputDate.getDate() === this.anniversaryDate.getDate()
      ) {
        this.message = '¡Bienvenida!';
        this.showDates = !this.showDates;
        this.showFecha = !this.showFecha;
        this.showLogOut = "true"
        this.remainingAttempts = 3;

        Swal.fire(
          'Genial!',
          'En buena hora lo sabes la fecha!',
          'success'
        )
      } else {
        // La entrada es incorrecta, reducir el contador de intentos
        this.remainingAttempts--;
        console.log(this.remainingAttempts);
        if (this.remainingAttempts === 1) {
          // Tres intentos fallidos, mostrar mensaje de bloqueo
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No es la fecha correcta !',
            footer: `<p>Te quedan ${this.remainingAttempts} intentos </p>`
          })
          this.isInputDisabled = !this.isInputDisabled;
          this.messageLogin='Sabes que vuelve el otro año o mejor ya no XD! 💔'

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No es la fecha correcta !',
            footer: `<p>Te quedan ${this.remainingAttempts} intentos </p>`
          })
        }

      }
    },
    logOut() {
      console.log('click en salir');
      this.showDates = !this.showDates;
      this.showFecha = !this.showFecha;
      location.reload()
    },

    startCounter() {
      setInterval(() => {
        const timeDiff = Math.abs(new Date() - this.anniversaryDate);
        this.days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        this.hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
        this.minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
        this.seconds = Math.floor((timeDiff / 1000) % 60);
      }, 1000); // Actualizar el contador cada segundo (puedes ajustar el intervalo según tus necesidades)

    },

    calcularDiasRestantes() {
      const fechaActual = new Date();
      const diaAniversario = this.anniversaryDate.getDate() + 1;

      let fechaAniversarioActual = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), diaAniversario);
      this.fechaFomateadaAniversario = fechaAniversarioActual.toLocaleDateString();

      if (fechaActual > fechaAniversarioActual) {
        fechaAniversarioActual.setMonth(fechaAniversarioActual.getMonth() + 1);
      }

      const unDia = 24 * 60 * 60 * 1000; // 1 día en milisegundos
      this.diasRestantes = Math.round((fechaAniversarioActual - fechaActual) / unDia)+1;
      if (fechaAniversarioActual.getDate() == fechaActual.getDate()) {
        console.log('hoy es  tu aniversario');
        this.messageAniversario = 'Hoy es tu aniversario';
      } else {
        console.log(fechaAniversarioActual);
        console.log(fechaActual);
        console.log(unDia);
        console.log(this.diasRestantes);
        this.messageAniversario = ` Falta ${this.diasRestantes} dia (as) para cumplir  un mes más`;
        console.log(this.messageAniversario);
      }
    },

  },
}).mount('#app')