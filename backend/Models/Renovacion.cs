using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Renovacion
    {
        public int IdRenovacion { get; set; }
        public int IdMiembro { get; set; }
        public int IdPago { get; set; }
        public int IdDocumento { get; set; }
        public DateTime FechaSolicitud { get; set; }
        public DateTime FechaAprobacion { get; set; }
        public string Estado { get; set; }
    }
}
