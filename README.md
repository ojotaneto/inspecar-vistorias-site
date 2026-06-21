# Site InspeCar - Vistoria Pré-Compra

Projeto front-end simples em HTML, CSS e JavaScript puro.

## Como abrir

Abra o arquivo `index.html` no navegador.

Para evitar bloqueios de navegador com carregamento local, o ideal é abrir usando um servidor local. No VS Code, você pode usar a extensão **Live Server**.

## Estrutura

```txt
inspecar-site/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── assets/
    └── img/
        ├── brand/
        │   ├── logo-inspecar.png
        │   ├── icone-inspecar.png
        │   ├── oficina-bg.jpg
        │   └── especialista-jose.jpg
        └── carros/
            ├── 1.png
            ├── 2.png
            ├── 3.png
            ├── 4.png
            ├── 5.png
            └── README.txt
```

## Como adicionar carros ao carrossel

Coloque novas imagens na pasta:

```txt
assets/img/carros/
```

Use nomes numéricos em sequência:

```txt
1.png
2.png
3.png
4.png
5.png
6.png
7.png
...
```

O JavaScript procura automaticamente por `1.png`, `2.png`, `3.png` e assim por diante.

O arquivo `js/script.js` possui um verificador para parar a busca quando começa a encontrar erros depois do último número existente. Assim, se o site chegar em `6.png` e ele não existir, a página não quebra.

## Atenção às placas

As imagens iniciais já foram salvas com as placas ocultadas. Para novas fotos, esconda ou borre a placa antes de colocar no site.

## Trocar telefone, email ou texto

Edite diretamente o arquivo `index.html`. Os links do WhatsApp usam o padrão:

```txt
https://wa.me/5581984443636
```

Troque pelo número correto se necessário.
