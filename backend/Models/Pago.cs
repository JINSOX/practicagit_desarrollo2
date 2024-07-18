using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class Pago
    {
        public int IdPago { get; set; }
        public int IdMiembro { get; set; }
        public decimal Monto { get; set; }
        public DateTime FechaPago { get; set; }
        public string TipoPago { get; set; }
        public string ComprobanteUrl { get; set; }
        public string Estado { get; set; }
    }
}
