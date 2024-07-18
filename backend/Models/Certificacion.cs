using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Certificacion
    {
        public int IdCertificacion { get; set; }
        public int IdDocumento { get; set; }
        public string TipoCertificacion { get; set; }
        public DateTime FechaEmision { get; set; }
        public DateTime FechaExpiracion { get; set; }
        public string CertificadoUrl { get; set; }
        public string Estado { get; set; }
    }
}
