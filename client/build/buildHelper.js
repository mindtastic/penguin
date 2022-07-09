export const removeViteLoader = (html) => {
  const match = html.match(/(<script type="module">[\s\S]*)(const (\S)=function\(\)\{[\s\S]*\};\3\(\);)/);
  if (!match || match.length < 3) {
    return html;
  }
  return html.replace(match[1], ' <script type="module">').replace(match[2], '');
};

export default {
  removeViteLoader,
};
