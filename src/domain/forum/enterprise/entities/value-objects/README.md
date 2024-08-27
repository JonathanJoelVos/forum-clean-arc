# Value Objects

Value Objects são um conceito fundamental em Domain-Driven Design (DDD), uma abordagem de design de software que foca em modelar o domínio de negócios de maneira rica e expressiva. Value Objects são um dos elementos centrais dessa abordagem, usados para representar conceitos do domínio que são descritos exclusivamente pelos seus atributos, e não possuem identidade própria.

Aqui estão algumas características chave dos Value Objects:

- Imutabilidade: Um Value Object é imutável. Isso significa que uma vez criado, seu estado não pode ser alterado. Se for necessário um valor diferente, um novo objeto é criado.

- Sem Identidade Própria: Value Objects não possuem uma identidade própria. Dois Value Objects com os mesmos valores de atributos são considerados iguais. Isso contrasta com Entidades, que possuem uma identidade única mesmo que todos os seus atributos sejam iguais aos de outra entidade.

- Igualdade Baseada em Atributos: A igualdade de Value Objects é determinada pelos seus atributos. Dois Value Objects são iguais se todos os seus atributos são iguais.

- Auto-Contidos: Value Objects geralmente encapsulam lógica de negócios relacionada aos seus atributos. Isso pode incluir validações, cálculos e outras operações relevantes para o domínio.

### Exemplos de Value Objects

**Money**: Um exemplo clássico de Value Object é a representação de dinheiro. Um objeto Money pode ter atributos como a quantia e a moeda, e sua igualdade é determinada pela combinação desses atributos. Por exemplo:

```java
public class Money {
private final BigDecimal amount;
private final Currency currency;

    public Money(BigDecimal amount, Currency currency) {
        this.amount = amount;
        this.currency = currency;
    }

    // Métodos para operações como soma, subtração, etc.

}
```

**Endereço**: Um endereço de entrega pode ser modelado como um Value Object, com atributos como rua, cidade, estado e CEP. Dois endereços com os mesmos valores de atributos são considerados iguais.

**Data**: Em muitos contextos, uma data (por exemplo, data de nascimento) pode ser um Value Object, representando um ponto específico no tempo.

### Vantagens dos Value Objects

- Simplificação do Modelo de Domínio: Como eles são imutáveis e sem identidade própria, Value Objects simplificam o modelo de domínio, reduzindo a complexidade associada ao gerenciamento de identidade e ciclo de vida.
- Facilitam a Modelagem Rica: Permitem encapsular lógica de negócios e regras de validação diretamente no objeto, tornando o modelo mais expressivo e robusto.
- Segurança e Consistência: A imutabilidade garante que o estado de um Value Object não pode ser alterado inadvertidamente, aumentando a segurança e consistência do modelo.
- Value Objects são uma poderosa ferramenta em DDD para criar modelos de domínio que são ricos, expressivos e alinhados com os conceitos de negócios que representam.
