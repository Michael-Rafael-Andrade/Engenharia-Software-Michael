Feature: Interacao do Usuario e Inversao de String

  Scenario: Inversao de string atraves do formulario
    Given O servidor esta rodando em "http://localhost:3001"
    When O usuario digita "caminho" no campo de texto
    And Clica no botao "Inverter"
    Then Deve ser redirecionado para a pagina de resultado
    And O texto na pagina deve conter "ohnimac"
    
