import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Modal } from 'bootstrap';
import { IncidenciaService } from '../../../services/incidencia.service';
import { IncidenciaDao } from '../../../models/incidencia.model';
import { RegionDao } from '../../../models/region.model';
import { ProvinciaDao } from '../../../models/provincia.model';
import { DistritoDao } from '../../../models/distrito.model';
import { ColegioDao } from '../../../models/colegio.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {

  private modalInstance!: Modal | null;

  resultado: DistritoDao | null = null;
  error: string | null = null;

  regiones: RegionDao[] = [];
  provincias: ProvinciaDao[] = [];
  distritos: DistritoDao[] = [];
  colegios: ColegioDao[] = [];

  selectedRegionId: string = '';
  selectedProvinciaId: string = '';
  selectedDistritoId: string = '';

  searchQuery: string = '';

  private ubicacionSolicitada: boolean = false; // Ahora está definida
  mensajeUbicacion: string = ''; // Variable para mostrar mensaje en la vista

  selectedTipologia: string = '[]';
  selectedFile: File | null = null;
  selectedCategories: string[] = [];
  incidenciaForm!: FormGroup;

  incidencias: IncidenciaDao[] = [];
  tipoDocumento: string = '';
  numeroDocumento: string = '';
  incidenciaSeleccionada: IncidenciaDao | null = null;

  incidenciasFiltradas: any[] = [];
  tipologias: string[] = [];
  filtroSeleccionado: string = 'Todas';


  @ViewChild('myModal2', { static: false }) myModal2!: ElementRef;

  // Constantes de prueba
  private readonly TIPO_DOCUMENTO = 'DNI';
  private readonly NUMERO_DOCUMENTO = '45544764';

  constructor(private fb: FormBuilder, private incidenciaService: IncidenciaService) { }

  ngOnInit(): void {
    // Inicializar el toggleButton cuando la aplicación cargue
    this.toggleButton();
    //this.getAllSUsuarios();
    this.initiateForm();
    this.loadRegiones();

    //this.loadCoordenadas();
    this.incidenciaForm.get('nombreColegio')?.valueChanges.subscribe(value => {
      if (value) {
        const idcolegio = this.colegios.find(f => f.NombreColegio === value)?.IdColegio;
        this.incidenciaForm.get('idcolegio')?.setValue(idcolegio);
      }
    });

    const incidencias = [
      { Tipologia: 'Salud' },
      { Tipologia: 'Calidad' },
      { Tipologia: 'Otros' }
    ];

    // Obtener tipos únicos y agregar "Todas" al inicio
  this.tipologias = ['Todas', ...new Set(incidencias.map(i => i.Tipologia))];


    // // Probar búsqueda con tipo y número de documento
    // this.buscarPorTipoYNumero(this.TIPO_DOCUMENTO, this.NUMERO_DOCUMENTO);

    // // Probar búsqueda solo con número de documento
    // this.buscarPorNumero(this.NUMERO_DOCUMENTO);
  }

  filtrarIncidencias(tipo: string) {
    this.filtroSeleccionado = tipo;

    if (tipo === 'Todas') {
      this.incidenciasFiltradas = this.incidencias;
    } else {
      this.incidenciasFiltradas = this.incidencias.filter(i => i.Tipologia === tipo);
    }
  }

  //Inicio Metodos Para El Modal Registrar

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; // Guarda el archivo seleccionado
      console.log('Archivo seleccionado:', this.selectedFile.name); // Muestra el nombre del archivo en la consola
    }
  }

  initiateForm() {
    //Creación del formulario con validaciones
    this.incidenciaForm = this.fb.group({
      idcolegio: ['', Validators.required],
      nombreColegio: ['', Validators.required],
      tipoIncidencia: [''],
      tipologia: ['', Validators.required],
      tipoDocumentoTutor: ['', Validators.required],
      numeroDocumentoTutor: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      nombreTutor: ['', Validators.required],
      celularTutor: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      detalleIncidencia: ['', Validators.required],
      archivo: [''],
      estado: [''],
      fechaReagendado: [''],
      region: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
    });

    console.log('Formulario inicializado:', this.incidenciaForm.value);

  }

  registrarIncidencia(): void {
    console.log('Formulario registrarIncidencia:', this.incidenciaForm.value);
    setTimeout(() => {
      let modalElement = document.getElementById('myModal') as HTMLElement;
      if (modalElement) {
        let modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
        modalInstance.hide();
      }
      if (this.modalInstance) {
        this.modalInstance.hide();
      } else {
        console.error('El modal no ha sido inicializado.');
      }
    }, 100);
    if (this.incidenciaForm.invalid) {
      this.error = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    const incidencia: IncidenciaDao = {
      IdColegio: this.incidenciaForm.value.idcolegio, // Obtenemos el IdColegio desde la búsqueda
      TipoIncidencia: this.incidenciaForm.value.tipoIncidencia,
      Tipologia: this.incidenciaForm.value.tipologia,
      TipoDocumentoTutor: this.incidenciaForm.value.tipoDocumentoTutor,
      NumeroDocumentoTutor: this.incidenciaForm.value.numeroDocumentoTutor,
      NombreTutor: this.incidenciaForm.value.nombreTutor,
      CelularTutor: this.incidenciaForm.value.celularTutor,
      DetalleIncidencia: this.incidenciaForm.value.detalleIncidencia,
      Archivo: this.incidenciaForm.value.archivo,
      Estado: this.incidenciaForm.value.estado,
      FechaReagendado: this.incidenciaForm.value.fechaReagendado,

      Colegio: {
        IdColegio: this.incidenciaForm.value.idcolegio,
        IdDistrito: this.selectedDistritoId ? this.selectedDistritoId.toString() : '',
        NombreColegio: this.incidenciaForm.value.nombreColegio,

      },

    };
    console.log('VEr datos enviados', incidencia);
    this.incidenciaService.registrarIncidencia(incidencia).subscribe({
      next: (data) => {
        console.log('Incidencia registrada con éxito:', data);
        this.resetForm(); // Resetear el formulario

        // Cerrar el modal con Bootstrap
        let modalElement = document.getElementById('myModal');
        if (modalElement) {
          let modalInstance = Modal.getInstance(modalElement);
          if (modalInstance) {
            modalInstance.hide();
          }
        }
      },
      error: (err) => {
        console.error('Error al registrar la incidencia', err);
        this.error = 'Hubo un error al registrar la incidencia. Intente nuevamente.';
      },
    });
  }

  // Método para resetear el formulario después de registrar la incidencia
  resetForm(): void {
    this.incidenciaForm.reset();
    this.selectedRegionId = '';
    this.selectedProvinciaId = '';
    this.selectedDistritoId = '';
    this.searchQuery = ''; // Limpia el campo de búsqueda de colegio

  }

  loadCoordenadas(): void {
    // const longitud = -77.06282347860682;
    // const latitud = -12.071561886905652;

    if (this.ubicacionSolicitada) {
      console.log('Ya se solicitó la ubicación anteriormente, no se pedirá de nuevo.');
      return;
    }
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'granted') {
        console.log('La ubicación ya está permitida ✅');
        this.loadCoordenadas();
      } else if (result.state === 'prompt') {
        console.log('El navegador preguntará al usuario 🔄');
        this.loadCoordenadas();
      } else {
        console.log('Ubicación bloqueada ❌, el usuario debe activarla manualmente.');
        this.mensajeUbicacion = '⚠️ Ups, ocurrió un problema. Seleccione de forma manual.';
      }

      this.ubicacionSolicitada = true; // Evitar múltiples solicitudes
    }).catch((error) => {
      console.error('Error al verificar los permisos de ubicación:', error);
      this.mensajeUbicacion = '⚠️ Ups, ocurrió un problema. Seleccione de forma manual.';
    });

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitud = position.coords.latitude.toString();
          const longitud = position.coords.longitude.toString();

          this.incidenciaService.obtenerDistritoPorCoordenadas(longitud, latitud).subscribe({
            next: (data) => {
              this.resultado = data;
              console.log('Ubicación procesada:', data);

              this.selectedDistritoId = data.IdDistrito;
              this.selectedProvinciaId = data.IdProvincia;
              this.selectedRegionId = data.IdRegion;

              this.incidenciaForm.get('region')?.setValue(this.selectedRegionId);
              this.onRegionChange();
              this.incidenciaForm.get('provincia')?.setValue(this.selectedProvinciaId);
              this.onProvinciaChange();
              this.incidenciaForm.get('distrito')?.setValue(this.selectedDistritoId)
            }, error: (err) => (this.error = 'Error al obtener los datos del servicio'),
          });
        },
        (err) => {
          this.error = 'No se pudo obtener la ubicación del navegador.';
        }
      );
    } else {
      this.error = 'La geolocalización no es soportada por este navegador.';
    }

  }

  // Cargar las regiones
  loadRegiones(): void {
    this.incidenciaService.getAllRegion().subscribe(
      (data) => {
        this.regiones = data;
        console.log('Lista de Regiones', data)
      },
      (error) => {
        console.error('Error al cargar las regiones', error);
      }
    );
  }

  // Cargar provincias al seleccionar una región
  onRegionChange(): void {
    console.log('Lista de Provincias por Id Provinca', this.selectedRegionId);
    if (this.incidenciaForm.get('region')?.value) {
      this.incidenciaService.getByIdProvincia(this.incidenciaForm.get('region')?.value).subscribe({
        next: (data: ProvinciaDao[]) => { this.provincias = data, console.log('Lista de Provincias', data) },
        error: (err) => console.error('Error al cargar provincias:', err)
      });
      this.distritos = [];
      this.colegios = [];
    }
  }

  // Cargar distritos al seleccionar una provincia
  onProvinciaChange(): void {
    console.log('Lista de Distritos por Id Provinca', this.selectedProvinciaId);
    if (this.incidenciaForm.get('provincia')?.value) {
      this.incidenciaService.getByIdDistrito(this.incidenciaForm.get('provincia')?.value).subscribe({
        next: (data: DistritoDao[]) => { this.distritos = data, console.log('Lista de Distritos|', data) },
        error: (err) => console.error('Error al cargar distritos:', err)
      });
      this.colegios = [];
    }
  }

  // Cargar colegios al seleccionar un distrito
  onDistritoChange(): void {
    console.log('Lista de Colegios por Id Distrito', this.selectedDistritoId);
    if (this.incidenciaForm.get('distrito')?.value) {
      this.incidenciaService.getByIdColegio(this.incidenciaForm.get('distrito')?.value).subscribe({
        next: (data: ColegioDao[]) => {
          this.colegios = data;
          console.log('Lista de Colegios por Id Distrito', data);
        },
        error: (err) => console.error('Error al cargar colegios:', err)
      });
    }
  }

  onColegioInput(): void {
    console.log('Usuario está buscando:', this.searchQuery);
    // Puedes filtrar los colegios aquí si lo necesitas.
  }

  ngAfterViewInit(): void {
    const modalElement = document.getElementById('myModal') as HTMLElement;
    if (modalElement) {
      this.modalInstance = new Modal(modalElement);

      // Ejecutar loadCoordenadas cuando el usuario abre el modal 2
      modalElement.addEventListener('shown.bs.modal', () => {
        //this.loadCoordenadas();
      });
    } else {
      console.error('No se encontró el modal en el DOM.');
    }
  }
  //Fin Metodos Para El Modal Registrar


  //Inicio Metodos Para El Modal Buscar
  buscarPorTipoYNumero(tipoDoc: string, nroDoc: string): void {
    this.incidenciaService.buscarPorTipoYNumero(tipoDoc, nroDoc).subscribe(
      (data) => {
        console.log('Resultados por Tipo y Número:', data);
        this.incidencias = data;

        if (this.incidencias.length > 0) {
          this.resultado_busqueda(); // Mostrar modal de resultados
          this.incidenciasFiltradas = this.incidencias;
        } else {
          alert("No se encontraron incidencias para este documento.");
        }
      },
      (error) => {
        console.error('Error al obtener incidencias por Tipo y Número', error);
        alert("Ocurrió un error al buscar incidencias.");
      }
    );
  }



  buscarPorNumero(nroDoc: string): void {
    this.incidenciaService.buscarPorNumero(nroDoc).subscribe(
      (data) => {
        this.incidencias = data;
        console.log('Lista incidencia por numero', data);
      },
      (error) => {
        console.error('Error al obtener incidencias', error);
      }
    );
  }

  cerrarModal(): void {
    if (this.myModal2) {
      const modalInstance = Modal.getInstance(this.myModal2.nativeElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
  }
  //Inicio Metodos Para El Modal Buscar


  siguiente(): void {
    // Lógica para avanzar al paso 2
    document.getElementById('uno')?.classList.remove('activo');
    document.getElementById('dos')?.classList.add('activo');

    // Cargar coordenadas solo al abrir el paso 2
    this.loadCoordenadas();
  }

  siguiente2(): void {
    document.getElementById('dos')?.classList.remove('activo');
    document.getElementById('tres')?.classList.add('activo');
  }

  reinicio(): void {
    document.getElementById('uno')?.classList.remove('activo');
    document.getElementById('fin')?.classList.add('activo');
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

  toggleClassesForTipologia(selected: string, formField: string): void {
    const types = ["salud", "calidad", "otros"];
    types.forEach(type => {
      document.getElementById(type)?.classList.toggle(`${type}_activada`, type === selected);
    });
    this.incidenciaForm.get('tipologia')?.setValue(formField);
  }

  salud(): void {
    this.toggleClassesForTipologia("salud", "salud");
  }

  calidad(): void {
    this.toggleClassesForTipologia("calidad", "calidad");
  }

  otros(): void {
    this.toggleClassesForTipologia("otros", "otros");
  }

  toggleClasses(addClass: string, removeClasses: string[]): void {
    document.getElementById(addClass)?.classList.add("activo");
    removeClasses.forEach(id => document.getElementById(id)?.classList.remove("activo"));
  }

  resultado_busqueda(): void {
    this.toggleClasses("resultado_busqueda", ["buscar_documento"]);
  }

  salir_busqueda(): void {
    this.toggleClasses("buscar_documento", ["resultado_busqueda", "detalle_busqueda_incidencia"]);
  }

  detalle_busqueda_incidencia(incidencia: IncidenciaDao): void {
    this.incidenciaSeleccionada = incidencia;
    this.toggleClasses("detalle_busqueda_incidencia", ["resultado_busqueda"]);
  }


  salir_detalle(): void {
    this.toggleClasses("resultado_busqueda", ["buscar_documento", "detalle_busqueda_incidencia"]);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    console.log(window.scrollY);
    const nav = document.getElementById('home');
    if (nav) {
      if (window.scrollY > 100) {
        nav.classList.add("navbar1");
      } else {
        nav.classList.remove("navbar1");
      }
    }
  }
}
