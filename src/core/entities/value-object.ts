//usamos essa classe para classes que são formadas de mais de uma entidade, ou seja que não possui um identificador para a classe e se tivermos 2 objetos com o mesmo conteudo eles não se diferenciam, ao contrario de uma entidade.

export abstract class ValueObject<Props> {
  protected props: Props;

  constructor(props: Props) {
    this.props = props;
  }

  public equals(vo: ValueObject<unknown>) {
    if (vo === null || vo === undefined) return false;

    if (vo.props === undefined) return false;

    return JSON.stringify(vo.props) === JSON.stringify(this.props);
  }
}
