class JSONHTMLParserService {

  static parseJSON(json: any): string {

    return json.map((el: { tag?: any; content?: any; }) => {
      if (el.tag !== undefined && el.content !== undefined) {
        const { tag, content } = el;
        return `<${tag}>${content}</${tag}>`;
      } else {
        return '';
      }
    }).join('');

  }

}

export default JSONHTMLParserService;
