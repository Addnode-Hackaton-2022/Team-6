using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ControlApp.Controllers
{
    public class MainApiController : ApiController
    {
        private static int Level = 50;
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
        [HttpPost]
        [Route("api/MainApi/LevelUp")]
        public int LevelUp()
        {
            return ++Level;
        }
        [HttpPost]
        [Route("api/MainApi/LevelDown")]
        public int LevelDown()
        {
            return --Level;
        }
        [HttpGet]
        [Route("api/MainApi/GetAlarmLevel")]
        public int GetAlarmLevel()
        {
            return Level;
        }
        [HttpGet]
        [Route("api/MainApi/GetTankLevel")]
        public int GetTankLevel()
        {
            return 86;
        }
        // PUT api/<controller>/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}