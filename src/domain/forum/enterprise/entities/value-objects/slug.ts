// prettier-ignore
export class Slug {
  public value: string;

  constructor(value: string) {
    this.value = value;
  }

  //An example title -> an-example-title
  static createFromText(text: string) {
    const slugText = text
    .normalize("NFKD") //tirar os acentos do texto
    .toLowerCase() 
    .replace(/\s+/g, '-') // \s -> pega todos espaços em branco, e + pega um ou mais
    .replace(/_/g, '-')
    .replace(/--/g, '-')
    .replace(/-$/g, '')
    .trim()

    return new Slug(slugText)
  }
}

// Agora podemos usar de duas formas
//-> slug não existe no banco -> Slug.createFromText('texto de exemplo')
//-> slug existe no banco -> new Slug('uma-slug-ja-criada')
