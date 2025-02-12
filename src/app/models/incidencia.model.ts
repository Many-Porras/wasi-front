import { ColegioDao } from "./colegio.model";

export interface IncidenciaDao {
  IdColegio: string;
  TipoIncidencia: string;
  Tipologia: string;
  TipoDocumentoTutor: string;
  NumeroDocumentoTutor: string;
  NombreTutor: string;
  CelularTutor: string;
  DetalleIncidencia: string;
  Archivo: File | null;
  Estado: string;
  FechaReagendado: string | null;

  Colegio: ColegioDao;
}
