using ProjetoLoja2dsA.Repositorio;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// HABILITA CACHE EM MEMÓRIA, USADO PELA SESSION
builder.Services.AddDistributedMemoryCache();

// CONFIGURA A SESSION (TEMPO, COOKIE ETC.)
builder.Services.AddSession(options =>
{
    // quanto tempo a sessão fica ativa sem uso (30 minutos aqui)
    options.IdleTimeout = TimeSpan.FromMinutes(30);

    // por segurança, cookie só acessível via HTTP (não JS)
    options.Cookie.HttpOnly = true;

    // marca o cookie como essencial (sempre grava)
    options.Cookie.IsEssential = true;
});


//ADICIONANDO A ENJEÇÃO DE DEPENDENCIA
builder.Services.AddScoped<UsuarioRepositorio>(); //repositorio do usuario

var app = builder.Build();



// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}
app.UseStaticFiles();

app.UseRouting();

// ATIVA A SESSION EM TODAS AS REQUISIÇÕES
app.UseSession();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
