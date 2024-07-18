using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Documento
    {
        public int IdDocumento { get; set; }
        public int IdMiembro { get; set; }
        public string TipoDocumento { get; set; }
        public string DocumentoUrl { get; set; }
        public DateTime FechaCarga { get; set; }
        public string Estado { get; set; }
    }
}