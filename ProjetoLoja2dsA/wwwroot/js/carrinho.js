// === Funções básicas do carrinho (localStorage) ===
function getCarrinho() {
    return JSON.parse(localStorage.getItem("carrinho")) || [];
}

function setCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// Atualiza badge do ícone de carrinho (se existir)
function atualizarBadgeCarrinho() {
    const carrinho = getCarrinho();
    const totalItens = carrinho.reduce((soma, item) => soma + item.qtd, 0);

    const badge = document.getElementById("cart-count-badge");
    if (badge) {
        badge.textContent = totalItens;
        badge.style.display = totalItens > 0 ? "inline-block" : "none";
    }
}

// === Adicionar jogo (chamado nos cards) ===
function adicionarAoCarrinho(nome, preco) {
    // garante que o preço vire número
    const precoNumero = parseFloat(String(preco).replace(",", "."));

    let carrinho = getCarrinho();

    const existente = carrinho.find(i => i.nome === nome);
    if (existente) {
        existente.qtd += 1;
    } else {
        carrinho.push({
            nome: nome,
            preco: precoNumero,
            qtd: 1
        });
    }

    setCarrinho(carrinho);
    atualizarBadgeCarrinho();

    alert(`${nome} adicionado ao carrinho!`);
}

// === Remover item (ícone de lixeira) ===
function removerDoCarrinho(index) {
    let carrinho = getCarrinho();
    carrinho.splice(index, 1);
    setCarrinho(carrinho);
    atualizarBadgeCarrinho();
    carregarCarrinho();
}

// === Montar tabela na tela de carrinho ===
function carregarCarrinho() {
    const carrinho = getCarrinho();
    const corpo = document.getElementById("cart-body");
    const totalSpan = document.getElementById("cart-total");
    const btnFinalizar = document.getElementById("btn-finalizar");

    if (!corpo) return; // não está na página de carrinho

    corpo.innerHTML = "";
    let total = 0;

    if (carrinho.length === 0) {
        corpo.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-4 text-muted">
                    Seu carrinho está vazio
                </td>
            </tr>`;
        if (totalSpan) totalSpan.textContent = "R$ 0,00";
        if (btnFinalizar) btnFinalizar.disabled = true;
        return;
    }

    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.qtd;
        total += subtotal;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.nome}</td>
            <td class="text-center">${item.qtd}</td>
            <td class="text-end">R$ ${subtotal.toFixed(2).replace('.', ',')}</td>
            <td class="text-end">
                <button class="btn btn-link text-danger p-0" onclick="removerDoCarrinho(${index})" title="Remover">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        corpo.appendChild(tr);
    });

    if (totalSpan) {
        totalSpan.textContent = "R$ " + total.toFixed(2).replace('.', ',');
    }
    if (btnFinalizar) {
        btnFinalizar.disabled = false;
    }
}

// Quando qualquer página carregar, atualiza badge e, se for o carrinho, monta a tabela
document.addEventListener("DOMContentLoaded", function () {
    atualizarBadgeCarrinho();
    carregarCarrinho();
});
