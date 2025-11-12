//IMPORTA AS BIBLIOTECAS QUE SERÃO UTILIZADAS NO PROJETO
using Microsoft.AspNetCore.Mvc;
using ProjetoLoja2dsA.Repositorio;
using ProjetoLoja2dsA.Models;
using Org.BouncyCastle.Tls;




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
        public IActionResult Login(string Nome, string email, string senha)
        {
            var usuario = _usuarioRepositorio.ObterUsuario(email);

            if (usuario != null && usuario.Senha == senha)
            {

                // Guarda o ID do usuário na Session
                HttpContext.Session.SetInt32("UsuarioId", usuario.Id);

                // Guarda o nome ou email do usuário na Session (vai aparecer na navbar)
                HttpContext.Session.SetString("EmailUsuario", usuario.Email);
                // Se preferir o nome:
                // HttpContext.Session.SetString("NomeUsuario", usuario.Nome);

                HttpContext.Session.SetString("NomeUsuario", usuario.Nome);

                // 👉 Aqui usamos SEMPRE uma foto padrão
                string foto = "/pastafotos/avatar-default.png";

                // Guarda a URL da foto na Session
                HttpContext.Session.SetString("AvatarUrl", foto);

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

        // MOSTRA O FORMULÁRIO DE EDIÇÃO
        [HttpGet]
        public IActionResult Editar()
        {
            // Verifica se o usuário está logado
            var id = HttpContext.Session.GetInt32("UsuarioId");
            if (id == null)
                return RedirectToAction("Login");

            // Busca os dados do usuário no banco
            var usuario = _usuarioRepositorio.ObterPorId(id.Value);
            if (usuario == null)
                return NotFound();

            return View(usuario);
        }


        // SALVA AS ALTERAÇÕES NO BANCO
        [HttpPost]
        public IActionResult Editar(Usuario usuario)
        {
            if (ModelState.IsValid)
            {
                _usuarioRepositorio.AtualizarUsuario(usuario);

                // Atualiza também a Session
                HttpContext.Session.SetString("NomeUsuario", usuario.Nome);
                HttpContext.Session.SetString("EmailUsuario", usuario.Email);

                TempData["MensagemSucesso"] = "Informações atualizadas com sucesso!";
                return RedirectToAction("Perfil");
            }

            TempData["MensagemErro"] = "Erro ao salvar alterações.";
            return View(usuario);
        }


        [HttpPost]
        public IActionResult Logout()
        {
            // APAGA TUDO QUE ESTÁ NA SESSION
            HttpContext.Session.Clear();

            // VOLTA PARA A PÁGINA INICIAL
            return RedirectToAction("Index", "Home");
        }


        public IActionResult Perfil()
        {
            // pega os dados da sessão
            var nome = HttpContext.Session.GetString("NomeUsuario");
            var email = HttpContext.Session.GetString("EmailUsuario");
            var foto = HttpContext.Session.GetString("AvatarUrl") ?? "/pastafotos/avatar-default.png";

            // se não tiver nome na sessão, não está logado → manda pro login
            if (string.IsNullOrEmpty(nome))
            {
                return RedirectToAction("Login");
            }

            // passa os dados para a view via ViewBag (simples, sem criar model novo)
            ViewBag.Nome = nome;
            ViewBag.Email = email;
            ViewBag.Foto = foto;
            return View();

        }


    }
}
