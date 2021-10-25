# Graphic programmer challenge

Repositório dedicado ao desafio de programação da empresa Molde.me para a vaga de programador gráfico. O código foi desenvolvido usando a linguagem Javascript e a API gráfica de baixo nível WebGL.

![](logo.png)



## Instruções de instalação

WebGL2 gera um erro de "cross-origin data" ao executar o programa diretamente. Para que seja executado corretamente, é necessarios coloca-lo em um servirdor Web local. Para isso basta instalar um servidor Web (no caso, para esse desenvolvimento foi usado o XAMPP), isserir os arquivos do repositiorio no servidor (no caso do XAMPP, colocar os arquvios na pasta htdocs), iniciar o servirdor, e acessar a aplicação (localhost/graphic-programmer-challenge).

Em caso de problemas com a instalação, o software pode ser acessado através de: https://drvengine.com/graphic-programmer-challenge/



## Testes automatizados

Para executar os testes automatizados o Python 3 juntamente com a biblioteca selenium devem estar instalados (O comando "pip install selenium" pode ser usado para isso, uma vez que o Python esteja instalado).  O driver selenium deve ser colocado na pasta raiz do diretorio e pode ser obtido neste link: https://chromedriver.storage.googleapis.com/index.html?path=94.0.4606.61/. Vale lembrar que o Google Chrome foi usado para os testes neste projeto.

Para executar os testes automatizados basta digitar no terminal "py test.py". O teste é simples, para verificar se os valores estão corretos, o teste executará a simulação, e irá comparar os valores da simulação com os valores gerados analiticamente, e exibira o erro no console (Haverá erro devido ao erro do processo de integração numérica).

O servidor Web deve estar configura, ou a linha de código "driver.get("http://localhost/WebGL/")" deve ser alterada para apontar para o domínio "https://drvengine.com/graphic-programmer-challenge/"

## Créditos

As logos usada nesse documento e no ícone da página são de propriedade da empresa Molde.me e foram usadas apenas para ilustrar origem do desafio. Os sprites usados foram fornecidos pela empresa para realização do desafio.