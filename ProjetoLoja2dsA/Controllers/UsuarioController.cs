//IMPORTA AS BIBLIOTECAS QUE SERÃO UTILIZADAS NO PROJETO
using Microsoft.AspNetCore.Mvc;
using ProjetoLoja2dsA.Repositorio;
using ProjetoLoja2dsA.Models;




//DEFINE O NOME E ONDE A CLASSE USUARIOCONTROLLER ESTÁ LOCALIZADA
//NAMESPACE AJUDA A ORGANIZAR O CODIGO E EVITAR CONFLITOS
namespace ProjetoLoja2dsA.Controllers
{
    //CLASSE USUARIOCONTROLLER QUE ESTÁ HERDADO DA CLASSE PAI CONTROLLER
    public class UsuarioController : Controller
    {
        //DECLARA A VARIAVEL PRIVADA E SOMENTE LEITURA DO TIPO USUARIOREPOSITORIO
        //INSTANCIA O _usuarioController PARA SER ATRIBUIDO NO CONSTRUTOR E INTERAGIR COM OS DADOS
        private readonly UsuarioRepositorio _usuarioRepositorio;

        //DEFINE O CONSTRUTOR DA CLASSE USUARIOCONTROLLER
        //RECEBE A INSTANCIA DE USUARIO REPOSITORIO 
        public UsuarioController(UsuarioRepositorio usuarioRepositorio)
        {
            // O CONSTRUTOR É CHAMADO QUANDO UMA NOVA INSTANCIA É CRIADA
            _usuarioRepositorio = usuarioRepositorio;
        }

        [HttpGet]
        //INTERFACE É UMA REPRESENTAÇAO DO RESULTADO (TELA)
        public IActionResult Login()
        {
            //RETORNA A PAGINA INDEX
            return View();
        }

        [HttpPost]
        public IActionResult Login(string email, string senha)
        {
            var usuario = _usuarioRepositorio.ObterUsuario(email);

            if (usuario != null && usuario.Senha == senha)
            {
                return RedirectToAction("Index", "Home");
            }
            ModelState.AddModelError("", "Email / senha Inválidos");


            //RETORNA A PAGINA INDEX
            return View();
        }


            //INTERFACE QUE REPRESENTA O RESULTADO DA PAGINA 
            public IActionResult Index()
        {
            return View();
        }

        //CADASTRO DO USUARIO

        public IActionResult Cadastro()
        {
            return View();

        }

        [HttpPost]
        public IActionResult Cadastro(Usuario usuario)
        {
            if (ModelState.IsValid)
            {
                _usuarioRepositorio.AdicionarUsuario(usuario);
                return RedirectToAction("Login");
            }
            return View(usuario);

        }



    }
}
