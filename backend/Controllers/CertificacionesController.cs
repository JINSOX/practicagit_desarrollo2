using System.Data.SqlClient;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CertificacionesController : ControllerBase
    {
        private readonly string _con;

        public CertificacionesController(IConfiguration configuration)
        {
            _con = configuration.GetConnectionString("conexion");
        }

        [HttpGet]
        public IEnumerable<Certificacion> Get()
        {
            List<Certificacion> certificaciones = new();
            using (SqlConnection connection = new(_con))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("ObtenerCertificaciones", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Certificacion c = new Certificacion
                            {
                                IdCertificacion = Convert.ToInt32(reader["id_certificacion"]),
                                IdDocumento = Convert.ToInt32(reader["id_documento"]),
                                TipoCertificacion = reader["tipo_certificacion"].ToString(),
                                FechaEmision = Convert.ToDateTime(reader["fecha_emision"]),
                                FechaExpiracion = Convert.ToDateTime(reader["fecha_expiracion"]),
                                CertificadoUrl = reader["certificado_url"].ToString(),
                                Estado = reader["estado"].ToString()
                            };
                            certificaciones.Add(c);
                        }
                    }
                }
            }
            return certificaciones;
        }

        [HttpPost]
        public void Post([FromBody] Certificacion c)
        {
            using (SqlConnection connection = new(_con))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("InsertarCertificacion", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id_documento", c.IdDocumento);
                    cmd.Parameters.AddWithValue("@tipo_certificacion", c.TipoCertificacion);
                    cmd.Parameters.AddWithValue("@fecha_emision", c.FechaEmision);
                    cmd.Parameters.AddWithValue("@fecha_expiracion", c.FechaExpiracion);
                    cmd.Parameters.AddWithValue("@certificado_url", c.CertificadoUrl);
                    cmd.Parameters.AddWithValue("@estado", c.Estado);
                    cmd.ExecuteNonQuery();
                }
            }
        }

        [HttpPut("{id}")]
        public void Put([FromBody] Certificacion c, int id)
        {
            using (SqlConnection connection = new(_con))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("ActualizarCertificacion", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id_certificacion", id);
                    cmd.Parameters.AddWithValue("@id_documento", c.IdDocumento);
                    cmd.Parameters.AddWithValue("@tipo_certificacion", c.TipoCertificacion);
                    cmd.Parameters.AddWithValue("@fecha_emision", c.FechaEmision);
                    cmd.Parameters.AddWithValue("@fecha_expiracion", c.FechaExpiracion);
                    cmd.Parameters.AddWithValue("@certificado_url", c.CertificadoUrl);
                    cmd.Parameters.AddWithValue("@estado", c.Estado);
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
                using (SqlCommand cmd = new SqlCommand("EliminarCertificacion", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id_certificacion", id);
                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}
