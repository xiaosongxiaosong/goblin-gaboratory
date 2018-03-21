import React from 'react';
import PropTypes from 'prop-types';
import marked, { Renderer } from 'marked';
import highlightjs from 'highlight.js';
import 'highlight.js/styles/monokai.css';

const renderer = new Renderer();
renderer.code = (code, language) => {
  // Check whether the given language is valid for highlight.js.
  const validLang = !!(language && highlightjs.getLanguage(language));
  // Highlight only if the language is valid.
  const highlighted = validLang ? highlightjs.highlight(language, code).value : code;
  // Render the highlighted code with `hljs` class.
  return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
};

// Set the renderer to marked.
marked.setOptions({ renderer });


class Marked extends React.PureComponent {
  render() {
    // eslint-disable-next-line
    return <div dangerouslySetInnerHTML={{ __html: marked(this.props.context) }} />;
  }
}

Marked.propTypes = {
  context: PropTypes.string,
};

export default Marked;
