// ==============================
// Botão "Voltar ao topo"
// ==============================
const topBtn = document.getElementById("topBtn");

if (topBtn) {
  window.addEventListener("scroll", () => {
    topBtn.style.display =
      document.documentElement.scrollTop > 300 ? "block" : "none";
  });

  topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ==============================
// PostHog seguro (evita erros se bloqueado)
// ==============================
!(function (t, e) {
  var o, n, p, r;
  if (!e.__SV) {
    window.posthog = e;
    e._i = [];
    e.init = function (i, s, a) {
      function g(t, e) {
        var o = e.split(".");
        2 == o.length && ((t = t[o[0]]), (e = o[1])),
          (t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          });
      }
      (p = t.createElement("script")).type = "text/javascript";
      p.crossOrigin = "anonymous";
      p.async = !0;
      p.src =
        s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") +
        "/static/array.js";
      (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r);
      var u = e;
      void 0 !== a ? (u = e[a] = []) : (a = "posthog");
      u.people = u.people || [];
      u.toString = function (t) {
        var e = "posthog";
        return "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e;
      };
      u.people.toString = function () {
        return u.toString(1) + ".people (stub)";
      };
      o =
        "init capture identify opt_in_capturing opt_out_capturing reset on".split(
          " "
        );
      for (n = 0; n < o.length; n++) g(u, o[n]);
      e._i.push([i, s, a]);
    };
    e.__SV = 1;
  }
})(document, window.posthog || {});

if (typeof posthog !== "undefined") {
  try {
    posthog.init("phc_yJW1VjHGGwmCbbrtczfqqNxgBDbhlhOWcdzcIJEOTFE", {
      api_host: "https://us.i.posthog.com",
      person_profiles: "identified_only",
    });
  } catch (err) {
    console.warn("PostHog bloqueado ou não disponível", err);
  }
} else {
  console.warn("PostHog não carregou (provavelmente bloqueado pelo navegador).");
}

// ==============================
// Agendamento -> WhatsApp + Toast de confirmação
// ==============================
const agForm = document.getElementById("agendamentoForm");

if (agForm) {
  agForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("ag-nome").value.trim();
    const telefone = document.getElementById("ag-telefone").value.trim();
    const mensagem = document.getElementById("ag-mensagem").value.trim();

    if (!nome || !telefone) {
      alert("Por favor, preencha Nome e Telefone.");
      return;
    }

    const texto = encodeURIComponent(
      `Olá, meu nome é ${nome}. Meu telefone é ${telefone}. Mensagem: ${mensagem}`
    );

    const numero = "5511942338984";
    const url = `https://wa.me/${numero}?text=${texto}`;

    // Abrir WhatsApp
    const opened = window.open(url, "_blank");
    if (!opened) {
      window.location.href = url;
    }

    // Toast de confirmação
    const toast = document.createElement("div");
    toast.textContent = "Mensagem enviada! Abrindo WhatsApp...";
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "#22c55e";
    toast.style.color = "#fff";
    toast.style.padding = "12px 20px";
    toast.style.borderRadius = "8px";
    toast.style.boxShadow = "0 4px 6px rgba(0,0,0,0.2)";
    toast.style.fontSize = "0.9rem";
    toast.style.zIndex = "9999";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.style.opacity = "1");
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 4000);

    agForm.reset();
  });
}


// ==============================
// Feedback dinâmico (localStorage + excluir)
// ==============================
const formFeedback = document.getElementById("feedbackForm");
const containerFeedback = document.getElementById("feedbackContainer");
let semFeedback = document.getElementById("semFeedback");

function salvarFeedbacks(lista) {
  localStorage.setItem("feedbackList", JSON.stringify(lista));
}

function renderFeedbackCard({ nome, mensagem, ts }) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `<p>"${mensagem}"</p><p>- ${nome}</p>`;
  const btnExcluir = document.createElement("button");
  btnExcluir.textContent = "Excluir";
  btnExcluir.className = "btn-excluir";
  btnExcluir.addEventListener("click", () => {
    card.remove();
    let lista = JSON.parse(localStorage.getItem("feedbackList") || "[]");
    lista = lista.filter((f) => f.ts !== ts);
    salvarFeedbacks(lista);
    if (!containerFeedback.querySelector(".card")) mostrarMensagemVazia();
  });
  card.appendChild(btnExcluir);
  return card;
}

function mostrarMensagemVazia() {
  const aviso = document.createElement("p");
  aviso.id = "semFeedback";
  aviso.style.color = "#FFD700";
  aviso.style.textAlign = "center";
  aviso.style.marginTop = "20px";
  aviso.textContent =
    "Nenhum feedback ainda. Seja o primeiro a compartilhar sua experiência! 💬";
  containerFeedback.appendChild(aviso);
  semFeedback = aviso;
}

(function carregarFeedbacks() {
  if (!containerFeedback) return;
  const lista = JSON.parse(localStorage.getItem("feedbackList") || "[]");
  if (lista.length) {
    if (semFeedback) { semFeedback.remove(); semFeedback = null; }
    lista.forEach((f) => containerFeedback.appendChild(renderFeedbackCard(f)));
  }
})();

if (formFeedback && containerFeedback) {
  formFeedback.addEventListener("submit", function (e) {
    e.preventDefault();
    const nome = document.getElementById("fb-nome")?.value.trim() || "";
    const mensagem = document.getElementById("fb-mensagem")?.value.trim() || "";
    if (!nome || !mensagem) return;
    if (semFeedback) { semFeedback.remove(); semFeedback = null; }
    const novo = { nome, mensagem, ts: Date.now() };
    containerFeedback.prepend(renderFeedbackCard(novo));
    const lista = JSON.parse(localStorage.getItem("feedbackList") || "[]");
    lista.unshift(novo);
    salvarFeedbacks(lista);
    formFeedback.reset();
  });
}

// ==============================
// Menu Hamburguer (Mobile)
// ==============================
const mobileMenu = document.getElementById("mobile-menu");
const navLinks = document.querySelector(".nav-links");

if (mobileMenu && navLinks) {
  mobileMenu.setAttribute("role", "button");
  mobileMenu.setAttribute("aria-label", "Abrir menu");
  mobileMenu.setAttribute("aria-expanded", "false");

  const openMenu = () => {
    navLinks.classList.add("active");
    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden"; 
  };

  const closeMenu = () => {
    navLinks.classList.remove("active");
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  const toggleMenu = () => {
    if (navLinks.classList.contains("active")) closeMenu();
    else openMenu();
  };

  mobileMenu.addEventListener("click", toggleMenu);
  navLinks.addEventListener("click", (e) => {
    if (e.target && e.target.tagName === "A") closeMenu();
  });
  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !mobileMenu.contains(e.target) && navLinks.classList.contains("active")) closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && navLinks.classList.contains("active")) closeMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.classList.contains("active")) closeMenu();
  });
}
