import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IncidenciaDato } from '../models/incidencia.model';
import { RegionDao } from '../models/region.model';
import { ProvinciaDao } from '../models/provincia.model';
import { DistritoDao } from '../models/distrito.model';
import { ColegioDao } from '../models/colegio.model';

@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {
  private apiUrlIncidencia = environment.apiWeb + 'incidencia/';
  private apiUrlCoordenadas = environment.apiWeb + 'distrito/';
  private apiUrlRegion = environment.apiWeb + 'region/';
  private apiUrlProvincia = environment.apiWeb + 'provincia/';
  private apiUrlDistrito = environment.apiWeb + 'distrito/';
  private apiUrlColegio = environment.apiWeb + 'colegio/';

  constructor(private http: HttpClient) { }

  // Crear-Guardar nuevo sistema
  registrarIncidencia(incidencia: IncidenciaDato): Observable<IncidenciaDato> {
    return this.http.post<IncidenciaDato>(`${this.apiUrlIncidencia}registrar`, incidencia);
  }

  obtenerDistritoPorCoordenadas(longitud: string, latitud: string): Observable<DistritoDao> {
    const url = `${this.apiUrlCoordenadas}/por-coordenadas?longitud=${longitud}&latitud=${latitud}`;
    return this.http.get<DistritoDao>(url);
  }

  // Obtener Listar todas las Regiones
  getAllRegion(): Observable<RegionDao[]> {
    return this.http.get<RegionDao[]>(this.apiUrlRegion);
  }

  // Obtener Provincia por Id de Region
  getByIdProvincia(idRegion: string): Observable<ProvinciaDao[]> {
    return this.http.get<ProvinciaDao[]>(`${this.apiUrlProvincia}${idRegion}`);
  }

  // Obtener Distrito por Id de provincia
  getByIdDistrito(idProvincia: string): Observable<DistritoDao[]> {
    return this.http.get<DistritoDao[]>(`${this.apiUrlDistrito}${idProvincia}`);
  }

  // Obtener Colegio por Id de Distrito
  getByIdColegio(idDistrito: string): Observable<ColegioDao[]> {
    return this.http.get<ColegioDao[]>(`${this.apiUrlColegio}${idDistrito}`);
  }
}
