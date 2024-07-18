using System.Data.SqlClient;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PagosController : ControllerBase
    {
        private readonly string _con;

        public PagosController(IConfiguration configuration)
        {
            _con = configuration.GetConnectionString("conexion");
        }

        [HttpGet]
        public IEnumerable<Pago> Get()
        {
            List<Pago> pagos = new();
            using (SqlConnection connection = new(_con))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("ObtenerPagos", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Pago p = new Pago
                            {
                                IdPago = Convert.ToInt32(reader["id_pago"]),
                                IdMiembro = Convert.ToInt32(reader["id_miembro"]),
                                Monto = Convert.ToDecimal(reader["monto"]),
                                FechaPago = Convert.ToDateTime(reader["fecha_pago"]),
                                TipoPago = reader["tipo_pago"].ToString(),
                                ComprobanteUrl = reader["comprobante_url"].ToString(),
                                Estado = reader["estado"].ToString()
                            };
                            pagos.Add(p);
                        }
                    }
                }
            }
            return pagos;
        }

        [HttpPost]
        public void Post([FromBody] Pago p)
        {
            using (SqlConnection connection = new(_con))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("InsertarPago", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id_miembro", p.IdMiembro);
                    cmd.Parameters.AddWithValue("@monto", p.Monto);
                    cmd.Parameters.AddWithValue("@fecha_pago", p.FechaPago);
                    cmd.Parameters.AddWithValue("@tipo_pago", p.TipoPago);
                    cmd.Parameters.AddWithValue("@comprobante_url", p.ComprobanteUrl);
                    cmd.Parameters.AddWithValue("@estado", p.Estado);
                    cmd.ExecuteNonQuery();
                }
            }
        }

        [HttpPut("{id}")]
        public void Put([FromBody] Pago p, int id)
        {
            using (SqlConnection connection = new(_con))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("ActualizarPago", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id_pago", id);
                    cmd.Parameters.AddWithValue("@id_miembro", p.IdMiembro);
                    cmd.Parameters.AddWithValue("@monto", p.Monto);
                    cmd.Parameters.AddWithValue("@fecha_pago", p.FechaPago);
                    cmd.Parameters.AddWithValue("@tipo_pago", p.TipoPago);
                    cmd.Parameters.AddWithValue("@comprobante_url", p.ComprobanteUrl);
                    cmd.Parameters.AddWithValue("@estado", p.Estado);
                    cmd.ExecuteNonQuery();
                }
            }
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            using (SqlConnection connection = new(_con))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("EliminarPago", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id_pago", id);
                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}
