import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  //imports: [RouterOutlet, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  ngOnInit(): void {
    // Inicializar el toggleButton cuando la aplicación cargue
    this.toggleButton();
    //this.getAllSUsuarios();
  }

  // Método para obtener los usuarios desde el API


  siguiente(): void {
    const modal1 = document.getElementById('uno');
    const modal2 = document.getElementById('dos');

    if (modal1 && modal2) {
      modal1.classList.remove('activo');
      modal2.classList.add('activo');
    }
  }

  siguiente2(): void {
    const modal1 = document.getElementById('dos');
    const modal2 = document.getElementById('tres');

    if (modal1 && modal2) {
      modal1.classList.remove('activo');
      modal2.classList.add('activo');
    }
  }

  volver1(): void {
    const modal1 = document.getElementById('uno');
    const modal2 = document.getElementById('dos');

    if (modal1 && modal2) {
      modal1.classList.add('activo');
      modal2.classList.remove('activo');
    }
  }

  volver2(): void {
    const modal1 = document.getElementById('dos');
    const modal2 = document.getElementById('tres');

    if (modal1 && modal2) {
      modal1.classList.add('activo');
      modal2.classList.remove('activo');
    }
  }

  volver3(): void {
    const modal1 = document.getElementById('uno');
    const modal2 = document.getElementById('tres');

    if (modal1 && modal2) {
      modal1.classList.add('activo');
      modal2.classList.remove('activo');
    }
  }

  toggleButton(): void {
    const campo0 = document.getElementById('T_Doc') as HTMLInputElement;
    const campo1 = document.getElementById('num_documento') as HTMLInputElement;
    const campo2 = document.getElementById(
      'nombre_apellido'
    ) as HTMLInputElement;
    const campo3 = document.getElementById('celular') as HTMLInputElement;
    const toggleButton = document.getElementById('checkbox');

    if (toggleButton) {
      toggleButton.addEventListener('click', () => {
        campo0?.toggleAttribute('disabled');
        campo1?.toggleAttribute('disabled');
        campo2?.toggleAttribute('disabled');
        campo3?.toggleAttribute('disabled');
      });
    }
  }

  botones() {
    const botonera1 = document.getElementById("crear_incidencia");
    const botonera2 = document.getElementById("buscar_incidencia");
    const botonera3 = document.getElementById("contenedor_botones");
    const botonera4 = document.getElementById("boton_principal");
    const botonera5 = document.getElementById("call_center");

    botonera1?.classList.toggle("boton_activo");
    botonera2?.classList.toggle("boton_activo");
    botonera3?.classList.toggle("animacion_desactivada");
    botonera4?.classList.toggle("animacion_desactivada");
    botonera5?.classList.toggle("boton_activo");
  }

  salud() {
    const tipoSalud = document.getElementById("salud");
    const tipoCalidad = document.getElementById("calidad");
    const tipoOtros = document.getElementById("otros");

    tipoSalud?.classList.add("salud_activada");
    tipoCalidad?.classList.remove("calidad_activada");
    tipoCalidad?.classList.remove("otros_activada");
    tipoOtros?.classList.remove("calidad_activada");
    tipoOtros?.classList.remove("otros_activada");
  }

  calidad() {
    const tipoSalud = document.getElementById("salud");
    const tipoCalidad = document.getElementById("calidad");
    const tipoOtros = document.getElementById("otros");

    tipoSalud?.classList.remove("salud_activada");
    tipoSalud?.classList.remove("otros_activada");
    tipoCalidad?.classList.add("calidad_activada");
    tipoOtros?.classList.remove("salud_activada");
    tipoOtros?.classList.remove("otros_activada");
  }

  otros() {
    const tipoSalud = document.getElementById("salud");
    const tipoCalidad = document.getElementById("calidad");
    const tipoOtros = document.getElementById("otros");

    tipoSalud?.classList.remove("salud_activada");
    tipoSalud?.classList.remove("otros_activada");
    tipoCalidad?.classList.remove("salud_activada");
    tipoCalidad?.classList.remove("calidad_activada");
    tipoOtros?.classList.add("otros_activada");
  }

  resultadoBusqueda() {
    const buscarDocumento = document.getElementById("buscar_documento");
    const resultadoBusqueda = document.getElementById("resultado_busqueda");

    buscarDocumento?.classList.remove("activo");
    resultadoBusqueda?.classList.add("activo");
  }

}
