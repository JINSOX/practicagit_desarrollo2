using System.Data.SqlClient;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RenovacionesController : ControllerBase
    {
        private readonly string _con;

        public RenovacionesController(IConfiguration configuration)
        {
            _con = configuration.GetConnectionString("conexion");
        }

        [HttpGet]
        public IEnumerable<Renovacion> Get()
        {
            List<Renovacion> renovaciones = new();
            using (SqlConnection connection = new(_con))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("ObtenerRenovaciones", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Renovacion r = new Renovacion
                            {
                                IdRenovacion = Convert.ToInt32(reader["id_renovacion"]),
                                IdMiembro = Convert.ToInt32(reader["id_miembro"]),
                                IdPago = Convert.ToInt32(reader["id_pago"]),
                                IdDocumento = Convert.ToInt32(reader["id_documento"]),
                                FechaSolicitud = Convert.ToDateTime(reader["fecha_solicitud"]),
                                FechaAprobacion = Convert.ToDateTime(reader["fecha_aprobacion"]),
                                Estado = reader["estado"].ToString()
                            };
                            renovaciones.Add(r);
                        }
                    }
                }
            }
            return renovaciones;
        }

        [HttpPost]
        public void Post([FromBody] Renovacion r)
        {
            using (SqlConnection connection = new(_con))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("InsertarRenovacion", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id_miembro", r.IdMiembro);
                    cmd.Parameters.AddWithValue("@id_pago", r.IdPago);
                    cmd.Parameters.AddWithValue("@id_documento", r.IdDocumento);
                    cmd.Parameters.AddWithValue("@fecha_solicitud", r.FechaSolicitud);
                    cmd.Parameters.AddWithValue("@fecha_aprobacion", r.FechaAprobacion);
                    cmd.Parameters.AddWithValue("@estado", r.Estado);
                    cmd.ExecuteNonQuery();
                }
            }
        }

        [HttpPut("{id}")]
        public void Put([FromBody] Renovacion r, int id)
        {
            using (SqlConnection connection = new(_con))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("ActualizarRenovacion", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id_renovacion", id);
                    cmd.Parameters.AddWithValue("@id_miembro", r.IdMiembro);
                    cmd.Parameters.AddWithValue("@id_pago", r.IdPago);
                    cmd.Parameters.AddWithValue("@id_documento", r.IdDocumento);
                    cmd.Parameters.AddWithValue("@fecha_solicitud", r.FechaSolicitud);
                    cmd.Parameters.AddWithValue("@fecha_aprobacion", r.FechaAprobacion);
                    cmd.Parameters.AddWithValue("@estado", r.Estado);
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
                using (SqlCommand cmd = new SqlCommand("EliminarRenovacion", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id_renovacion", id);
                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}
